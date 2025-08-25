export default function ContactSection() {
    return (
        <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center overflow-hidden">
            <div className="absolute inset-0">
                <div className="w-72 h-72 bg-white/10 rounded-full blur-3xl absolute top-10 left-10 animate-pulse"></div>
                <div className="w-96 h-96 bg-white/5 rounded-full blur-2xl absolute bottom-0 right-0"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg md:text-xl mb-8 text-gray-100">
                    We’d love to hear from you. Contact us today and let’s build something amazing
                    together!
                </p>
                <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300">
                    Contact Us
                </button>
            </div>
        </section>
    )
}
