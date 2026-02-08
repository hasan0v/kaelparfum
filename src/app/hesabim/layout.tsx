import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/actions/auth';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

const accountNavItems = [
    { label: 'Hesabım', href: '/hesabim', icon: User },
    { label: 'Sifarişlərim', href: '/hesabim/sifarisler', icon: Package },
    { label: 'Sevimlilər', href: '/hesabim/sevimliler', icon: Heart },
];

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect('/giris');
    }

    return (
        <div className="bg-kael-cream/30 min-h-screen">
            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            {/* User Info */}
                            <div className="flex items-center gap-4 pb-6 border-b border-kael-light-gray">
                                <div className="w-14 h-14 rounded-full bg-kael-gold/10 flex items-center justify-center">
                                    <User className="h-7 w-7 text-kael-gold" />
                                </div>
                                <div>
                                    <p className="font-semibold text-kael-brown">
                                        {user.profile?.full_name || 'İstifadəçi'}
                                    </p>
                                    <p className="text-sm text-kael-gray">{user.email}</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="mt-6 space-y-1">
                                {accountNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-kael-brown hover:bg-kael-cream hover:text-kael-gold transition-colors"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}

                                <SignOutButton />
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">{children}</main>
                </div>
            </div>
        </div>
    );
}
