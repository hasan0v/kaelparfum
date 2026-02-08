// Site routes
export const ROUTES = {
    home: '/',
    products: '/mehsullar',
    product: (slug: string) => `/mehsullar/${slug}`,
    categories: '/kateqoriyalar',
    category: (slug: string) => `/kateqoriyalar/${slug}`,
    brands: '/brendler',
    brand: (slug: string) => `/brendler/${slug}`,
    cart: '/sebet',
    checkout: '/sifaris',
    about: '/haqqimizda',
    search: '/axtar',

    // Account routes
    // Account routes
    account: {
        login: '/giris',
        register: '/qeydiyyat',
        profile: '/hesabim',
        orders: '/hesabim/sifarisler',
        wishlist: '/hesabim/sevimliler',
    },

    // Admin routes
    admin: {
        dashboard: '/admin',
        products: '/admin/mehsullar',
        productNew: '/admin/mehsullar/yeni',
        productEdit: (id: string) => `/admin/mehsullar/${id}`,
        orders: '/admin/sifarisler',
        orderDetail: (id: string) => `/admin/sifarisler/${id}`,
        categories: '/admin/kateqoriyalar',
        brands: '/admin/brendler',
        reviews: '/admin/serhler',
        settings: '/admin/parametrler',
        analytics: '/admin/statistika',
        users: '/admin/istifadeciler',
    },
} as const;

// Navigation items
export const NAV_ITEMS = [
    { label: 'Məhsullar', href: ROUTES.products },
    { label: 'Kateqoriyalar', href: ROUTES.categories },
    { label: 'Brendlər', href: ROUTES.brands },
    { label: 'Haqqımızda', href: ROUTES.about },
] as const;

// Admin navigation items
export const ADMIN_NAV_ITEMS = [
    { label: 'İdarə paneli', href: ROUTES.admin.dashboard, icon: 'LayoutDashboard' },
    { label: 'Məhsullar', href: ROUTES.admin.products, icon: 'Package' },
    { label: 'Sifarişlər', href: ROUTES.admin.orders, icon: 'ShoppingCart' },
    { label: 'Kateqoriyalar', href: ROUTES.admin.categories, icon: 'FolderTree' },
    { label: 'Brendlər', href: ROUTES.admin.brands, icon: 'Award' },
    { label: 'Şərhlər', href: ROUTES.admin.reviews, icon: 'MessageSquare' },
    { label: 'İstifadəçilər', href: ROUTES.admin.users, icon: 'Users' },
    { label: 'Parametrlər', href: ROUTES.admin.settings, icon: 'Settings' },
    { label: 'Statistika', href: ROUTES.admin.analytics, icon: 'BarChart3' },
] as const;
