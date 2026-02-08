import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Plus, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ProductActions from '@/components/admin/ProductActions';
import { ROUTES } from '@/lib/constants/routes';
import { getProducts } from '@/lib/actions/products';
import { isAdmin } from '@/lib/actions/auth';

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    out_of_stock: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
    active: 'Aktiv',
    draft: 'Qaralama',
    out_of_stock: 'Stokda yox',
};

function getProductStatus(product: { is_active: boolean; stock_quantity: number }) {
    if (product.stock_quantity === 0) return 'out_of_stock';
    if (!product.is_active) return 'draft';
    return 'active';
}

export default async function ProductsPage() {
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
        redirect('/giris');
    }

    const { products, total } = await getProducts();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Məhsullar</h1>
                    <p className="text-gray-500">Məhsullarınızı idarə edin ({total} məhsul)</p>
                </div>
                <Button className="bg-kael-gold hover:bg-kael-brown text-white" asChild>
                    <Link href={ROUTES.admin.products + '/yeni'}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Məhsul
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Məhsul axtar..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-kael-gold focus:ring-1 focus:ring-kael-gold/20"
                        />
                    </div>
                </div>
            </Card>

            {/* Products Table */}
            <Card>
                {products.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Məhsul yoxdur</h3>
                        <p className="text-gray-500 mb-6">İlk məhsulunuzu əlavə edin</p>
                        <Button className="bg-kael-gold hover:bg-kael-brown text-white" asChild>
                            <Link href={ROUTES.admin.products + '/yeni'}>
                                <Plus className="h-4 w-4 mr-2" />
                                Yeni Məhsul
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left">
                                            <Checkbox />
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Məhsul</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">SKU</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Qiymət</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Stok</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kateqoriya</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Əməliyyatlar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product: any) => {
                                        const status = getProductStatus(product);
                                        const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url;

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <Checkbox />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {primaryImage ? (
                                                                <Image
                                                                    src={primaryImage}
                                                                    alt={product.name}
                                                                    width={48}
                                                                    height={48}
                                                                    className="rounded-lg object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <Package className="h-6 w-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                            <p className="text-sm text-gray-500">{product.brand?.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600">{product.sku}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        {product.discount_price ? (
                                                            <>
                                                                <p className="font-medium text-gray-900">{product.discount_price} ₼</p>
                                                                <p className="text-sm text-gray-400 line-through">{product.price} ₼</p>
                                                            </>
                                                        ) : (
                                                            <p className="font-medium text-gray-900">{product.price} ₼</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className={`font-medium ${product.stock_quantity <= 5 ? 'text-orange-600' : product.stock_quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {product.stock_quantity} ədəd
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600">{product.category?.name || '-'}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={statusColors[status]}>
                                                        {statusLabels[status]}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <ProductActions productId={product.id} productSlug={product.slug} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                {products.length} / {total} məhsul
                            </p>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
