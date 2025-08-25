import Link from 'next/link'
import Image from 'next/image'

export default function AboutHero() {
    return (
        <section className="min-h-screen flex items-center bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl mx-auto">
                {/* Cột hình ảnh */}
                <div className="relative flex items-center justify-center md:justify-end h-[30rem] md:h-screen bg-gray-100">
                    {/* Ảnh nền */}
                    <div className="absolute right-0 top-0 h-full w-full md:w-full">
                        <img
                            src="https://images.unsplash.com/photo-1662098702119-33b73cb13484?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Khung chân dung */}
                    <div
                        className="relative z-10 
                        w-56 h-[20rem] sm:w-72 sm:h-[28rem] 
                        md:w-[28rem] md:h-[40rem] 
                        overflow-hidden rounded-[9999px_9999px_0_0] shadow-xl bg-white
                        md:mr-[-3rem]"
                    >
                        <Image
                            src="/images/about/toi_day.jpg"
                            alt="founder của Boutique"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Cột nội dung */}
                <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 space-y-6 bg-gray-50 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wide">
                        MEET QUOC ANH, <br className="hidden md:block" /> BOUTIQUE FOUNDER
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0">
                        Hi, I’m Quoc Anh — founder of Boutique. I’ve always been passionate about
                        minimal style and creating timeless pieces that feel both modern and
                        approachable. Boutique is my way of sharing this passion and inspiring
                        others to embrace a simple yet elegant lifestyle.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <button className="border border-black px-6 sm:px-8 py-2 sm:py-3 text-sm tracking-wider hover:bg-black hover:text-white transition w-fit">
                            <Link href="/services">SERVICES</Link>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
