export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    parent_id: string | null
                    image_url: string | null
                    description: string | null
                    is_active: boolean
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    parent_id?: string | null
                    image_url?: string | null
                    description?: string | null
                    is_active?: boolean
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    parent_id?: string | null
                    image_url?: string | null
                    description?: string | null
                    is_active?: boolean
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            brands: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    logo_url: string | null
                    description: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    logo_url?: string | null
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    logo_url?: string | null
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    sku: string
                    barcode: string | null
                    category_id: string | null
                    brand_id: string | null
                    price: number
                    discount_price: number | null
                    stock_quantity: number
                    low_stock_threshold: number
                    short_description: string | null
                    description: string | null
                    ingredients: string | null
                    usage_instructions: string | null
                    storage_conditions: string | null
                    is_active: boolean
                    is_featured: boolean
                    is_new: boolean
                    view_count: number
                    meta_title: string | null
                    meta_description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    sku: string
                    barcode?: string | null
                    category_id?: string | null
                    brand_id?: string | null
                    price: number
                    discount_price?: number | null
                    stock_quantity?: number
                    low_stock_threshold?: number
                    short_description?: string | null
                    description?: string | null
                    ingredients?: string | null
                    usage_instructions?: string | null
                    storage_conditions?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    is_new?: boolean
                    view_count?: number
                    meta_title?: string | null
                    meta_description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    sku?: string
                    barcode?: string | null
                    category_id?: string | null
                    brand_id?: string | null
                    price?: number
                    discount_price?: number | null
                    stock_quantity?: number
                    low_stock_threshold?: number
                    short_description?: string | null
                    description?: string | null
                    ingredients?: string | null
                    usage_instructions?: string | null
                    storage_conditions?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    is_new?: boolean
                    view_count?: number
                    meta_title?: string | null
                    meta_description?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            product_images: {
                Row: {
                    id: string
                    product_id: string
                    image_url: string
                    alt_text: string | null
                    is_primary: boolean
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    image_url: string
                    alt_text?: string | null
                    is_primary?: boolean
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    image_url?: string
                    alt_text?: string | null
                    is_primary?: boolean
                    display_order?: number
                    created_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    name: string
                    sku: string
                    price_adjustment: number
                    stock_quantity: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    name: string
                    sku: string
                    price_adjustment?: number
                    stock_quantity?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    name?: string
                    sku?: string
                    price_adjustment?: number
                    stock_quantity?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone: string | null
                    avatar_url: string | null
                    role: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone?: string | null
                    avatar_url?: string | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone?: string | null
                    avatar_url?: string | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    label: string | null
                    full_name: string
                    phone: string
                    address_line1: string
                    address_line2: string | null
                    city: string
                    postal_code: string | null
                    is_default: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    label?: string | null
                    full_name: string
                    phone: string
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    postal_code?: string | null
                    is_default?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    label?: string | null
                    full_name?: string
                    phone?: string
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    postal_code?: string | null
                    is_default?: boolean
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string | null
                    customer_name: string
                    customer_email: string | null
                    customer_phone: string
                    address_line1: string
                    address_line2: string | null
                    city: string
                    postal_code: string | null
                    subtotal: number
                    delivery_fee: number
                    discount_amount: number
                    total: number
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    notes: string | null
                    whatsapp_sent: boolean
                    whatsapp_confirmed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    user_id?: string | null
                    customer_name: string
                    customer_email?: string | null
                    customer_phone: string
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    postal_code?: string | null
                    subtotal: number
                    delivery_fee?: number
                    discount_amount?: number
                    total: number
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    notes?: string | null
                    whatsapp_sent?: boolean
                    whatsapp_confirmed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    user_id?: string | null
                    customer_name?: string
                    customer_email?: string | null
                    customer_phone?: string
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    postal_code?: string | null
                    subtotal?: number
                    delivery_fee?: number
                    discount_amount?: number
                    total?: number
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    notes?: string | null
                    whatsapp_sent?: boolean
                    whatsapp_confirmed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    variant_id: string | null
                    product_name: string
                    product_sku: string
                    product_image_url: string | null
                    variant_name: string | null
                    quantity: number
                    unit_price: number
                    total_price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    variant_id?: string | null
                    product_name: string
                    product_sku: string
                    product_image_url?: string | null
                    variant_name?: string | null
                    quantity: number
                    unit_price: number
                    total_price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    variant_id?: string | null
                    product_name?: string
                    product_sku?: string
                    product_image_url?: string | null
                    variant_name?: string | null
                    quantity?: number
                    unit_price?: number
                    total_price?: number
                    created_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string
                    rating: number
                    comment: string | null
                    is_verified_purchase: boolean
                    is_approved: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id: string
                    rating: number
                    comment?: string | null
                    is_verified_purchase?: boolean
                    is_approved?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    user_id?: string
                    rating?: number
                    comment?: string | null
                    is_verified_purchase?: boolean
                    is_approved?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            wishlists: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    created_at?: string
                }
            }
            site_settings: {
                Row: {
                    id: string
                    key: string
                    value: string | null
                    type: 'text' | 'number' | 'boolean' | 'json'
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value?: string | null
                    type?: 'text' | 'number' | 'boolean' | 'json'
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: string | null
                    type?: 'text' | 'number' | 'boolean' | 'json'
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Category = Tables<'categories'>
export type Brand = Tables<'brands'>
export type Product = Tables<'products'>
export type ProductImage = Tables<'product_images'>
export type ProductVariant = Tables<'product_variants'>
export type Profile = Tables<'profiles'>
export type Address = Tables<'addresses'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Review = Tables<'reviews'>
export type Wishlist = Tables<'wishlists'>
export type SiteSetting = Tables<'site_settings'>

// Extended product type with relations
export type ProductWithRelations = Product & {
    category?: Category | null
    brand?: Brand | null
    images?: ProductImage[]
    variants?: ProductVariant[]
}
