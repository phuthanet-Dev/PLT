import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🐾</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                    <p className="text-muted-foreground text-xs">
                        © {new Date().getFullYear()} PalangTas. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Made with ❤️ for animals
                    </p>
                </div>
            </div>
        </footer>
    );
}
