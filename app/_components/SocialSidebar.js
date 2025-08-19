import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

export default function SocialSidebar() {
    return (
        <div className="fixed top-1/2 left-6 -translate-y-1/2 flex flex-col space-y-4 z-50">
            {[
                {
                    href: 'https://facebook.com/lequocanh2k3',
                    icon: <Facebook size={20} />,
                    hover: 'hover:bg-blue-600',
                },
                {
                    href: 'https://twitter.com',
                    icon: <Twitter size={20} />,
                    hover: 'hover:bg-sky-500',
                },
                {
                    href: 'https://youtube.com',
                    icon: <Youtube size={20} />,
                    hover: 'hover:bg-red-600',
                },
                {
                    href: 'https://instagram.com',
                    icon: <Instagram size={20} />,
                    hover: 'hover:bg-pink-500',
                },
            ].map((item, i) => (
                <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white shadow-md text-gray-700 transition transform hover:scale-110 ${item.hover} hover:text-white`}
                >
                    {item.icon}
                </a>
            ))}
        </div>
    )
}
