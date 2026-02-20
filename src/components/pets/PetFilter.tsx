'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { THAI_PROVINCES } from '@/lib/thai-provinces';
import { PET_BREEDS } from '@/lib/data/breeds';

const speciesOptions = [
    { value: '', label: 'ทุกชนิด' },
    { value: 'dog', label: '🐕 สุนัข' },
    { value: 'cat', label: '🐈 แมว' },
    { value: 'bird', label: '🐦 นก' },
    { value: 'rabbit', label: '🐰 กระต่าย' },
    { value: 'other', label: '🐾 อื่นๆ' },
];

export default function PetFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSpecies = searchParams.get('species') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentProvince = searchParams.get('province') || '';

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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateFilters = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete('page');
            router.push(`/pets?${params.toString()}`);
        },
        [router, searchParams]
    );

    let breedSuggestions: string[] = [];
    if (currentSpecies && PET_BREEDS[currentSpecies]) {
        breedSuggestions = PET_BREEDS[currentSpecies];
    } else {
        breedSuggestions = Array.from(new Set(Object.values(PET_BREEDS).flat()));
    }

    return (
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm mb-6">
            {/* Species filter (Modern Pills) */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-border text-sm">
                <span className="text-muted-foreground mr-2 hidden sm:inline-block">หมวดหมู่:</span>
                {speciesOptions.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateFilters('species', opt.value)}
                        className={`px-4 py-2 rounded-full border font-medium transition-all ${currentSpecies === opt.value || (opt.value === '' && !currentSpecies)
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                            : 'bg-muted border-border hover:border-primary/50 text-foreground hover:bg-background/50'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อ, สายพันธุ์..."
                            defaultValue={currentSearch}
                            onChange={(e) => updateFilters('search', e.target.value)}
                            list="breed-suggestions"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        />
                        <datalist id="breed-suggestions">
                            {breedSuggestions.map((b) => (
                                <option key={b} value={b} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* Province filter */}
                <div className="sm:w-64" ref={provinceRef}>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setProvinceOpen(!provinceOpen); setProvinceSearch(''); }}
                            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-left flex items-center justify-between"
                        >
                            <span className={currentProvince ? '' : 'text-muted-foreground'}>
                                {currentProvince || '📍 เลือกจังหวัด'}
                            </span>
                            <span className="text-xs opacity-50">▼</span>
                        </button>

                        {provinceOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 border-b border-border">
                                    <input
                                        type="text"
                                        value={provinceSearch}
                                        onChange={(e) => setProvinceSearch(e.target.value)}
                                        placeholder="พิมพ์ชื่อจังหวัด..."
                                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs"
                                        autoFocus
                                    />
                                </div>
                                <ul className="max-h-60 overflow-y-auto">
                                    <li key="all">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFilters('province', '');
                                                setProvinceOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${!currentProvince ? 'bg-primary/10 text-primary font-medium' : ''
                                                }`}
                                        >
                                            📍 ทุกจังหวัด
                                        </button>
                                    </li>
                                    {filteredProvinces.length > 0 ? (
                                        filteredProvinces.map((p) => (
                                            <li key={p}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        updateFilters('province', p);
                                                        setProvinceOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${currentProvince === p ? 'bg-primary/10 text-primary font-medium' : ''
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-xs text-muted-foreground text-center">ไม่พบจังหวัด</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
