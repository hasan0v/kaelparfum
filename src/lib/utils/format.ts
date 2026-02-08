/**
 * Format price in AZN (Azerbaijani Manat)
 */
export function formatPrice(price: number): string {
    return `${price.toFixed(2)} ₼`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, discountPrice: number): number {
    if (originalPrice <= 0 || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

/**
 * Format date in Azerbaijani format
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format date and time in Azerbaijani format
 */
export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generate slug from text (supports Azerbaijani characters)
 */
export function slugify(text: string): string {
    const azMap: Record<string, string> = {
        'ə': 'e',
        'Ə': 'e',
        'ğ': 'g',
        'Ğ': 'g',
        'ı': 'i',
        'I': 'i',
        'İ': 'i',
        'ö': 'o',
        'Ö': 'o',
        'ü': 'u',
        'Ü': 'u',
        'ç': 'c',
        'Ç': 'c',
        'ş': 's',
        'Ş': 's'
    };

    return text
        .toLowerCase()
        .split('')
        .map(char => azMap[char] || char)
        .join('')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as +994 XX XXX XX XX
    if (cleaned.length === 12 && cleaned.startsWith('994')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
    }

    return phone;
}
