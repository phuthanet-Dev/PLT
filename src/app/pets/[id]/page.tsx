import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Pet } from '@/lib/database.types';
import type { Metadata } from 'next';
import AdoptButton from '@/components/pets/AdoptButton';
import PetImageGallery from '@/components/pets/PetImageGallery';

const speciesLabel: Record<string, string> = {
    dog: 'สุนัข',
    cat: 'แมว',
    bird: 'นก',
    rabbit: 'กระต่าย',
    other: 'อื่นๆ',
};

const genderLabel: Record<string, string> = {
    male: 'ผู้',
    female: 'เมีย',
    unknown: 'ไม่ระบุ',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    available: { label: 'พร้อมหาบ้าน', color: 'text-success', bg: 'bg-success/10' },
    adopted: { label: 'มีบ้านแล้ว', color: 'text-secondary', bg: 'bg-secondary/10' },
    closed: { label: 'ปิดประกาศ', color: 'text-muted-foreground', bg: 'bg-muted' },
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const supabase = await createClient();
        const { data } = await supabase.from('pets').select('name, species, description').eq('id', id).single();
        if (data) {
            return {
                title: `${data.name} (${speciesLabel[data.species]}) — PalangTas`,
                description: data.description || `ดูรายละเอียดของ ${data.name} ที่กำลังหาบ้านใหม่`,
            };
        }
    } catch { /* ignore */ }
    return { title: 'สัตว์เลี้ยง — PalangTas' };
}

export default async function PetDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: pet } = await supabase
        .from('pets')
        .select('*, profiles(id, display_name, avatar_url, phone, line_id)')
        .eq('id', id)
        .single();

    if (!pet) {
        notFound();
    }

    const typedPet = pet as Pet;
    const status = statusConfig[typedPet.status] || statusConfig.available;
    const owner = typedPet.profiles;

    // Check if current user is the owner
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === typedPet.owner_id;

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/pets" className="hover:text-primary transition-colors">
                        หาบ้านให้สัตว์
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{typedPet.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Images — gallery component */}
                    <div className="lg:col-span-3">
                        <PetImageGallery
                            images={typedPet.image_urls || []}
                            petName={typedPet.name}
                        />
                    </div>

                    {/* Info — right col (2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name & Status */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color} ${status.bg}`}>
                                    {status.label}
                                </span>
                                {isOwner && (
                                    <Link
                                        href={`/pets/${typedPet.id}/edit`}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        ✏️ แก้ไข
                                    </Link>
                                )}
                            </div>
                            <h1 className="text-3xl font-extrabold">{typedPet.name}</h1>
                        </div>

                        {/* Quick info */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted rounded-xl p-3">
                                <div className="text-xs text-muted-foreground mb-1">ชนิด</div>
                                <div className="font-semibold">{speciesLabel[typedPet.species]}</div>
                            </div>
                            <div className="bg-muted rounded-xl p-3">
                                <div className="text-xs text-muted-foreground mb-1">เพศ</div>
                                <div className="font-semibold">{genderLabel[typedPet.gender]}</div>
                            </div>
                            {typedPet.breed && (
                                <div className="bg-muted rounded-xl p-3">
                                    <div className="text-xs text-muted-foreground mb-1">สายพันธุ์</div>
                                    <div className="font-semibold">{typedPet.breed}</div>
                                </div>
                            )}
                            {typedPet.age_text && (
                                <div className="bg-muted rounded-xl p-3">
                                    <div className="text-xs text-muted-foreground mb-1">อายุ</div>
                                    <div className="font-semibold">{typedPet.age_text}</div>
                                </div>
                            )}
                            {typedPet.province && (
                                <div className="bg-muted rounded-xl p-3 col-span-2">
                                    <div className="text-xs text-muted-foreground mb-1">📍 จังหวัด</div>
                                    <div className="font-semibold">{typedPet.province}</div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {typedPet.description && (
                            <div>
                                <h2 className="font-bold text-lg mb-2">รายละเอียด</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {typedPet.description}
                                </p>
                            </div>
                        )}

                        {/* Owner info */}
                        {owner && (
                            <div className="bg-card rounded-2xl border border-border p-5">
                                <h3 className="font-semibold mb-3">ผู้ลงประกาศ</h3>
                                <Link href={`/profile/${owner.id}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        {owner.avatar_url ? (
                                            <Image src={owner.avatar_url} alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                                {owner.display_name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium hover:text-primary transition-colors">{owner.display_name || 'ไม่ระบุชื่อ'}</div>
                                        <div className="text-xs text-muted-foreground">ดูโปรไฟล์</div>
                                    </div>
                                </Link>

                                {typedPet.status === 'available' && (
                                    <AdoptButton
                                        petId={typedPet.id}
                                        isLoggedIn={!!user}
                                        isOwner={isOwner}
                                        owner={owner}
                                    />
                                )}
                            </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-muted-foreground">
                            ลงประกาศเมื่อ {new Date(typedPet.created_at).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
