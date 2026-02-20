'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/database.types';

interface AdoptButtonProps {
    petId: string;
    isLoggedIn: boolean;
    isOwner: boolean;
    owner: Profile;
}

export default function AdoptButton({ petId, isLoggedIn, isOwner, owner }: AdoptButtonProps) {
    const router = useRouter();
    const [showContact, setShowContact] = useState(false);

    const handleClick = () => {
        if (!isLoggedIn) {
            router.push(`/auth/login?redirect=/pets/${petId}`);
            return;
        }

        if (isOwner) {
            router.push(`/pets/${petId}/edit`);
            return;
        }

        setShowContact(true);
    };

    const buttonLabel = !isLoggedIn
        ? '🐾 สนใจรับเลี้ยง'
        : isOwner
            ? '✏️ แก้ไขประกาศ'
            : '🐾 สนใจรับเลี้ยง';

    return (
        <div className="space-y-3">
            <button
                onClick={handleClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all"
            >
                {buttonLabel}
            </button>

            {/* Contact info revealed after clicking */}
            {showContact && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                        ช่องทางติดต่อผู้ลงประกาศ
                    </p>
                    {owner.phone && (
                        <a
                            href={`tel:${owner.phone}`}
                            className="flex items-center gap-2 w-full py-2.5 rounded-xl bg-success/10 text-success font-medium text-sm justify-center hover:bg-success/20 transition-colors"
                        >
                            📞 {owner.phone}
                        </a>
                    )}
                    {owner.line_id && (
                        <a
                            href={`https://line.me/R/ti/p/~${owner.line_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full py-2.5 rounded-xl bg-[#06C755]/10 text-[#06C755] font-medium text-sm justify-center hover:bg-[#06C755]/20 transition-colors"
                        >
                            💬 LINE: {owner.line_id}
                        </a>
                    )}
                    {!owner.phone && !owner.line_id && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                            ผู้ลงประกาศยังไม่ได้ระบุช่องทางติดต่อ
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
