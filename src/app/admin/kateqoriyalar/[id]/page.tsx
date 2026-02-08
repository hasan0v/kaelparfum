import { redirect } from 'next/navigation';
import { getCategoryById } from '@/lib/actions/categories';
import CategoryForm from '@/components/admin/CategoryForm';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params;
    const { category, success } = await getCategoryById(id);

    if (!success || !category) {
        redirect('/admin/kateqoriyalar');
    }

    return <CategoryForm initialData={category} isEdit={true} />;
}
