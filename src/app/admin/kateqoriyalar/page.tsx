import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Search, FolderOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CategoryActions from '@/components/admin/CategoryActions';
import { ROUTES } from '@/lib/constants/routes';
import { getCategories } from '@/lib/actions/categories';
import { isAdmin } from '@/lib/actions/auth';

export default async function CategoriesPage() {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
        redirect('/giris');
    }

    const { categories, total, error } = await getCategories();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kateqoriyalar</h1>
                    <p className="text-gray-500">Məhsul kateqoriyalarını idarə edin ({total})</p>
                </div>
                <Button className="bg-kael-gold hover:bg-kael-brown text-white" asChild>
                    <Link href={ROUTES.admin.categories + '/yeni'}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Kateqoriya
                    </Link>
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Categories Table */}
            <Card>
                {!categories || categories.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Kateqoriya yoxdur</h3>
                        <p className="text-gray-500 mb-6">İlk kateqoriyanızı yaradın</p>
                        <Button className="bg-kael-gold hover:bg-kael-brown text-white" asChild>
                            <Link href={ROUTES.admin.categories + '/yeni'}>
                                <Plus className="h-4 w-4 mr-2" />
                                Yeni Kateqoriya
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Şəkil</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Ad</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Slug</th>
                                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">Sıra</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Əməliyyatlar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((category: any) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 w-16">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {category.image_url ? (
                                                    <img
                                                        src={category.image_url}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FolderOpen className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-gray-900">{category.name}</td>
                                        <td className="py-4 px-4 text-gray-500">{category.slug}</td>
                                        <td className="py-4 px-4 text-center text-gray-500">{category.display_order}</td>
                                        <td className="py-4 px-4">
                                            <Badge className={category.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                                                {category.is_active ? 'Aktiv' : 'Passiv'}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <CategoryActions categoryId={category.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
