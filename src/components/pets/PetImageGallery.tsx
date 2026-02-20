'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PetImageGalleryProps {
    images: string[];
    petName: string;
}

export default function PetImageGallery({ images, petName }: PetImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] rounded-2xl bg-muted flex items-center justify-center">
                <span className="text-8xl opacity-20">🐾</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted group">
                <Image
                    src={selectedImage}
                    alt={petName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {images.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(url)}
                            className={`relative aspect-square rounded-xl overflow-hidden bg-muted transition-all ${selectedImage === url
                                    ? 'ring-2 ring-primary ring-offset-2 opacity-100 scale-95'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={url}
                                alt={`${petName} ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="15vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
