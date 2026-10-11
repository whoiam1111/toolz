-- =====================================================================
-- TOOL:Z 보안 기반 마이그레이션 (아직 적용되지 않음)
--
-- 적용 방법: Supabase 대시보드 > SQL Editor에 붙여넣어 실행하거나 `supabase db push`
-- 적용 전 반드시 확인할 것:
--   1. 대시보드 > Authentication > Policies 에서 기존 정책을 확인하세요.
--      RLS 정책은 OR로 합쳐지므로, 기존에 "모두 허용" 같은 느슨한 정책이 남아 있으면
--      아래 정책을 추가해도 접근이 막히지 않습니다. 느슨한 기존 정책은 삭제해야 합니다.
--   2. 컬럼 이름/타입은 앱 코드에서 추정했습니다(participant.counselors = 코치 user id 등).
--      실제 스키마와 다르면 수정 후 실행하세요.
--   3. 스테이징(또는 백업 후)에서 먼저 실행해 보세요.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. 관리자 테이블과 판별 함수
--    앱은 서버 환경변수 ADMIN_EMAILS 또는 이 테이블로 관리자를 판별한다 (app/lib/admin.ts).
-- ---------------------------------------------------------------------
create table if not exists public.admins (
    user_id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "admins: 본인 행 조회" on public.admins;
create policy "admins: 본인 행 조회" on public.admins
    for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 기존 관리자 계정 등록 (이메일을 실제 관리자 계정으로 바꿔서 실행)
-- insert into public.admins (user_id)
-- select id from auth.users where email = '관리자@이메일' on conflict do nothing;

-- 참여자가 로그인한 코치 본인의 것인지 (또는 관리자인지)
create or replace function public.can_access_participant(p_participant_id anyelement)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_admin()
        or exists (
            select 1 from public.participant p
            where p.id::text = p_participant_id::text and p.counselors::text = auth.uid()::text
        );
$$;

-- ---------------------------------------------------------------------
-- 2. 참여자: 코치는 자기 참여자만, 관리자는 전체
-- ---------------------------------------------------------------------
alter table public.participant enable row level security;

drop policy if exists "participant: 코치 본인 또는 관리자" on public.participant;
create policy "participant: 코치 본인 또는 관리자" on public.participant
    for all to authenticated
    using (counselors::text = auth.uid()::text or public.is_admin())
    with check (counselors::text = auth.uid()::text or public.is_admin());

-- ---------------------------------------------------------------------
-- 3. 검사 결과 테이블: 해당 참여자에 접근 가능한 사용자만
-- ---------------------------------------------------------------------
do $$
declare
    t text;
begin
    foreach t in array array[
        'personality_tests', 'personality_tests2', 'attachment_tests',
        'core_emotion_tests', 'sixtypes', 'fourtypes', 'lifegraphs'
    ]
    loop
        execute format('alter table public.%I enable row level security', t);
        execute format('drop policy if exists "%s: 담당 코치 또는 관리자" on public.%I', t, t);
        execute format(
            'create policy "%s: 담당 코치 또는 관리자" on public.%I for all to authenticated '
            'using (public.can_access_participant(participant_id)) '
            'with check (public.can_access_participant(participant_id))',
            t, t
        );
    end loop;
end $$;

-- ---------------------------------------------------------------------
-- 4. 코치 정보: 본인 조회/수정, 관리자 전체
-- ---------------------------------------------------------------------
alter table public.counselors enable row level security;

drop policy if exists "counselors: 본인 조회" on public.counselors;
create policy "counselors: 본인 조회" on public.counselors
    for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "counselors: 본인 수정" on public.counselors;
create policy "counselors: 본인 수정" on public.counselors
    for update to authenticated
    using (user_id = auth.uid() or public.is_admin())
    with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "counselors: 관리자 추가" on public.counselors;
create policy "counselors: 관리자 추가" on public.counselors
    for insert to authenticated with check (public.is_admin());

drop policy if exists "counselors: 관리자 삭제" on public.counselors;
create policy "counselors: 관리자 삭제" on public.counselors
    for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. 공개 콘텐츠(contents, organization): 누구나 조회, 관리자만 변경
-- ---------------------------------------------------------------------
do $$
declare
    t text;
begin
    foreach t in array array['contents', 'organization']
    loop
        execute format('alter table public.%I enable row level security', t);
        execute format('drop policy if exists "%s: 공개 조회" on public.%I', t, t);
        execute format('create policy "%s: 공개 조회" on public.%I for select using (true)', t, t);
        execute format('drop policy if exists "%s: 관리자 변경" on public.%I', t, t);
        execute format(
            'create policy "%s: 관리자 변경" on public.%I for all to authenticated '
            'using (public.is_admin()) with check (public.is_admin())',
            t, t
        );
    end loop;
end $$;

-- ---------------------------------------------------------------------
-- 6. 체험 검사 응답(responses)
--    비로그인 저장은 아래 함수로만 하고, 조회/삭제는 로그인 사용자만.
--    (앱의 /trial/dashboard 는 현재 "로그인 사용자"에게 열려 있음. 관리자 전용으로 바꾸려면
--     아래 using 조건을 public.is_admin() 으로 바꾸세요.)
-- ---------------------------------------------------------------------
create or replace function public.save_trial_answers(p_clientid text, p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.responses
       set answers = coalesce(answers::jsonb, '{}'::jsonb) || p_answers
     where clientid = p_clientid;

    if not found then
        insert into public.responses (clientid, answers) values (p_clientid, p_answers);
    end if;
end;
$$;
revoke all on function public.save_trial_answers(text, jsonb) from public;
grant execute on function public.save_trial_answers(text, jsonb) to anon, authenticated;

alter table public.responses enable row level security;

drop policy if exists "responses: 로그인 사용자 조회" on public.responses;
create policy "responses: 로그인 사용자 조회" on public.responses
    for select to authenticated using (true);

drop policy if exists "responses: 로그인 사용자 삭제" on public.responses;
create policy "responses: 로그인 사용자 삭제" on public.responses
    for delete to authenticated using (true);

-- ---------------------------------------------------------------------
-- 7. Storage: 개인정보 이미지 버킷 비공개 전환
--    앱은 이 버킷들의 이미지를 signed URL로 보여주므로 (app/lib/storage.ts) 전환 후에도 동작한다.
--    파일 단위 권한은 "로그인 사용자"까지만 제한한다 (서약서는 참여자 생성 전에 업로드되므로).
-- ---------------------------------------------------------------------
update storage.buckets set public = false
 where id in ('signatures', 'sixtypes', 'fourtypes', 'lifegraph');

drop policy if exists "private images: 로그인 사용자 조회" on storage.objects;
create policy "private images: 로그인 사용자 조회" on storage.objects
    for select to authenticated
    using (bucket_id in ('signatures', 'sixtypes', 'fourtypes', 'lifegraph'));

drop policy if exists "private images: 로그인 사용자 업로드" on storage.objects;
create policy "private images: 로그인 사용자 업로드" on storage.objects
    for insert to authenticated
    with check (bucket_id in ('signatures', 'sixtypes', 'fourtypes', 'lifegraph'));

-- 공개 버킷(contents, organization-logos)은 관리자만 업로드
drop policy if exists "public assets: 관리자 업로드" on storage.objects;
create policy "public assets: 관리자 업로드" on storage.objects
    for insert to authenticated
    with check (bucket_id in ('contents', 'organization-logos') and public.is_admin());

-- 코치 프로필 사진은 로그인 사용자 업로드
drop policy if exists "counselor photos: 로그인 사용자 업로드" on storage.objects;
create policy "counselor photos: 로그인 사용자 업로드" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'counselor-photos');

-- ---------------------------------------------------------------------
-- 8. (선택) 검사 중복 제출 방지
--    재검사를 허용할지 정책을 정한 뒤 사용하세요. 기존 중복 행을 먼저 정리해야 합니다.
--    앱은 이미 "가장 최근 1건"만 읽도록 바뀌어 있어 이 단계 없이도 정상 동작합니다.
-- ---------------------------------------------------------------------
-- create unique index if not exists personality_tests_participant_uniq on public.personality_tests (participant_id);
-- (personality_tests2, attachment_tests, core_emotion_tests, sixtypes, fourtypes, lifegraphs 도 동일)
-- create unique index if not exists responses_clientid_uniq on public.responses (clientid);
