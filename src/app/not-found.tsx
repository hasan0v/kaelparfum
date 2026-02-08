import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-kael-cream/50">
            <div className="container py-16">
                <div className="max-w-md mx-auto text-center">
                    {/* 404 Illustration */}
                    <div className="relative mb-8">
                        <span className="text-9xl font-heading font-bold text-kael-gold/20">
                            404
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-kael-cream flex items-center justify-center">
                                <Search className="w-12 h-12 text-kael-gray" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-kael-brown mb-4">
                        Səhifə tapılmadı
                    </h1>
                    <p className="text-kael-gray mb-8">
                        Axtardığınız səhifə mövcud deyil və ya köçürülmüş ola bilər.
                        Ünvanı yoxlayın və ya aşağıdakı bağlantılardan istifadə edin.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            className="bg-kael-gold hover:bg-kael-brown text-white rounded-full px-6"
                            asChild
                        >
                            <Link href={ROUTES.home}>
                                <Home className="w-4 h-4 mr-2" />
                                Ana səhifəyə qayıt
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-kael-brown text-kael-brown hover:bg-kael-cream rounded-full px-6"
                            asChild
                        >
                            <Link href={ROUTES.products}>
                                Məhsullara bax
                            </Link>
                        </Button>
                    </div>

                    {/* Search Suggestion */}
                    <div className="mt-12">
                        <p className="text-sm text-kael-gray mb-4">
                            Və ya axtarış edin:
                        </p>
                        <div className="relative max-w-sm mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kael-gray" />
                            <input
                                type="text"
                                placeholder="Məhsul axtar..."
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-kael-light-gray focus:border-kael-gold focus:ring-2 focus:ring-kael-gold/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
