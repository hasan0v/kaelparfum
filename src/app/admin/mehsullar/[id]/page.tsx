import { redirect } from 'next/navigation';
import { getProductById } from '@/lib/actions/products';
import ProductForm from '@/components/admin/ProductForm';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    const { product, success } = await getProductById(id);

    if (!success || !product) {
        redirect('/admin/mehsullar');
    }

    return <ProductForm initialData={product} isEdit={true} />;
}
