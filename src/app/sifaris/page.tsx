import { getUser } from '@/lib/actions/auth';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage() {
    const user = await getUser();

    const userData = user ? {
        name: user.profile?.full_name,
        email: user.email,
        phone: user.profile?.phone
    } : null;

    return <CheckoutClient user={userData} />;
}
