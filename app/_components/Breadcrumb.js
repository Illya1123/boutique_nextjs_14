import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'

export default function AppBreadcrumb({ items }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <BreadcrumbItem key={index}>
                        {item.href ? (
                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
