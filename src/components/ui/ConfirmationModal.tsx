'use client';

import { useEffect, useState } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    variant = 'primary',
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`relative bg-card w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-border transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="text-center">
                    {/* Icon */}
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                        {variant === 'danger' ? '🗑️' : '✨'}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-foreground">
                        {title}
                    </h3>

                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted font-medium text-sm transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform hover:scale-[1.02] ${variant === 'danger'
                                    ? 'bg-gradient-to-r from-danger to-danger/80 shadow-danger/25'
                                    : 'bg-gradient-to-r from-primary to-primary-dark shadow-primary/25'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
