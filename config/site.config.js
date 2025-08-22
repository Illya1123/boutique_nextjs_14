export const siteConfig = {
    name: 'Authx',
    title: 'Authx – Full-Stack Next.js 15 Template with Auth.js, Prisma ORM, PostgreSQL, and Shadcn UI',
    description:
        'Modern full-stack template for Next.js 15 featuring Auth.js (NextAuth), Prisma ORM, PostgreSQL, Shadcn UI, and Tailwind CSS v4 for building secure and scalable web apps.',
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    keywords: [
        'Next.js 15',
        'Authentication',
        'Prisma ORM',
        'PostgreSQL',
        'Tailwind CSS',
        'Tailwind CSS V4',
        'Shadcn UI',
        'TypeScript',
        'Full-Stack Template',
    ],
    og: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og.png`,

    creator: {
        name: 'YTDev',
        url: 'https://ytdev.pt/',
    },
    socials: {
        github: 'https://github.com/YTDev/Next-Auth-Starter',
        x: 'https://x.com/',
    },
}
