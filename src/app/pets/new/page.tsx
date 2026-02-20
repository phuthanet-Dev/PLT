import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PetForm from '@/components/pets/PetForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ลงประกาศหาบ้านให้สัตว์เลี้ยง — PalangTas',
};

export default async function NewPetPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login?redirect=/pets/new');
    }

    return (
        <div className="pt-20 pb-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        📝 ลงประกาศ
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            หาบ้านให้น้อง
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        กรอกข้อมูลของสัตว์เลี้ยงที่ต้องการหาบ้านใหม่
                    </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                    <PetForm userId={user.id} />
                </div>
            </div>
        </div>
    );
}
