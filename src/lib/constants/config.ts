// Site configuration
export const SITE_CONFIG = {
    name: 'KƏEL PARFÜM',
    description: 'Premium parfüm və kosmetika məhsulları - Azərbaycanda ən yaxşı qiymətlərlə',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kaelparfum.com',
    locale: 'az-AZ',
    currency: 'AZN',
    currencySymbol: '₼',
} as const;

// WhatsApp configuration
export const WHATSAPP_CONFIG = {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994709717477',
    defaultMessage: 'Salam! KƏEL PARFÜM saytından yazıram.',
} as const;

// Delivery configuration
export const DELIVERY_CONFIG = {
    fee: Number(process.env.NEXT_PUBLIC_DELIVERY_FEE) || 5,
    freeDeliveryThreshold: Number(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD) || 50,
} as const;

// Social media links
export const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/kaelparfum/',
    whatsapp: `https://wa.me/${WHATSAPP_CONFIG.number}`,
} as const;

// Contact information
export const CONTACT_INFO = {
    phones: ['+994 070 971 74 77', '+994 051 572 73 78'],
    email: 'info@kaelparfum.com',
    address: 'Qəbələ, Azərbaycan',
    hours: '09:00 - 20:00',
} as const;

// Order statuses with translations
export const ORDER_STATUSES = {
    pending: { label: 'Gözləyir', color: 'yellow' },
    confirmed: { label: 'Təsdiqlənib', color: 'blue' },
    processing: { label: 'Hazırlanır', color: 'indigo' },
    shipped: { label: 'Göndərilib', color: 'purple' },
    delivered: { label: 'Çatdırılıb', color: 'green' },
    cancelled: { label: 'Ləğv edilib', color: 'red' },
} as const;

// Stock status thresholds
export const STOCK_CONFIG = {
    lowStockThreshold: 5,
    outOfStockMessage: 'Stokda yoxdur',
    lowStockMessage: 'Az qalıb',
    inStockMessage: 'Stokda var',
} as const;

// Pagination
export const PAGINATION_CONFIG = {
    productsPerPage: 16,
    ordersPerPage: 20,
    reviewsPerPage: 10,
} as const;

// Image sizes
export const IMAGE_SIZES = {
    productCard: { width: 400, height: 400 },
    productGallery: { width: 800, height: 800 },
    productThumbnail: { width: 100, height: 100 },
    categoryCard: { width: 600, height: 400 },
    brandLogo: { width: 200, height: 100 },
    hero: { width: 1920, height: 800 },
} as const;
