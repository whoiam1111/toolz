import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './Navigation';
import Footer from './about/components/Footer';

export const metadata = {
    title: 'TOOL:Z | 툴즈',
    description: '질문과 자기이해를 위한 TOOL:Z | 툴즈',
    keywords: ['TOOL:Z', '툴즈', '자기이해', '자기성찰', '심리', '질문', '문장완성'],
    openGraph: {
        title: 'TOOL:Z | 툴즈',
        description: '질문과 자기이해를 위한 TOOL:Z | 툴즈',
        url: 'https://toolz.co.kr', // 실제 도메인으로 변경
        siteName: 'TOOL:Z | 툴즈',
        locale: 'ko_KR',
        type: 'website',
    },
    icons: {
        icon: [
            { url: '/icon/favicon.ico' },
            { url: '/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
        apple: [{ url: '/icon/apple-icon.png' }, { url: '/icon/apple-icon-180x180.png', sizes: '180x180' }],
    },

    manifest: '/icon/manifest.json',
    alternates: {
        canonical: 'https://toolz.co.kr', // 실제 도메인으로 변경
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body style={{ backgroundColor: '#faf8f4' }}>
                <AuthProvider>
                    <Navigation />
                    <main className="mt-[60px]">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
