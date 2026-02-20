'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            setLoading(false);
            return;
        }

        const { error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    display_name: formData.displayName,
                    full_name: formData.displayName,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
                <div className="w-full max-w-md text-center">
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                        <div className="text-6xl mb-4">📧</div>
                        <h2 className="text-xl font-bold mb-2">ตรวจสอบอีเมลของคุณ</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            เราได้ส่งลิงก์ยืนยันไปที่ <strong className="text-foreground">{formData.email}</strong>
                            <br />กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block rounded-xl bg-primary px-6 py-3 text-white font-bold hover:bg-primary-dark transition-colors"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-40 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
                    <h1 className="text-2xl font-bold">สร้างบัญชีใหม่ 🎉</h1>
                    <p className="text-muted-foreground mt-2">เข้าร่วมกับเราเพื่อช่วยเหลือสัตว์เลี้ยง</p>
                </div>

                {/* Card */}
                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium mb-1.5">
                                ชื่อที่แสดง
                            </label>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="เช่น สมชาย"
                                className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                อีเมล
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                                ยืนยันรหัสผ่าน
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="กรอกรหัสผ่านอีกครั้ง"
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
                                    กำลังสร้างบัญชี...
                                </span>
                            ) : (
                                'สมัครสมาชิก'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
