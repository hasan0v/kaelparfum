'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database';

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createAdminClient();

    const { error } = await supabase
        .from('orders')
        .update({ status: status as any }) // Type assertion to bypass potential mismatch
        .eq('id', orderId);

    if (error) {
        return { success: false, error: 'Status yenilənmədi' };
    }

    revalidatePath(`/admin/sifarisler/${orderId}`);
    revalidatePath('/admin/sifarisler');
    revalidatePath('/admin');

    return { success: true, message: 'Status uğurla yeniləndi' };
}

interface CreateOrderParams {
    customer: {
        fullName: string;
        phone: string;
        email: string;
        city: string;
        address: string;
        notes: string;
    };
    items: {
        id: string; // product_id
        quantity: number;
        price: number;
    }[];
    paymentMethod: 'cash' | 'credit';
    totals: {
        subtotal: number;
        deliveryFee: number;
        total: number;
    };
}

import { getUser } from '@/lib/actions/auth';

export async function createOrder(data: CreateOrderParams) {
    const supabase = await createAdminClient();
    const user = await getUser();

    // 1. Generate Order Number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 2. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: orderNumber,
            user_id: user?.id || null,
            customer_name: data.customer.fullName,
            customer_phone: data.customer.phone,
            customer_email: data.customer.email,
            city: data.customer.city,
            address_line1: data.customer.address,
            notes: data.paymentMethod === 'credit' ? `Ödəniş növü: Kredit\n${data.customer.notes}` : data.customer.notes,
            status: 'pending',
            subtotal: data.totals.subtotal,
            delivery_fee: data.totals.deliveryFee,
            total: data.totals.total,
            whatsapp_sent: true,
            discount_amount: 0,
        } as any) // Type assertion
        .select()
        .single();

    if (orderError || !order) {
        console.error('Order creation error:', orderError);
        return { success: false, error: 'Sifariş yaradılarkən xəta baş verdi' };
    }

    // 3. Insert Order Items
    // We need to fetch product details to get name and sku, or require them in params
    // For now, assuming we might miss them, let's try to get them or use placeholders
    // Ideally, data.items should include name/sku/image

    // NOTE: The database requires product_name, product_sku, unit_price, total_price
    // We only have price and quantity in data.items currently.
    // We should probably fetch the product details OR pass them from frontend.
    // Given the user flow, passing from frontend is faster for now.

    // However, to fix the IMMEDIATE error "Could not find the 'price' column", we must map 'price' to 'unit_price'
    // and add 'total_price'.

    // Ideally we should augment CreateOrderParams to include name/sku.
    // But let's check what 'data.items' actually has from CheckoutClient.
    // CheckoutClient sends: id, quantity, price. It DOES NOT send name or sku.
    // So we must fetch them here or compromise.
    // Let's fetch them for correctness.

    const productIds = data.items.map(i => i.id);
    const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, products_images:product_images(image_url)')
        .in('id', productIds);

    const productsMap = new Map(products?.map(p => [p.id, p]) || []);

    const safeOrder = order as any; // Cast to avoid TS 'never' errors

    const orderItems = data.items.map(item => {
        const product = productsMap.get(item.id);
        // Fallback or error if product not found? 
        // For now, safe fallback to avoid crash
        return {
            order_id: safeOrder.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
            product_name: product?.name || 'Unknown Product',
            product_sku: product?.sku || 'UNKNOWN',
            product_image_url: (product as any)?.products_images?.[0]?.image_url || null
        };
    });

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any);

    if (itemsError) {
        console.error('Order items error:', itemsError);
        return { success: false, error: 'Məhsullar əlavə edilərkən xəta baş verdi' };
    }

    revalidatePath('/admin/sifarisler');
    return { success: true, orderId: safeOrder.id, orderNumber: orderNumber };
}
