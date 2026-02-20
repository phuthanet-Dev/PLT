import Link from 'next/link';
import Image from 'next/image';

export default function SponsoredCard() {
    return (
        <a
            href="https://www.google.com" // Example link, can be replaced with real ad link
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
        >
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-primary/10 group-hover:border-primary/30 h-full flex flex-col">
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden flex items-center justify-center">
                    <div className="text-center p-6">
                        <div className="text-4xl mb-3 animate-bounce">🎁</div>
                        <h3 className="font-bold text-primary">สนับสนุนโครงการ</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            ช่วยค่าอาหารและยาให้น้องๆ
                        </p>
                    </div>
                    {/* Sponsored Badge */}
                    <div className="absolute top-3 right-3 bg-black/5 text-[10px] font-medium px-2 py-0.5 rounded text-muted-foreground uppercase tracking-wide">
                        Ad
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-center text-center">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        บริจาคช่วยน้องๆ 🐾
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        ร่วมเป็นส่วนหนึ่งในการให้โอกาสชีวิตใหม่ แก่สัตว์พิการและไร้บ้าน
                    </p>
                    <button className="mt-4 w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all">
                        ดูรายละเอียด
                    </button>
                </div>
            </div>
        </a>
    );
}
