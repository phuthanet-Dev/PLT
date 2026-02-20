import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
            <div className="text-center">
                <div className="text-8xl mb-6 animate-float">🐾</div>
                <h1 className="text-4xl font-extrabold mb-4">404</h1>
                <h2 className="text-xl font-semibold mb-2 text-muted-foreground">ไม่พบหน้าที่ต้องการ</h2>
                <p className="text-muted-foreground mb-8">
                    หน้านี้อาจถูกลบไปแล้ว หรือ URL อาจไม่ถูกต้อง
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-white font-bold shadow-lg hover:scale-105 transition-all"
                    >
                        🏠 กลับหน้าแรก
                    </Link>
                    <Link
                        href="/pets"
                        className="rounded-full border-2 border-border px-6 py-3 font-bold hover:border-primary hover:text-primary transition-all"
                    >
                        🐶 ดูสัตว์เลี้ยง
                    </Link>
                </div>
            </div>
        </div>
    );
}
