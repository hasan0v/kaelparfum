'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/actions/auth';

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Şifrələr uyğun gəlmir');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Şifrə minimum 6 simvol olmalıdır');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signUp(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError('Qeydiyyat zamanı xəta baş verdi');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-kael-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-kael-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-kael-brown mb-2">
                    Qeydiyyat uğurlu oldu!
                </h3>
                <p className="text-kael-gray mb-4">
                    E-poçt ünvanınıza təsdiq linki göndərildi. Zəhmət olmasa e-poçtunuzu yoxlayın.
                </p>
                <Button
                    onClick={() => router.push('/giris')}
                    className="bg-kael-gold hover:bg-kael-brown text-white rounded-xl"
                >
                    Daxil ol səhifəsinə keç
                </Button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-4 bg-kael-error/10 border border-kael-error/20 rounded-xl text-kael-error text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-kael-brown mb-2">
                    Ad və Soyad
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kael-gray" />
                    <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all bg-white"
                        style={{ paddingLeft: '3.5rem' }}
                        placeholder="Ad Soyad"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-kael-brown mb-2">
                    E-poçt
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kael-gray" />
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all bg-white"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="email@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-kael-brown mb-2">
                    Telefon
                </label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kael-gray" />
                    <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all bg-white"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="+994 XX XXX XX XX"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-kael-brown mb-2">
                    Şifrə
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kael-gray" />
                    <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all bg-white"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-kael-brown mb-2">
                    Şifrəni təsdiqlə
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kael-gray" />
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all bg-white"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kael-gold hover:bg-kael-brown text-white rounded-xl h-12 text-base font-medium"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Qeydiyyat olunur...
                    </>
                ) : (
                    'Qeydiyyatdan keç'
                )}
            </Button>
        </form>
    );
}
