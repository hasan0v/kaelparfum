'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/actions/auth';

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn(formData);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            // Redirect happened, which is expected
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-4 bg-kael-error/10 border border-kael-error/20 rounded-xl text-kael-error text-sm">
                    {error}
                </div>
            )}

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

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kael-gold hover:bg-kael-brown text-white rounded-xl h-12 text-base font-medium"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Daxil olunur...
                    </>
                ) : (
                    'Daxil ol'
                )}
            </Button>
        </form>
    );
}
