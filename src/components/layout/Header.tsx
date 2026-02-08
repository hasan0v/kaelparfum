'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    Heart,
    User,
    Menu,
    X,
    LogOut,
    Package,
    ChevronDown,
    Phone,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROUTES, NAV_ITEMS } from '@/lib/constants/routes';
import { SITE_CONFIG } from '@/lib/constants/config';
import { useCart } from '@/lib/hooks/useCart';
import { createClient } from '@/lib/supabase/client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role?: string;
}

export default function Header({ initialUser }: { initialUser: UserProfile | null }) {
    const pathname = usePathname();
    const supabase = createClient();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<UserProfile | null>(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const cartItemCount = useCart((state) => state.getTotalQuantity());
    const openCart = useCart((state) => state.openCart);
    const [mounted, setMounted] = useState(false);
    const router = useRouter(); // Import might be needed or updated

    useEffect(() => {
        setMounted(true);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // If we have a session but no user or the ID changed, fetch profile
                if (!user || user.id !== session.user.id) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name, role')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        full_name: (profile as any)?.full_name,
                        role: (profile as any)?.role,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // If we don't have an initial user, try to get session once
        if (!initialUser) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    supabase
                        .from('profiles')
                        .select('full_name, role')
                        .eq('id', session.user.id)
                        .maybeSingle()
                        .then(({ data: profile }) => {
                            setUser({
                                id: session.user.id,
                                email: session.user.email || '',
                                full_name: (profile as any)?.full_name,
                                role: (profile as any)?.role,
                            });
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            });
        }

        return () => subscription.unsubscribe();
    }, [initialUser, supabase]);

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
        setIsUserMenuOpen(false);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/mehsullar?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-kael-light-gray">
            {/* Top Bar */}
            <div className="bg-kael-brown text-white text-sm py-2">
                <div className="container flex items-center justify-between">
                    <div className="hidden sm:flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>50 ₼-dən yuxarı sifarişlərə pulsuz çatdırılma</span>
                    </div>
                    <div className="sm:hidden text-center w-full flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Pulsuz çatdırılma 50 ₼+</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <a href="tel:+994709717477" className="flex items-center gap-2 hover:text-kael-gold transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>070 971 74 77</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Mobile Menu Button */}
                    {/* Mobile Menu Button */}
                    {mounted ? (
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menyu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b border-kael-light-gray">
                                        <SheetTitle className="sr-only">Menyu</SheetTitle>
                                        <Link href={ROUTES.home} onClick={() => setIsMobileMenuOpen(false)}>
                                            <h2 className="font-heading text-2xl font-bold text-kael-brown">
                                                {SITE_CONFIG.name}
                                            </h2>
                                        </Link>
                                    </div>
                                    <nav className="flex-1 overflow-auto p-4">
                                        <ul className="space-y-2">
                                            {NAV_ITEMS.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="block px-4 py-3 rounded-lg text-kael-brown hover:bg-kael-cream transition-colors font-medium"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                    <div className="p-4 border-t border-kael-light-gray space-y-2">
                                        {user ? (
                                            <>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                                                    >
                                                        <ShieldCheck className="h-5 w-5" />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/hesabim"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-kael-cream text-kael-brown font-medium"
                                                >
                                                    <User className="h-5 w-5" />
                                                    {user.full_name || 'Hesabım'}
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-kael-error w-full"
                                                >
                                                    <LogOut className="h-5 w-5" />
                                                    Çıxış
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/giris"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-kael-gold text-white font-medium hover:bg-kael-brown transition-colors"
                                                >
                                                    <User className="h-5 w-5" />
                                                    Daxil ol
                                                </Link>
                                                <Link
                                                    href="/qeydiyyat"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-kael-brown text-kael-brown font-medium hover:bg-kael-cream transition-colors"
                                                >
                                                    Qeydiyyat
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Menyu</span>
                        </Button>
                    )}

                    {/* Logo */}
                    <Link href={ROUTES.home} className="shrink-0">
                        <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-kael-brown">
                            {SITE_CONFIG.name}
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-kael-brown hover:text-kael-gold transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop REMOVED */}

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search Button (Universal) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Axtar</span>
                        </Button>

                        {/* Wishlist */}
                        <Link href={user ? ROUTES.account.wishlist : '/giris'}>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <Heart className="h-5 w-5" />
                                <span className="sr-only">Sevimlilər</span>
                            </Button>
                        </Link>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative shrink-0"
                            onClick={openCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-kael-rose text-white text-xs font-bold rounded-full">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                            <span className="sr-only">Səbət</span>
                        </Button>

                        {/* User - Desktop */}
                        <div className="hidden sm:block relative">
                            {loading ? (
                                <div className="w-10 h-10 rounded-full bg-kael-light-gray animate-pulse" />
                            ) : user ? (
                                <div className="relative flex items-center gap-3">
                                    {user.role === 'admin' && (
                                        <Link href="/admin">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-kael-brown text-kael-brown hover:bg-kael-brown hover:text-white transition-colors gap-2"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                <span className="hidden xl:inline">Admin</span>
                                            </Button>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-kael-cream hover:bg-kael-gold/10 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-kael-gold/20 flex items-center justify-center">
                                            <User className="h-4 w-4 text-kael-gold" />
                                        </div>
                                        <span className="hidden lg:block text-sm font-medium text-kael-brown max-w-[100px] truncate">
                                            {user.full_name || 'Hesabım'}
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-kael-gray hidden lg:block" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-kael-light-gray py-2 z-50">
                                            <div className="px-4 py-2 border-b border-kael-light-gray">
                                                <p className="font-medium text-kael-brown text-sm truncate">
                                                    {user.full_name || 'İstifadəçi'}
                                                </p>
                                                <p className="text-xs text-kael-gray truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/hesabim"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-kael-brown hover:bg-kael-cream transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                Hesabım
                                            </Link>
                                            <Link
                                                href="/hesabim/sifarisler"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-kael-brown hover:bg-kael-cream transition-colors"
                                            >
                                                <Package className="h-4 w-4" />
                                                Sifarişlərim
                                            </Link>
                                            <Link
                                                href="/hesabim/sevimliler"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-kael-brown hover:bg-kael-cream transition-colors"
                                            >
                                                <Heart className="h-4 w-4" />
                                                Sevimlilər
                                            </Link>
                                            <div className="border-t border-kael-light-gray my-1" />
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 px-4 py-2.5 text-kael-error hover:bg-kael-error/5 transition-colors w-full"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Çıxış
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/giris">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-kael-brown hover:text-kael-gold font-medium hidden lg:flex"
                                        >
                                            Daxil ol
                                        </Button>
                                        <Button variant="ghost" size="icon" className="lg:hidden">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/qeydiyyat" className="hidden lg:block">
                                        <Button
                                            size="sm"
                                            className="bg-kael-gold hover:bg-kael-brown text-white rounded-full px-5"
                                        >
                                            Qeydiyyat
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Dialog */}
                <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <DialogContent className="sm:max-w-[600px] top-[20%] translate-y-[-20%]">
                        <DialogHeader>
                            <DialogTitle>Axtarış</DialogTitle>
                        </DialogHeader>
                        <div className="relative mt-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-kael-gray z-10" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                placeholder="Məhsul, brend və ya kateqoriya axtar..."
                                className="w-full pl-14 pr-4 py-4 rounded-full border border-kael-light-gray text-lg focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all outline-none"
                                style={{ paddingLeft: '3.5rem' }}
                                autoFocus
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
}
