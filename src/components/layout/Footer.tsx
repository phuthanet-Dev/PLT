import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="text-primary group-hover:animate-wag transition-transform origin-bottom">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.5C10 2.5 8.5 4 8.5 6C8.5 8.5 12 11 12 11C12 11 15.5 8.5 15.5 6C15.5 4 14 2.5 12 2.5Z" />
                                    <path d="M7 6.5C5.5 6.5 4 8 4 9.5C4 11.5 7 13 7 13C7 13 10 11.5 10 9.5C10 8 8.5 6.5 7 6.5Z" />
                                    <path d="M17 6.5C15.5 6.5 14 8 14 9.5C14 11.5 17 13 17 13C17 13 20 11.5 20 9.5C20 8 18.5 6.5 17 6.5Z" />
                                    <path d="M12 12.5C8 12.5 5 15 5 18C5 21 8.5 22 12 22C15.5 22 19 21 19 18C19 15 16 12.5 12 12.5Z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent tracking-tight">
                                PalangTas
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            แพลตฟอร์มช่วยหาบ้านให้กับสัตว์เลี้ยง
                            เพราะทุกชีวิตสมควรได้รับความรัก 🧡
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">ลิงก์ด่วน</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/pets" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    หาบ้านให้สัตว์
                                </Link>
                            </li>
                            <li>
                                <Link href="/pets/new" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    ลงประกาศหาบ้านให้สัตว์
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">ติดต่อ</h3>
                        <ul className="space-y-2">
                            <li className="text-muted-foreground text-sm">
                                📧 contact@pawhome.app
                            </li>
                            <li className="text-muted-foreground text-sm">
                                🌐 pawhome.app
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-xs flex flex-wrap items-center gap-4">
                        <span>© {new Date().getFullYear()} PalangTas. All rights reserved.</span>
                        <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                            นโยบายความเป็นส่วนตัว
                        </Link>
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Made with ❤️ for animals
                    </p>
                </div>
            </div>
        </footer>
    );
}
