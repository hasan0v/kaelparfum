import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
    title: 'Daxil ol',
    description: 'KƏEL PARFÜM hesabınıza daxil olun',
};

export default async function LoginPage() {
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
                    <p className="text-kael-gray mt-2">Hesabınıza daxil olun</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <LoginForm />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-kael-gray">
                            Hesabınız yoxdur?{' '}
                            <Link href="/qeydiyyat" className="text-kael-gold hover:text-kael-brown font-medium">
                                Qeydiyyatdan keçin
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
