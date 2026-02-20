import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Profile, Pet } from '@/lib/database.types';
import type { Metadata } from 'next';

const statusLabel: Record<string, { label: string; emoji: string }> = {
    available: { label: 'พร้อมหาบ้าน', emoji: '🟢' },
    adopted: { label: 'มีบ้านแล้ว', emoji: '🔵' },
    closed: { label: 'ปิดประกาศ', emoji: '⚫' },
};

const speciesEmoji: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐰',
    other: '🐾',
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('profiles').select('display_name').eq('id', id).single();
        if (data?.display_name) {
            return {
                title: `${data.display_name} — PalangTas`,
                description: `ดูโปรไฟล์ของ ${data.display_name} และสัตว์เลี้ยงที่ลงประกาศ`,
            };
        }
    } catch { /* ignore */ }
    return { title: 'โปรไฟล์ผู้ใช้ — PalangTas' };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (!profile) {
        notFound();
    }

    const typedProfile = profile as Profile;

    // Fetch user's pets (only available + adopted, not closed)
    const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', id)
        .in('status', ['available', 'adopted'])
        .order('created_at', { ascending: false });

    const pets = (petsData as Pet[]) || [];

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/pets" className="hover:text-primary transition-colors">
                        หาบ้านให้สัตว์
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{typedProfile.display_name || 'ผู้ใช้'}</span>
                </nav>

                {/* Profile Card */}
                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                            {typedProfile.avatar_url ? (
                                <Image
                                    src={typedProfile.avatar_url}
                                    alt="avatar"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                                    {typedProfile.display_name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{typedProfile.display_name || 'ไม่ระบุชื่อ'}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                สมาชิกตั้งแต่ {new Date(typedProfile.created_at).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h2 className="font-semibold text-lg mb-3">📋 ข้อมูลติดต่อ</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {typedProfile.phone ? (
                                <a
                                    href={`tel:${typedProfile.phone}`}
                                    className="flex items-center gap-3 bg-success/10 text-success rounded-xl p-4 hover:bg-success/20 transition-colors"
                                >
                                    <span className="text-lg">📞</span>
                                    <div>
                                        <div className="text-xs opacity-70">โทรศัพท์</div>
                                        <div className="font-medium">{typedProfile.phone}</div>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex items-center gap-3 bg-muted rounded-xl p-4">
                                    <span className="text-lg opacity-50">📞</span>
                                    <div>
                                        <div className="text-xs text-muted-foreground">โทรศัพท์</div>
                                        <div className="text-sm text-muted-foreground">ไม่ได้ระบุ</div>
                                    </div>
                                </div>
                            )}
                            {typedProfile.line_id ? (
                                <div className="flex items-center gap-3 bg-[#06C755]/10 text-[#06C755] rounded-xl p-4">
                                    <span className="text-lg">💬</span>
                                    <div>
                                        <div className="text-xs opacity-70">LINE ID</div>
                                        <div className="font-medium">{typedProfile.line_id}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-muted rounded-xl p-4">
                                    <span className="text-lg opacity-50">💬</span>
                                    <div>
                                        <div className="text-xs text-muted-foreground">LINE ID</div>
                                        <div className="text-sm text-muted-foreground">ไม่ได้ระบุ</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User's Pets */}
                <div>
                    <h2 className="text-xl font-bold mb-6">
                        🐾 สัตว์เลี้ยงที่ลงประกาศ
                        <span className="text-base font-normal text-muted-foreground ml-2">
                            ({pets.length})
                        </span>
                    </h2>

                    {pets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pets.map((pet) => {
                                const st = statusLabel[pet.status] || statusLabel.available;
                                return (
                                    <Link
                                        key={pet.id}
                                        href={`/pets/${pet.id}`}
                                        className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group"
                                    >
                                        <div className="relative aspect-[4/3] bg-muted">
                                            {pet.image_urls?.[0] ? (
                                                <Image
                                                    src={pet.image_urls[0]}
                                                    alt={pet.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 640px) 100vw, 50vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                                                    {speciesEmoji[pet.species] || '🐾'}
                                                </div>
                                            )}
                                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${st.emoji === '🟢' ? 'bg-success/90 text-white' : st.emoji === '🔵' ? 'bg-secondary/90 text-white' : 'bg-muted-foreground/90 text-white'}`}>
                                                {st.emoji} {st.label}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                {pet.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {pet.breed && `${pet.breed} · `}
                                                {pet.age_text && `${pet.age_text} · `}
                                                {pet.province || ''}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-2xl border border-border">
                            <div className="text-4xl mb-3 opacity-30">🐾</div>
                            <p className="text-muted-foreground">ยังไม่มีสัตว์เลี้ยงที่ลงประกาศ</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
