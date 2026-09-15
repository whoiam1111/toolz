'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { getSession, signIn, signOut, onAuthStateChange } from '../api/supabaseApi';

type AuthContextType = {
    session: Session | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 세션 만료 시간 설정: 12시간 (밀리초)
const EXPIRATION_TIME = 12 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // undefined: 세션 확인 중, null: 로그아웃, Session: 로그인 완료
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 자동 로그아웃 예약 타이머 정리
    const clearLogoutTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // 로그아웃 실행
    const logout = useCallback(async () => {
        clearLogoutTimer();
        localStorage.removeItem('login_time');
        await signOut();
        setSession(null);
        router.replace('/login');
    }, [clearLogoutTimer, router]);

    // 남은 시간 계산 후 로그아웃 스케줄링
    const scheduleLogout = useCallback(
        (timeLeft: number) => {
            clearLogoutTimer();
            if (timeLeft <= 0) {
                logout();
                return;
            }
            timerRef.current = setTimeout(() => {
                logout();
            }, timeLeft);
        },
        [clearLogoutTimer, logout]
    );

    useEffect(() => {
        let isMounted = true;

        // 💡 1. 초기 세션 체크 및 만료 검사
        const initSession = async () => {
            try {
                const currentSession = await getSession();

                if (!isMounted) return;

                if (currentSession) {
                    let loginTime = localStorage.getItem('login_time');
                    const now = Date.now();

                    if (!loginTime) {
                        loginTime = now.toString();
                        localStorage.setItem('login_time', loginTime);
                    }

                    const elapsed = now - Number(loginTime);

                    if (elapsed >= EXPIRATION_TIME) {
                        await logout();
                    } else {
                        setSession(currentSession);
                        scheduleLogout(EXPIRATION_TIME - elapsed);
                    }
                } else {
                    setSession(null);
                }
            } catch (err) {
                console.error('Session Init Error:', err);
                if (isMounted) setSession(null);
            }
        };

        initSession();

        // 💡 2. Supabase Auth Listener (상태 변경 감지)
        const { data: authListener } = onAuthStateChange((event, newSession) => {
            if (!isMounted) return;

            if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && newSession)) {
                setSession(newSession);
                let loginTime = localStorage.getItem('login_time');
                if (!loginTime) {
                    loginTime = Date.now().toString();
                    localStorage.setItem('login_time', loginTime);
                }
                const elapsed = Date.now() - Number(loginTime);
                if (elapsed < EXPIRATION_TIME) {
                    scheduleLogout(EXPIRATION_TIME - elapsed);
                } else {
                    logout();
                }
            } else if (event === 'SIGNED_OUT') {
                clearLogoutTimer();
                localStorage.removeItem('login_time');
                setSession(null);
            }
        });

        return () => {
            isMounted = false;
            clearLogoutTimer();
            authListener?.subscription?.unsubscribe();
        };
    }, [clearLogoutTimer, logout, scheduleLogout]);

    const login = async (email: string, password: string) => {
        const { data, error } = await signIn(email, password);
        if (error) {
            throw error;
        } else {
            setSession(data.session);
            localStorage.setItem('login_time', Date.now().toString());
            scheduleLogout(EXPIRATION_TIME);
            router.replace('/dashboard');
        }
    };

    return (
        <AuthContext.Provider value={{ session, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
    }
    return context;
};