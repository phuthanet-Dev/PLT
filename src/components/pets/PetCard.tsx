import Link from 'next/link';
import Image from 'next/image';
import type { Pet } from '@/lib/database.types';

const speciesEmoji: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐰',
    other: '🐾',
};

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

const statusConfig: Record<string, { label: string; color: string }> = {
    available: { label: 'พร้อมหาบ้าน', color: 'bg-success' },
    adopted: { label: 'มีบ้านแล้ว', color: 'bg-secondary' },
    closed: { label: 'ปิดประกาศ', color: 'bg-muted-foreground' },
};

export default function PetCard({ pet }: { pet: Pet }) {
    const status = statusConfig[pet.status] || statusConfig.available;
    const imageUrl = pet.image_urls?.[0];

    return (
        <Link href={`/pets/${pet.id}`} className="group block">
            <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border group-hover:border-primary/30 group-hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={pet.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                            {speciesEmoji[pet.species] || '🐾'}
                        </div>
                    )}
                    {/* Status badge */}
                    <div className={`absolute top-3 left-3 ${status.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {status.label}
                    </div>
                    {/* Species badge */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-card/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full shadow">
                        {speciesEmoji[pet.species]} {speciesLabel[pet.species]}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors truncate">
                        {pet.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {pet.breed && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                                {pet.breed}
                            </span>
                        )}
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                            {genderLabel[pet.gender]}
                        </span>
                        {pet.age_text && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                                {pet.age_text}
                            </span>
                        )}
                    </div>
                    {pet.province && (
                        <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                            📍 {pet.province}
                        </p>
                    )}
                    {pet.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {pet.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
