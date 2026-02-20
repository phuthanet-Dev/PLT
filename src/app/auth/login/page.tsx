'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message === 'Invalid login credentials'
                ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
                : authError.message
            );
            setLoading(false);
            return;
        }

        router.push(redirect);
        router.refresh();
    };

    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
            },
        });

        if (authError) {
            setError(authError.message);
        }
    };

    return (
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xl">
            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
                <button
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-muted hover:bg-border transition-all font-medium text-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    เข้าสู่ระบบด้วย Google
                </button>

                <button
                    onClick={() => handleOAuthLogin('facebook')}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-[#1877F2] text-white hover:bg-[#166FE5] transition-all font-medium text-sm"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    เข้าสู่ระบบด้วย Facebook
                </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">หรือ</span>
                </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-3 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                        อีเมล
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                        รหัสผ่าน
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            กำลังเข้าสู่ระบบ...
                        </span>
                    ) : (
                        'เข้าสู่ระบบ'
                    )}
                </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
                ยังไม่มีบัญชี?{' '}
                <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                    สมัครสมาชิก
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-4xl">🐾</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            PalangTas
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold">ยินดีต้อนรับกลับ! 👋</h1>
                    <p className="text-muted-foreground mt-2">เข้าสู่ระบบเพื่อช่วยหาบ้านให้น้องๆ</p>
                </div>

                {/* Card */}
                <Suspense fallback={<div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xl flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
