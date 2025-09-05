'use client'

import Image from 'next/image'

const blogs = [
    {
        id: 1,
        title: 'Design In The Age Of AI: How to adapt lazily.',
        author: 'Azunyan U. Wu',
        date: 'Jun 25, 2025',
        cover: '/images/blog1.jpg',
        tags: ['UI/UX', 'Design System', 'Sleep & Care'],
    },
    {
        id: 2,
        title: 'Blog post title',
        author: 'Carack Babama',
        date: 'Jun 10, 2025',
        cover: '/images/blog2.jpg',
        tags: ['Algorithm'],
    },
    {
        id: 3,
        title: 'Blog post title',
        author: 'Kaoti',
        date: 'Jun 5, 2025',
        cover: '/images/blog3.jpg',
        tags: ['UX/UI Design'],
    },
]

export default function Blogs() {
    return (
        <section className="max-w-6xl px-4 mx-auto mt-20 mb-20">
            {/* Header */}
            <header className="mb-12 text-center">
                <h4 className="mb-2 text-sm font-semibold text-indigo-600">Read Our Blog</h4>
                <h1 className="text-4xl font-light md:text-6xl font-cormorantGaramond">
                    Browse Our Resources
                </h1>
                <p className="mt-4 text-gray-500">
                    We provide tips and resources from industry leaders. For real.
                </p>
            </header>

            {/* Featured Blog */}
            <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl">
                <Image
                    src={blogs[0].cover}
                    alt={blogs[0].title}
                    width={1200}
                    height={600}
                    className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute max-w-xl text-white bottom-8 left-8">
                    <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{blogs[0].title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-200">
                        <span>{blogs[0].author}</span>
                        <span>{blogs[0].date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {blogs[0].tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs rounded-full bg-white/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="grid gap-8 md:grid-cols-3">
                {blogs.slice(1).map((blog) => (
                    <article
                        key={blog.id}
                        className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg"
                    >
                        <Image
                            src={blog.cover}
                            alt={blog.title}
                            width={400}
                            height={250}
                            className="object-cover w-full h-48"
                        />
                        <div className="p-5">
                            <span className="text-xs font-semibold text-indigo-600 uppercase">
                                {blog.tags[0]}
                            </span>
                            <h3 className="mt-2 text-lg font-semibold">{blog.title}</h3>
                            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                                <span>{blog.author}</span>
                                <span>{blog.date}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </section>
    )
}
