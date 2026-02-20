'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();
                if (profile?.avatar_url) {
                    setAvatarUrl(profile.avatar_url);
                }
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', currentUser.id)
                    .single();
                setAvatarUrl(profile?.avatar_url || null);
            } else {
                setAvatarUrl(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-card/90 backdrop-blur-lg shadow-lg border-b border-border'
                : 'bg-transparent'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-3xl transition-transform group-hover:scale-110">🐾</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            PalangTas
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/pets"
                            className="text-foreground/70 hover:text-primary transition-colors font-medium"
                        >
                            หาบ้านให้สัตว์
                        </Link>
                        {user && (
                            <Link
                                href="/pets/new"
                                className="text-foreground/70 hover:text-primary transition-colors font-medium"
                            >
                                ลงประกาศ
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-border transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt="avatar" width={24} height={24} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="max-w-[120px] truncate">{user.user_metadata?.display_name || user.email}</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-danger transition-colors"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    เข้าสู่ระบบ
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                                >
                                    สมัครสมาชิก
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 h-5 flex flex-col justify-center gap-1">
                            <span className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
                        }`}
                >
                    <div className="flex flex-col gap-2 pt-2">
                        <Link
                            href="/pets"
                            className="rounded-lg px-4 py-2 text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            หาบ้านให้สัตว์
                        </Link>
                        {user && (
                            <Link
                                href="/pets/new"
                                className="rounded-lg px-4 py-2 text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ลงประกาศ
                            </Link>
                        )}
                        <hr className="border-border" />
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="rounded-lg px-4 py-2 text-foreground/70 hover:bg-muted transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    โปรไฟล์
                                </Link>
                                <button
                                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                    className="rounded-lg px-4 py-2 text-left text-danger hover:bg-muted transition-colors"
                                >
                                    ออกจากระบบ
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="rounded-lg px-4 py-2 text-foreground/70 hover:bg-muted transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    เข้าสู่ระบบ
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="rounded-lg bg-primary px-4 py-2 text-center text-white font-bold hover:bg-primary-dark transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    สมัครสมาชิก
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
