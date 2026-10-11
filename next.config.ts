import type { NextConfig } from 'next';

const SUPABASE_HOST = 'caymroqwpaqyppsopyva.supabase.co';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: SUPABASE_HOST,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // 비공개 버킷 이미지(서약서, 검사 그림)의 signed URL
        protocol: 'https',
        hostname: SUPABASE_HOST,
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  // 타입 오류가 있으면 빌드가 실패한다 (ignoreBuildErrors 제거).
  // Next 16부터 빌드 중 ESLint는 실행되지 않으므로 `npm run lint`로 따로 검사한다.
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
