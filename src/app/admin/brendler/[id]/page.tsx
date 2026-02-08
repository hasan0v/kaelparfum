import { redirect } from 'next/navigation';
import { getBrandById } from '@/lib/actions/brands';
import BrandForm from '@/components/admin/BrandForm';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditBrandPage({ params }: PageProps) {
    const { id } = await params;
    const { brand, success } = await getBrandById(id);

    if (!success || !brand) {
        redirect('/admin/brendler');
    }

    return <BrandForm initialData={brand} isEdit={true} />;
}
