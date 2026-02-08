import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Shield, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedHero } from '@/components/ui/animated-hero';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/lib/supabase/server';

async function getFeaturedProducts() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, sku, price, discount_price, stock_quantity, low_stock_threshold, is_new,
      brand:brands(name),
      images:product_images(image_url, is_primary)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return (data || []) as any[];
}

async function getCategories() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(4);

  return (data || []) as { id: string; name: string; slug: string }[];
}

async function getBrands() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(6);

  return (data || []) as { id: string; name: string; slug: string }[];
}

export default async function HomePage() {
  const [featuredProducts, categories, brands] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <>
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Trust Badges */}
      <section className="py-8 bg-white border-y border-kael-light-gray">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-kael-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-kael-brown text-sm">Pulsuz çatdırılma</p>
                <p className="text-xs text-kael-gray">50 ₼+ sifarişlərə</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-kael-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-kael-brown text-sm">Orijinal məhsullar</p>
                <p className="text-xs text-kael-gray">100% zəmanət</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-kael-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-kael-brown text-sm">Kredit imkanı</p>
                <p className="text-xs text-kael-gray">3-12 ay faizsiz</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-kael-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-kael-brown text-sm">Sürətli çatdırılma</p>
                <p className="text-xs text-kael-gray">2-3 iş günü</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-4">
                Kateqoriyalar
              </h2>
              <p className="text-kael-gray max-w-2xl mx-auto">
                Özünüzə uyğun ətir seçmək üçün kateqoriyaları kəşf edin
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kateqoriyalar/${category.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-kael-brown via-kael-gold/80 to-kael-rose"
                >
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-kael-brown/90 via-kael-gold/70 to-kael-rose/80" />

                  {/* Bottom overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                    <h3
                      className="font-heading text-xl md:text-2xl font-bold drop-shadow-lg transition-colors"
                      style={{ color: 'white' }}
                    >
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-kael-cream/50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-2">
                Seçilmiş məhsullar
              </h2>
              <p className="text-kael-gray">
                Ən çox satılan və tövsiyə olunan ətirlər
              </p>
            </div>
            <Button
              variant="outline"
              className="border-kael-brown text-kael-brown hover:bg-white rounded-full self-start md:self-auto"
              asChild
            >
              <Link href={ROUTES.products}>
                Hamısına bax
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product: any) => {
                const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url;

                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      discountPrice: product.discount_price,
                      imageUrl: primaryImage,
                      brandName: product.brand?.name,
                      isNew: product.is_new,
                      stockQuantity: product.stock_quantity,
                      lowStockThreshold: product.low_stock_threshold,
                      sku: product.sku,
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <ShoppingBag className="h-12 w-12 text-kael-gray mx-auto mb-4" />
              <p className="text-kael-gray">Seçilmiş məhsullar hələ yoxdur</p>
              <p className="text-sm text-kael-gray mt-1">Admin paneldən məhsul əlavə edin</p>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 md:py-24 bg-kael-brown text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-kael-gold/20 text-kael-gold rounded-full text-sm font-medium mb-6">
              💳 Kredit İmkanı
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Tək şəxsiyyət vəsiqəsi ilə <br />
              <span className="text-kael-gold">3-12 ay faizsiz kredit</span>
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              İstədiyiniz ətirləri indi alın, rahatlıqla ödəyin.
              Heç bir faiz və gizli ödəniş yoxdur.
            </p>
            <Button
              size="lg"
              className="bg-kael-gold hover:bg-white hover:text-kael-brown text-white rounded-full px-8 h-14 text-base font-medium"
              asChild
            >
              <Link href={ROUTES.products}>
                İndi sifariş et
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-4">
                Brendlərimiz
              </h2>
              <p className="text-kael-gray max-w-2xl mx-auto">
                Dünyanın ən məşhur parfüm brendləri ilə işləyirik
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brendler/${brand.slug}`}
                  className="aspect-[2/1] flex items-center justify-center p-4 bg-kael-cream/50 rounded-xl hover:bg-kael-cream transition-colors group"
                >
                  <span className="font-heading text-lg font-semibold text-kael-gray group-hover:text-kael-brown transition-colors">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="py-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                Sualınız var?
              </h2>
              <p className="text-white/80">
                WhatsApp vasitəsilə bizimlə əlaqə saxlayın
              </p>
            </div>
            <a
              href="https://wa.me/994709717477"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-[#25D366] px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp ilə yazın
            </a>
          </div>
        </div>
      </section>


    </>
  );
}
