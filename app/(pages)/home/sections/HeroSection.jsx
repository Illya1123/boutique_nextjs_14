export default function HeroSection() {
    return (
        <section className="h-screen flex flex-col justify-center items-center text-white bg-cover bg-center relative bg-[url(https://images.unsplash.com/photo-1738215778388-f2823c7fcf07?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to Boutique</h1>
                <p className="text-lg">Your one-stop shop for everything stylish.</p>
            </div>
        </section>
    )
}
