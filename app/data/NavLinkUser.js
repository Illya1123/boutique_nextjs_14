import { CalendarDaysIcon, HomeIcon, UserIcon, ShoppingBagIcon } from '@heroicons/react/24/solid'

const navLinks = [
    {
        name: 'Thông tin tài khoản',
        href: '/account/profile',
        icon: <UserIcon className="w-5 h-5 text-primary-600" />,
    },
    {
        name: 'Đơn đã đặt',
        href: '/account/orders',
        icon: <ShoppingBagIcon className="w-5 h-5 text-primary-600" />,
    },
]

export default navLinks
