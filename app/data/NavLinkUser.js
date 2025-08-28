import { CalendarDaysIcon, HomeIcon, UserIcon } from '@heroicons/react/24/solid'

const navLinks = [
    {
        name: 'Home',
        href: '/account',
        icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Guest profile',
        href: '/account/profile',
        icon: <UserIcon className="h-5 w-5 text-primary-600" />,
    },
]

export default navLinks
