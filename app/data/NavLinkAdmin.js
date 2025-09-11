import {
    DocumentChartBarIcon,
    BuildingStorefrontIcon,
    DocumentIcon,
    ShoppingCartIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/solid'

const navLinks = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: <DocumentChartBarIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Product',
        href: '/admin/product',
        icon: <BuildingStorefrontIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Category',
        href: '/admin/category',
        icon: <DocumentIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Blog',
        href: '/admin/blogs',
        icon: <DocumentIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Orders',
        href: '/admin/orders',
        icon: <ShoppingCartIcon className="h-5 w-5 text-primary-600" />,
    },
    {
        name: 'Setting',
        href: '/admin/setting',
        icon: <Cog6ToothIcon className="h-5 w-5 text-primary-600" />,
    },
]

export default navLinks
