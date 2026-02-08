'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateDeliveryFee } from '@/lib/utils/whatsapp';

export interface CartItem {
    id: string; // Unique cart item ID (product_id + variant_id)
    productId: string;
    variantId?: string;
    name: string;
    slug: string;
    imageUrl: string;
    sku: string;
    price: number;
    quantity: number;
    stockQuantity: number;
    variantName?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

interface CartActions {
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

interface CartGetters {
    getItem: (productId: string, variantId?: string) => CartItem | undefined;
    getSubtotal: () => number;
    getDeliveryFee: () => number;
    getTotal: () => number;
    getItemCount: () => number;
    getTotalQuantity: () => number;
}

type CartStore = CartState & CartActions & CartGetters;

/**
 * Generate unique cart item ID
 */
function generateCartItemId(productId: string, variantId?: string): string {
    return variantId ? `${productId}-${variantId}` : productId;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            // State
            items: [],
            isOpen: false,

            // Actions
            addItem: (item) => {
                const id = generateCartItemId(item.productId, item.variantId);

                set((state) => {
                    const existingItem = state.items.find((i) => i.id === id);

                    if (existingItem) {
                        // Update quantity if item exists
                        const newQuantity = Math.min(
                            existingItem.quantity + item.quantity,
                            existingItem.stockQuantity
                        );

                        return {
                            items: state.items.map((i) =>
                                i.id === id ? { ...i, quantity: newQuantity } : i
                            ),
                            isOpen: true, // Open cart drawer when item is added
                        };
                    }

                    // Add new item
                    return {
                        items: [...state.items, { ...item, id }],
                        isOpen: true,
                    };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.id !== id) return item;

                        // Clamp quantity to available stock
                        const newQuantity = Math.min(quantity, item.stockQuantity);
                        return { ...item, quantity: newQuantity };
                    }),
                }));
            },

            clearCart: () => {
                set({ items: [], isOpen: false });
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },

            // Getters
            getItem: (productId, variantId) => {
                const id = generateCartItemId(productId, variantId);
                return get().items.find((item) => item.id === id);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
            },

            getDeliveryFee: () => {
                const subtotal = get().getSubtotal();
                return calculateDeliveryFee(subtotal);
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const deliveryFee = calculateDeliveryFee(subtotal);
                return subtotal + deliveryFee;
            },

            getItemCount: () => {
                return get().items.length;
            },

            getTotalQuantity: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'kael-cart-storage',
            // Only persist items, not UI state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
