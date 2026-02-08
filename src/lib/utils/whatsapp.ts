import { WHATSAPP_CONFIG, SITE_CONFIG, DELIVERY_CONFIG } from '@/lib/constants/config';
import { formatPrice } from '@/lib/utils/format';

export interface OrderItem {
    name: string;
    variant?: string;
    quantity: number;
    price: number;
}

export interface WhatsAppOrderData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    notes?: string;
    orderNumber?: string;
}

/**
 * Generate formatted WhatsApp order message
 */
export function generateOrderMessage(data: WhatsAppOrderData): string {
    const {
        customerName,
        customerPhone,
        customerAddress,
        items,
        subtotal,
        deliveryFee,
        total,
        notes,
        orderNumber
    } = data;

    const productList = items
        .map(
            (item, index) =>
                `${index + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ''} - ${item.quantity} ədəd - ${formatPrice(item.price * item.quantity)}`
        )
        .join('\n');

    const dateTime = new Date().toLocaleString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const message = `
🛍️ YENİ SİFARİŞ - ${SITE_CONFIG.name}
${orderNumber ? `📋 Sifariş №: ${orderNumber}\n` : ''}
👤 MÜŞTƏRİ:
Ad: ${customerName}
Telefon: ${customerPhone}
Ünvan: ${customerAddress}

📦 MƏHSULLAR:
${productList}

💰 QİYMƏT:
Ara cəm: ${formatPrice(subtotal)}
Çatdırılma: ${deliveryFee > 0 ? formatPrice(deliveryFee) : 'Pulsuz'}
CƏMİ: ${formatPrice(total)}
${notes ? `\n📝 QEYD: ${notes}` : ''}

🌐 Sayt: ${SITE_CONFIG.url.replace('https://', '').replace('http://', '')}
📅 Tarix: ${dateTime}
  `.trim();

    return message;
}

/**
 * Generate WhatsApp deep link
 */
export function generateWhatsAppLink(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = WHATSAPP_CONFIG.number.replace('+', '');

    // Check if running in browser
    if (typeof window === 'undefined') {
        return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return isMobile
        ? `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
}

/**
 * Generate WhatsApp order link with pre-filled message
 */
export function generateWhatsAppOrderLink(orderData: WhatsAppOrderData): string {
    const message = generateOrderMessage(orderData);
    return generateWhatsAppLink(message);
}

/**
 * Open WhatsApp with order message
 */
export function openWhatsAppOrder(orderData: WhatsAppOrderData): void {
    const link = generateWhatsAppOrderLink(orderData);
    window.open(link, '_blank');
}

/**
 * Generate simple WhatsApp contact link
 */
export function generateWhatsAppContactLink(message?: string): string {
    const msg = message || WHATSAPP_CONFIG.defaultMessage;
    return generateWhatsAppLink(msg);
}

/**
 * Calculate delivery fee based on subtotal
 */
export function calculateDeliveryFee(subtotal: number): number {
    if (subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold) {
        return 0;
    }
    return DELIVERY_CONFIG.fee;
}
