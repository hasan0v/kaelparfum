import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Tag,
    Building2,
    ShoppingCart,
    Users,
    Star,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'İdarə paneli', href: ROUTES.admin.dashboard },
    { icon: Package, label: 'Məhsullar', href: ROUTES.admin.products },
    { icon: Tag, label: 'Kateqoriyalar', href: ROUTES.admin.categories },
    { icon: Building2, label: 'Brendlər', href: ROUTES.admin.brands },
    { icon: ShoppingCart, label: 'Sifarişlər', href: ROUTES.admin.orders },
    { icon: Users, label: 'Müştərilər', href: ROUTES.admin.users },
    { icon: Star, label: 'Rəylər', href: ROUTES.admin.reviews },
    { icon: Settings, label: 'Parametrlər', href: ROUTES.admin.settings },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile: any = null;

    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', user.id)
            .single();
        profile = data;
    }

    const userName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
    const userEmail = user?.email || 'admin@kaelparfum.az';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-kael-brown text-white hidden lg:block">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <Link href={ROUTES.admin.dashboard}>
                            <h1 className="font-heading text-2xl font-bold text-kael-gold mt-2">
                                Admin Panel
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <ul className="space-y-1">
                            {sidebarItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <LayoutDashboard className="h-5 w-5 rotate-180" />
                            <span>Sayta qayıt</span>
                        </Link>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-kael-error hover:bg-white/10 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Çıxış</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Mobile menu button */}
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Admin Panel
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">{userEmail}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-kael-gold text-white flex items-center justify-center font-semibold">
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div >
    );
}
