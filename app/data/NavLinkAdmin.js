import { DocumentChartBarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid'

const navLinks = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: <DocumentChartBarIcon className="h-5 w-5 text-primary-600" />
    },
    {
        name:'Product',
        href: '/admin/product',
        icon: <BuildingStorefrontIcon className="h-5 w-5 text-primary-600" />
    }
]

export default navLinks