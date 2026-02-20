import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data/blogs';

export const metadata = {
    title: "บล็อก | PalangTas",
    description: "รวมบทความน่ารู้เกี่ยวกับการเตรียมตัวเลี้ยงสัตว์ การดูแลสุขภาพ และบทความอื่นๆ สำหรับคนรักสัตว์",
};

export default function BlogListPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl mt-16 sm:mt-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                    บทความสำหรับคนรักสัตว์ 📚
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    อ่านเคล็ดลับ การเตรียมตัว และความรู้ดีๆ เกี่ยวกับการดูแลน้องหมาน้องแมว
                    เพื่อให้พวกเขาและคุณมีความสุขไปด้วยกัน
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-xs font-semibold text-primary">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(post.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {post.author}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-3 text-sm flex-1 leading-relaxed">
                                {post.excerpt}
                            </p>
                            <div className="mt-6 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                                อ่านต่อ <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
