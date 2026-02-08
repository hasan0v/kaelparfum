import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
    title: 'Qeydiyyat',
    description: 'KƏEL PARFÜM hesabı yaradın',
};

export default async function RegisterPage() {
    const session = await getSession();

    if (session) {
        redirect('/hesabim');
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="font-heading text-3xl font-bold text-kael-brown">
                            KƏEL PARFÜM
                        </h1>
                    </Link>
                    <p className="text-kael-gray mt-2">Yeni hesab yaradın</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <RegisterForm />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-kael-gray">
                            Artıq hesabınız var?{' '}
                            <Link href="/giris" className="text-kael-gold hover:text-kael-brown font-medium">
                                Daxil olun
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
