import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Auto open si un enfant est actif
    useEffect(() => {
        const newState: Record<string, boolean> = {};

        items.forEach((item) => {
            if (
                item.subItems?.some((sub) =>
                    isCurrentUrl(sub.href)
                )
            ) {
                newState[item.title] = true;
            }
        });

        setOpenMenus((prev) => ({ ...prev, ...newState }));
    }, [items]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.subItems != null ? item.subItems?.length > 0  : false;

                    const isChildActive =
                        hasChildren &&
                        item.subItems?.some((sub) =>
                            isCurrentUrl(sub.href)
                        );

                    const isOpen = openMenus[item.title];

                    return (
                        <div key={item.title} className="space-y-1">
                            {/* Parent */}
                            <SidebarMenuItem>
                                {hasChildren ? (
                                    <SidebarMenuButton
                                        onClick={() => toggleMenu(item.title)}
                                        isActive={isChildActive}
                                        className="group transition-all duration-200"
                                    >
                                        {item.icon && (
                                            <item.icon className="mr-2 h-4 w-4 opacity-80 group-hover:opacity-100" />
                                        )}
                                        <span className="flex-1 text-sm font-medium">
                                            {item.title}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-300 ${
                                                isOpen
                                                    ? 'rotate-180'
                                                    : 'rotate-0'
                                            }`}
                                        />
                                    </SidebarMenuButton>
                                ) : (
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        className="group transition-all duration-200"
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4 opacity-80 group-hover:opacity-100" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>

                            {/* Children with smooth animation */}
                            {hasChildren && (
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen
                                            ? 'max-h-96 opacity-100'
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                                        {item.subItems?.map((sub) => (
                                            <SidebarMenuItem key={sub.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isCurrentUrl(
                                                        sub.href
                                                    )}
                                                    className="text-sm"
                                                >
                                                    <Link
                                                        href={sub.href}
                                                        prefetch
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}