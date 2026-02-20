import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PetCard from '@/components/pets/PetCard';
import type { Pet } from '@/lib/database.types';

export default async function HomePage() {
  let featuredPets: Pet[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(6);

    featuredPets = (data as Pet[]) || [];
  } catch {
    // Supabase not configured yet — that's fine
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 animate-fade-in-up">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5C10 2.5 8.5 4 8.5 6C8.5 8.5 12 11 12 11C12 11 15.5 8.5 15.5 6C15.5 4 14 2.5 12 2.5Z" />
                <path d="M7 6.5C5.5 6.5 4 8 4 9.5C4 11.5 7 13 7 13C7 13 10 11.5 10 9.5C10 8 8.5 6.5 7 6.5Z" />
                <path d="M17 6.5C15.5 6.5 14 8 14 9.5C14 11.5 17 13 17 13C17 13 20 11.5 20 9.5C20 8 18.5 6.5 17 6.5Z" />
                <path d="M12 12.5C8 12.5 5 15 5 18C5 21 8.5 22 12 22C15.5 22 19 21 19 18C19 15 16 12.5 12 12.5Z" />
              </svg>
              <span>ช่วยสัตว์เลี้ยง ช่วยโลก</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-up text-foreground" style={{ animationDelay: '0.1s' }}>
              ช่วยหา
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                บ้านใหม่
              </span>
              <br />
              ให้เพื่อนสี่ขา
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              แพลตฟอร์มเพื่อสัตว์เลี้ยงที่กำลังมองหาครอบครัวใหม่
              <br className="hidden sm:block" />
              ด้วยความอบอุ่นแบบครอบครัวเดียวกัน
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/pets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                ดูสัตว์เลี้ยงทั้งหมด
              </Link>
              <Link
                href="/pets/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary bg-primary/5 px-8 py-4 text-lg font-bold hover:bg-primary hover:text-white hover:-translate-y-1 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                ลงประกาศหาบ้าน
              </Link>
            </div>
          </div>

          {/* Floating SVGs */}
          {/* Paw Top Left */}
          <div className="absolute top-32 left-10 text-primary animate-float opacity-20" style={{ animationDelay: '0s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="-rotate-12">
              <path d="M12 2.5C10 2.5 8.5 4 8.5 6C8.5 8.5 12 11 12 11C12 11 15.5 8.5 15.5 6C15.5 4 14 2.5 12 2.5Z" />
              <path d="M7 6.5C5.5 6.5 4 8 4 9.5C4 11.5 7 13 7 13C7 13 10 11.5 10 9.5C10 8 8.5 6.5 7 6.5Z" />
              <path d="M17 6.5C15.5 6.5 14 8 14 9.5C14 11.5 17 13 17 13C17 13 20 11.5 20 9.5C20 8 18.5 6.5 17 6.5Z" />
              <path d="M12 12.5C8 12.5 5 15 5 18C5 21 8.5 22 12 22C15.5 22 19 21 19 18C19 15 16 12.5 12 12.5Z" />
            </svg>
          </div>
          {/* Paw Bottom Right */}
          <div className="absolute bottom-32 right-24 text-secondary animate-float opacity-20" style={{ animationDelay: '1s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="rotate-12">
              <path d="M12 2.5C10 2.5 8.5 4 8.5 6C8.5 8.5 12 11 12 11C12 11 15.5 8.5 15.5 6C15.5 4 14 2.5 12 2.5Z" />
              <path d="M7 6.5C5.5 6.5 4 8 4 9.5C4 11.5 7 13 7 13C7 13 10 11.5 10 9.5C10 8 8.5 6.5 7 6.5Z" />
              <path d="M17 6.5C15.5 6.5 14 8 14 9.5C14 11.5 17 13 17 13C17 13 20 11.5 20 9.5C20 8 18.5 6.5 17 6.5Z" />
              <path d="M12 12.5C8 12.5 5 15 5 18C5 21 8.5 22 12 22C15.5 22 19 21 19 18C19 15 16 12.5 12 12.5Z" />
            </svg>
          </div>
          {/* Heart Top Right */}
          <div className="absolute top-48 right-16 text-accent animate-float opacity-30" style={{ animationDelay: '0.5s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="rotate-3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          {/* Heart Bottom Left */}
          <div className="absolute bottom-20 left-20 text-danger animate-float opacity-20" style={{ animationDelay: '2s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="-rotate-6">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { emoji: '🐾', number: '500+', label: 'สัตว์ได้บ้านใหม่' },
              { emoji: '👥', number: '1,200+', label: 'ผู้ใช้งาน' },
              { emoji: '🏡', number: '300+', label: 'ครอบครัวใหม่' },
              { emoji: '❤️', number: '50+', label: 'มูลนิธิร่วมมือ' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              น้องๆ ที่กำลัง
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                รอบ้านใหม่
              </span>
            </h2>
            <p className="text-muted-foreground mt-3">เปิดใจให้น้องๆ ได้เป็นส่วนหนึ่งของครอบครัวคุณ</p>
          </div>

          {featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-bold mb-2">ยังไม่มีประกาศ</h3>
              <p className="text-muted-foreground mb-6">เป็นคนแรกที่ลงประกาศหาบ้านให้น้อง!</p>
              <Link
                href="/pets/new"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-bold hover:bg-primary-dark transition-colors"
              >
                📝 ลงประกาศเลย
              </Link>
            </div>
          )}

          {featuredPets.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/pets"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3 font-bold hover:bg-primary hover:text-white transition-all"
              >
                ดูทั้งหมด →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">ขั้นตอนง่ายๆ</h2>
            <p className="text-muted-foreground mt-3">หาบ้านให้น้องใน 3 ขั้นตอน</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                emoji: '📝',
                title: 'ลงประกาศ',
                desc: 'ลงข้อมูลและรูปภาพของน้องที่ต้องการหาบ้าน',
              },
              {
                step: '02',
                emoji: '🔍',
                title: 'ค้นหา & เลือก',
                desc: 'ผู้สนใจค้นหาและเลือกน้องที่ถูกใจ',
              },
              {
                step: '03',
                emoji: '🏡',
                title: 'ได้บ้านใหม่',
                desc: 'ติดต่อพูดคุยและรับน้องไปเป็นส่วนหนึ่งของครอบครัว',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-card rounded-2xl border border-border p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-12 text-center text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                พร้อมช่วยน้องๆ แล้วหรือยัง?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                ทุกการแชร์ ทุกการรับเลี้ยง คือการให้ชีวิตใหม่แก่สัตว์ที่ต้องการบ้าน
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-primary px-8 py-4 text-lg font-bold shadow-xl hover:scale-105 transition-all"
                >
                  เริ่มต้นเลย 🚀
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
