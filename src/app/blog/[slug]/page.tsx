import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, blogPosts } from '@/lib/data/blogs';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>
}

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const post = getBlogPost(resolvedParams.slug);

    if (!post) {
        return {
            title: 'บทความไม่พบ | PalangTas'
        }
    }

    return {
        title: `${post.title} | PalangTas`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: Props) {
    const resolvedParams = await params;
    const post = getBlogPost(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    // Basic markdown-like parsing for the simple content
    // Allows `**bold text**` and line breaks
    const renderContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            if (!line.trim()) return <br key={i} />;

            const parsedLine = line.split(/(\*\*.*?\*\*)/).map((segment, j) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                    return <strong key={j} className="font-semibold text-gray-900">{segment.slice(2, -2)}</strong>;
                }
                return segment;
            });

            return <p key={i} className="mb-4">{parsedLine}</p>;
        });
    };

    return (
        <article className="container mx-auto px-4 py-16 max-w-4xl mt-16 sm:mt-20">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/" className="hover:text-primary transition-colors">หน้าหลัก</Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <Link href="/blog" className="ml-1 hover:text-primary transition-colors md:ml-2">บทความ</Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="ml-1 text-gray-400 md:ml-2 truncate max-w-[200px] sm:max-w-[400px]">{post.title}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Hero Header */}
            <header className="mb-10 text-center">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                    {post.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                        <span className="font-medium text-gray-700">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="relative w-full aspect-[21/9] min-h-[300px] max-h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                />
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100">
                <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed border-l-4 border-primary pl-6 py-2">
                    {post.excerpt}
                </p>

                <div className="prose prose-lg max-w-none text-gray-700 leading-loose prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary-dark">
                    {renderContent(post.content)}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 text-center">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับหน้ารวมบทความ
                </Link>
            </div>
        </article>
    );
}
