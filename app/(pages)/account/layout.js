import SideNavigation from '@/app/_components/SideNavigation'
import navLinks from '@/app/data/NavLinkUser'

export default function Layout({ children }) {
    return (
        <div className="grid grid-cols-[16rem_1fr] min-h-screen items-start gap-12">
            <aside className="sticky top-0 self-start">
                <SideNavigation navLinks={navLinks} />
            </aside>

            <div className="py-1">{children}</div>
        </div>
    )
}
