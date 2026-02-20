import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import PetForm from '@/components/pets/PetForm';
import type { Pet } from '@/lib/database.types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'แก้ไขประกาศ — PalangTas',
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPetPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/auth/login?redirect=/pets/${id}/edit`);
    }

    const { data: pet } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

    if (!pet) {
        notFound();
    }

    // Only the owner can edit
    if (pet.owner_id !== user.id) {
        redirect(`/pets/${id}`);
    }

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        ✏️ แก้ไข
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ประกาศ
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        แก้ไขข้อมูลของ {pet.name}
                    </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                    <PetForm pet={pet as Pet} userId={user.id} />
                </div>
            </div>
        </div>
    );
}
