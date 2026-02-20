'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Pet, PetSpecies, PetGender } from '@/lib/database.types';
import { THAI_PROVINCES } from '@/lib/thai-provinces';
import { PET_BREEDS } from '@/lib/data/breeds';

const speciesOptions: { value: PetSpecies; label: string }[] = [
    { value: 'dog', label: '🐕 สุนัข' },
    { value: 'cat', label: '🐈 แมว' },
    { value: 'bird', label: '🐦 นก' },
    { value: 'rabbit', label: '🐰 กระต่าย' },
    { value: 'other', label: '🐾 อื่นๆ' },
];

const genderOptions: { value: PetGender; label: string }[] = [
    { value: 'male', label: 'ผู้' },
    { value: 'female', label: 'เมีย' },
    { value: 'unknown', label: 'ไม่ระบุ' },
];

interface PetFormProps {
    pet?: Pet;
    userId: string;
}

export default function PetForm({ pet, userId }: PetFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const isEditing = !!pet;

    let initialYears = '';
    let initialMonths = '';
    if (pet?.age_text) {
        const yearMatch = pet.age_text.match(/(\d+)\s*ปี/);
        const monthMatch = pet.age_text.match(/(\d+)\s*เดือน/);
        if (yearMatch) initialYears = yearMatch[1];
        if (monthMatch) initialMonths = monthMatch[1];
    }

    const [formData, setFormData] = useState({
        name: pet?.name || '',
        species: pet?.species || ('dog' as PetSpecies),
        breed: pet?.breed || '',
        ageYears: initialYears,
        ageMonths: initialMonths,
        gender: pet?.gender || ('unknown' as PetGender),
        description: pet?.description || '',
        province: pet?.province || '',
        status: pet?.status || 'available',
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(pet?.image_urls || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const errorRef = useRef<HTMLDivElement>(null);

    // Breed dropdown state
    const [breedOpen, setBreedOpen] = useState(false);
    const breedRef = useRef<HTMLDivElement>(null);

    const availableBreeds = PET_BREEDS[formData.species] || [];
    const filteredBreeds = availableBreeds.filter((b) =>
        b.toLowerCase().includes((formData.breed || '').toLowerCase())
    );

    // Province searchable dropdown state
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [provinceSearch, setProvinceSearch] = useState('');
    const provinceRef = useRef<HTMLDivElement>(null);

    const filteredProvinces = THAI_PROVINCES.filter((p) =>
        p.includes(provinceSearch)
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
                setProvinceOpen(false);
            }
            if (breedRef.current && !breedRef.current.contains(e.target as Node)) {
                setBreedOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 5 - existingImages.length);
            setImageFiles(files);
            // Generate preview URLs
            const previews = files.map((file) => URL.createObjectURL(file));
            // Revoke old preview URLs
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
            setImagePreviews(previews);
        }
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url: string) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const uploadImages = async (): Promise<string[]> => {
        const urls: string[] = [...existingImages];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        for (const file of imageFiles) {
            if (file.size > MAX_FILE_SIZE) {
                throw new Error(`ไฟล์ "${file.name}" มีขนาดเกิน 5MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('pet-images')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error(`อัพโหลดรูปไม่สำเร็จ: ${uploadError.message}`);
            }

            const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName);
            urls.push(data.publicUrl);
        }
        return urls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.province) {
                throw new Error('กรุณาระบุจังหวัด');
            }
            // Require at least 1 image for new listings
            if (!isEditing && imageFiles.length === 0) {
                throw new Error('กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป');
            }
            if (isEditing && existingImages.length === 0 && imageFiles.length === 0) {
                throw new Error('กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป');
            }

            let image_urls = existingImages;
            if (imageFiles.length > 0) {
                image_urls = await uploadImages();
            }

            let finalAgeText = '';
            if (formData.ageYears) finalAgeText += `${formData.ageYears} ปี `;
            if (formData.ageMonths) finalAgeText += `${formData.ageMonths} เดือน`;
            finalAgeText = finalAgeText.trim();

            const { ageYears, ageMonths, ...restFormData } = formData;

            const payload = {
                ...restFormData,
                age_text: finalAgeText,
                image_urls,
                owner_id: userId,
                updated_at: new Date().toISOString(),
            };

            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('pets')
                    .update(payload)
                    .eq('id', pet.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('pets')
                    .insert(payload);
                if (insertError) throw insertError;
            }

            router.push('/pets');
            router.refresh();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่';
            setError(msg);
            setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div ref={errorRef} className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-sm">
                    {error}
                </div>
            )}

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    ชื่อสัตว์เลี้ยง <span className="text-danger">*</span>
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="เช่น น้องบุญมี"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            </div>

            {/* Species & Gender row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="species" className="block text-sm font-medium mb-2">
                        ชนิดสัตว์ <span className="text-danger">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {speciesOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, species: opt.value }))
                                }
                                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${formData.species === opt.value
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105'
                                    : 'bg-muted border-border hover:border-primary/50 text-foreground hover:bg-background'
                                    }`}
                            >
                                <span className="text-lg">{opt.label.split(' ')[0]}</span>
                                <span>{opt.label.split(' ')[1]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        เพศ <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-2">
                        {genderOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, gender: opt.value }))
                                }
                                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.gender === opt.value
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                                    : 'bg-muted border-border hover:border-primary/50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Breed & Age row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div ref={breedRef} className="relative">
                    <label htmlFor="breed" className="block text-sm font-medium mb-2">
                        สายพันธุ์
                    </label>
                    <input
                        id="breed"
                        name="breed"
                        type="text"
                        value={formData.breed}
                        onChange={(e) => {
                            handleChange(e);
                            setBreedOpen(true);
                        }}
                        onFocus={() => setBreedOpen(true)}
                        placeholder="เช่น ชิวาวา (พิมพ์เพื่อค้นหา)"
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        autoComplete="off"
                    />
                    {breedOpen && filteredBreeds.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <ul className="max-h-48 overflow-y-auto py-1">
                                {filteredBreeds.map((b) => (
                                    <li key={b}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({ ...prev, breed: b }));
                                                setBreedOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            {b}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        อายุ
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                id="ageYears"
                                name="ageYears"
                                type="number"
                                min="0"
                                max="30"
                                value={formData.ageYears}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">ปี</span>
                        </div>
                        <div className="relative flex-1">
                            <input
                                id="ageMonths"
                                name="ageMonths"
                                type="number"
                                min="0"
                                max="11"
                                value={formData.ageMonths}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-14"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">เดือน</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Province — searchable dropdown */}
            <div ref={provinceRef} className="relative">
                <label className="block text-sm font-medium mb-2">
                    จังหวัด <span className="text-danger">*</span>
                </label>
                <button
                    type="button"
                    onClick={() => { setProvinceOpen(!provinceOpen); setProvinceSearch(''); }}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-left flex items-center justify-between"
                >
                    <span className={formData.province ? '' : 'text-muted-foreground'}>
                        {formData.province || 'เลือกจังหวัด'}
                    </span>
                    <span className={`text-muted-foreground transition-transform ${provinceOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {provinceOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-border">
                            <input
                                type="text"
                                value={provinceSearch}
                                onChange={(e) => setProvinceSearch(e.target.value)}
                                placeholder="พิมพ์เพื่อค้นหา..."
                                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                autoFocus
                            />
                        </div>
                        <ul className="max-h-48 overflow-y-auto">
                            {filteredProvinces.length > 0 ? (
                                filteredProvinces.map((p) => (
                                    <li key={p}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({ ...prev, province: p }));
                                                setProvinceOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${formData.province === p ? 'bg-primary/10 text-primary font-medium' : ''
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-sm text-muted-foreground text-center">ไม่พบจังหวัด</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                    รายละเอียด
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="บอกเล่าเกี่ยวกับน้อง เช่น นิสัย สุขภาพ การฉีดวัคซีน..."
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
            </div>

            {/* Image upload */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    รูปภาพ (สูงสุด 5 รูป) <span className="text-danger">*</span>
                </label>
                {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                        {existingImages.map((url, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                                <img
                                    src={url}
                                    alt={`pet-${i}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="text-white text-xl">✕</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                    <span className="text-4xl mb-2">📷</span>
                    <span className="text-sm text-muted-foreground">คลิกเพื่ออัพโหลดรูปภาพ</span>
                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (สูงสุด 5MB)</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
                {/* New image previews */}
                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {imagePreviews.map((url, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                                <img
                                    src={url}
                                    alt={`preview-${i}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">ใหม่</div>
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(i)}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="text-white text-xl">✕</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status (edit mode only) */}
            {isEditing && (
                <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-2">
                        สถานะ
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                    >
                        <option value="available">🟢 พร้อมหาบ้าน</option>
                        <option value="adopted">🔵 มีบ้านแล้ว</option>
                        <option value="closed">⚫ ปิดประกาศ</option>
                    </select>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังบันทึก...
                    </span>
                ) : isEditing ? (
                    'บันทึกการแก้ไข'
                ) : (
                    'ลงประกาศหาบ้าน 🐾'
                )}
            </button>
        </form>
    );
}
