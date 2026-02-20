'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile, Pet } from '@/lib/database.types';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const statusLabel: Record<string, { label: string; emoji: string }> = {
    available: { label: 'พร้อมหาบ้าน', emoji: '🟢' },
    adopted: { label: 'มีบ้านแล้ว', emoji: '🔵' },
    closed: { label: 'ปิดประกาศ', emoji: '⚫' },
};

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [formData, setFormData] = useState({
        display_name: '',
        phone: '',
        line_id: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login?redirect=/profile');
                return;
            }
            setUser(user);

            // Load profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData as Profile);
                setFormData({
                    display_name: profileData.display_name || '',
                    phone: profileData.phone || '',
                    line_id: profileData.line_id || '',
                });
            }

            // Load user's pets
            const { data: petsData } = await supabase
                .from('pets')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            setPets((petsData as Pet[]) || []);
            setLoading(false);
        };

        loadData();
    }, [supabase, router]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('ไฟล์มีขนาดเกิน 2MB กรุณาเลือกไฟล์ที่เล็กกว่า');
            return;
        }

        setAvatarUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            const avatarUrl = data.publicUrl;

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: avatarUrl,
                });

            if (updateError) {
                throw updateError;
            }

            setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null);
        } catch (err) {
            console.error('Avatar upload error:', err);
            alert(err instanceof Error ? `อัพโหลดรูปไม่สำเร็จ: ${err.message}` : 'อัพโหลดรูปไม่สำเร็จ กรุณาลองใหม่');
        } finally {
            setAvatarUploading(false);
            // Reset input so same file can be selected again
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...formData,
            });

        if (!error) {
            setProfile((prev) => (prev ? { ...prev, ...formData } : null));
            setEditMode(false);
        }
        setSaving(false);
    };

    const confirmDelete = (petId: string) => {
        setPetToDelete(petId);
        setDeleteModalOpen(true);
    };

    const handleDeletePet = async () => {
        if (!petToDelete) return;
        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('pets')
                .delete()
                .eq('id', petToDelete);

            if (error) throw error;

            setPets((prev) => prev.filter((p) => p.id !== petToDelete));
            setDeleteModalOpen(false);
            setPetToDelete(null);
        } catch (err) {
            console.error('Error deleting pet:', err);
            alert('เกิดข้อผิดพลาดในการลบประกาศ กรุณาลองใหม่');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-20 pb-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        <div className="h-32 animate-shimmer rounded-2xl" />
                        <div className="h-64 animate-shimmer rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">
                    👤 โปรไฟล์
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ของฉัน
                    </span>
                </h1>

                {/* Profile Card */}
                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        {/* Avatar with upload */}
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group cursor-pointer"
                            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
                        >
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt="avatar"
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                                    {profile?.display_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {avatarUploading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="text-white text-lg">📷</span>
                                )}
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold">{profile?.display_name || 'ไม่ระบุชื่อ'}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    {editMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">ชื่อที่แสดง</label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="08x-xxx-xxxx"
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">LINE ID</label>
                                <input
                                    type="text"
                                    value={formData.line_id}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, line_id: e.target.value }))}
                                    placeholder="your_line_id"
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-24">📞 โทรศัพท์</span>
                                <span className="text-sm">{profile?.phone || 'ยังไม่ระบุ'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-24">💬 LINE ID</span>
                                <span className="text-sm">{profile?.line_id || 'ยังไม่ระบุ'}</span>
                            </div>
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-4 px-6 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-all text-sm font-medium"
                            >
                                ✏️ แก้ไขข้อมูล
                            </button>
                        </div>
                    )}
                </div>

                {/* My Pets */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">🐾 สัตว์เลี้ยงของฉัน</h2>
                        <Link
                            href="/pets/new"
                            className="rounded-full bg-primary px-5 py-2 text-sm text-white font-bold hover:bg-primary-dark transition-colors"
                        >
                            + ลงประกาศ
                        </Link>
                    </div>

                    {pets.length > 0 ? (
                        <div className="space-y-3">
                            {pets.map((pet) => {
                                const st = statusLabel[pet.status] || statusLabel.available;
                                return (
                                    <div
                                        key={pet.id}
                                        className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all group relative"
                                    >
                                        <Link href={`/pets/${pet.id}`} className="absolute inset-0 z-0" />
                                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0 z-10 relative">
                                            {pet.image_urls?.[0] ? (
                                                <img
                                                    src={pet.image_urls[0]}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                                                    🐾
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 z-10 relative pointer-events-none">
                                            <h3 className="font-bold group-hover:text-primary transition-colors truncate">
                                                {pet.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {st.emoji} {st.label}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 z-20 relative">
                                            <Link
                                                href={`/pets/${pet.id}/edit`}
                                                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors bg-card border border-border/50"
                                            >
                                                แก้ไข
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(pet.id);
                                                }}
                                                className="px-3 py-1.5 rounded-lg text-xs text-danger hover:bg-danger/5 transition-colors bg-card border border-border/50"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-2xl border border-border">
                            <div className="text-4xl mb-3">📝</div>
                            <p className="text-muted-foreground mb-4">ยังไม่มีประกาศสัตว์เลี้ยง</p>
                            <Link
                                href="/pets/new"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-bold hover:bg-primary-dark transition-colors"
                            >
                                ลงประกาศเลย
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => !isDeleting && setDeleteModalOpen(false)}
                onConfirm={handleDeletePet}
                title="ยืนยันการลบ"
                message="คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
                confirmText={isDeleting ? 'กำลังลบ...' : 'ลบเลย'}
                cancelText="ไว้ก่อน"
                variant="danger"
            />
        </div >
    );
}
