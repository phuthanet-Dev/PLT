import { Suspense, Fragment } from 'react';
import { createClient } from '@/lib/supabase/server';
import PetCard from '@/components/pets/PetCard';
import PetFilter from '@/components/pets/PetFilter';
import SponsoredCard from '@/components/ads/SponsoredCard';
import Link from 'next/link';
import type { Pet } from '@/lib/database.types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'หาบ้านให้สัตว์เลี้ยง — PalangTas',
    description: 'ค้นหาสัตว์เลี้ยงที่กำลังมองหาครอบครัวใหม่ สุนัข แมว นก กระต่าย และอื่นๆ',
};

const ITEMS_PER_PAGE = 12;

interface PageProps {
    searchParams: Promise<{
        species?: string;
        search?: string;
        province?: string;
        page?: string;
    }>;
}

export default async function PetsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || '1', 10);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    let pets: Pet[] = [];
    let totalCount = 0;

    try {
        const supabase = await createClient();
        let query = supabase
            .from('pets')
            .select('*, profiles(display_name, avatar_url)', { count: 'exact' })
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .range(offset, offset + ITEMS_PER_PAGE - 1);

        if (params.species) {
            query = query.eq('species', params.species);
        }

        if (params.search) {
            query = query.or(
                `name.ilike.%${params.search}%,breed.ilike.%${params.search}%,description.ilike.%${params.search}%`
            );
        }

        if (params.province) {
            query = query.ilike('province', `%${params.province}%`);
        }

        const { data, count } = await query;
        pets = (data as Pet[]) || [];
        totalCount = count || 0;
    } catch {
        // Supabase not configured yet
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        🏠 หาบ้านให้
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            สัตว์เลี้ยง
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {totalCount > 0
                            ? `พบ ${totalCount} ตัวที่กำลังรอบ้านใหม่`
                            : 'ค้นหาเพื่อนใหม่ของคุณ'}
                    </p>
                </div>

                {/* Filter */}
                <div className="mb-8">
                    <Suspense fallback={<div className="h-16 animate-shimmer rounded-2xl" />}>
                        <PetFilter />
                    </Suspense>
                </div>

                {/* Results */}
                {pets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pets.map((pet, index) => (
                                <Fragment key={pet.id}>
                                    <PetCard pet={pet} />
                                    {index === 3 && (
                                        <div className="col-span-1">
                                            <SponsoredCard />
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/pets?page=${currentPage - 1}${params.species ? `&species=${params.species}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                                        className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-all text-sm font-medium"
                                    >
                                        ← ก่อนหน้า
                                    </Link>
                                )}
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <Link
                                            key={page}
                                            href={`/pets?page=${page}${params.species ? `&species=${params.species}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === currentPage
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                : 'border border-border hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    );
                                })}
                                {currentPage < totalPages && (
                                    <Link
                                        href={`/pets?page=${currentPage + 1}${params.species ? `&species=${params.species}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                                        className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-all text-sm font-medium"
                                    >
                                        ถัดไป →
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold mb-2">ไม่พบสัตว์เลี้ยง</h3>
                        <p className="text-muted-foreground mb-6">
                            ลองเปลี่ยนเงื่อนไขการค้นหา หรือลงประกาศหาบ้านให้น้อง
                        </p>
                        <Link
                            href="/pets/new"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-bold hover:bg-primary-dark transition-colors"
                        >
                            📝 ลงประกาศเลย
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
