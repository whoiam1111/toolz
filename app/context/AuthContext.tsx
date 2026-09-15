'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js'; // 패키지 타입 참조 안정화
import { getSession, signIn, signOut, onAuthStateChange } from '../api/supabaseApi';

type AuthContextType = {
    session: Session | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // undefined: 세션 확인 중, null: 로그아웃, Session: 로그인
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12시간

    const clearLogoutTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const logout = useCallback(async () => {
        clearLogoutTimer();
        localStorage.removeItem('login_time');
        await signOut();
        setSession(null);
        router.replace('/login');
    }, [clearLogoutTimer, router]);

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

        // 💡 1. 세션 체크 프로세스
        const initSession = async () => {
            try {
                const currentSession = await getSession();

                if (!isMounted) return;

                if (currentSession) {
                    let loginTime = localStorage.getItem('login_time');
                    const now = Date.now();

                    // login_time이 없으면 현재 시각으로 부여
                    if (!loginTime) {
                        loginTime = now.toString();
                        localStorage.setItem('login_time', loginTime);
                    }

                    const elapsed = now - Number(loginTime);

                    if (elapsed >= EXPIRATION_TIME) {
                        // 12시간 지났으면 로그아웃
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

        // 💡 2. Supabase Auth Listener (세션 자동 갱신 반영)
        const { data: authListener } = onAuthStateChange((event, newSession) => {
            if (!isMounted) return;

            // Supabase에서 세션을 새로 읽어왔거나 갱신했을 때
            if (newSession) {
                setSession(newSession);
                let loginTime = localStorage.getItem('login_time');
                if (!loginTime) {
                    loginTime = Date.now().toString();
                    localStorage.setItem('login_time', loginTime);
                }
                const elapsed = Date.now() - Number(loginTime);
                if (elapsed < EXPIRATION_TIME) {
                    scheduleLogout(EXPIRATION_TIME - elapsed);
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
    }, [EXPIRATION_TIME, clearLogoutTimer, logout, scheduleLogout]);

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

    return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
