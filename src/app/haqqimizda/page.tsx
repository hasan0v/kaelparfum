import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, CreditCard, Truck, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants/config';

export const metadata: Metadata = {
    title: 'Haqqımızda',
    description: 'KƏEL PARFÜM - Azərbaycanda premium parfüm və kosmetika məhsulları. Bizim haqqımızda ətraflı məlumat.',
};

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-kael-cream via-kael-peach/30 to-kael-cream py-16 md:py-24">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-kael-brown mb-6">
                            Haqqımızda
                        </h1>
                        <p className="text-lg text-kael-gray leading-relaxed">
                            KƏEL PARFÜM olaraq, keyfiyyətli və orijinal parfüm məhsullarını
                            Azərbaycan müştərilərinə ən sərfəli qiymətlərlə təqdim edirik.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-kael-gold/10 text-kael-brown rounded-full text-sm font-medium mb-6">
                                Bizim hekayəmiz
                            </span>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-6">
                                Premium parfümlərin ünvanı
                            </h2>
                            <div className="space-y-4 text-kael-gray leading-relaxed">
                                <p>
                                    KƏEL PARFÜM Qəbələ şəhərində fəaliyyətə başlamış və qısa müddətdə
                                    Azərbaycanın ən etibarlı parfüm mağazalarından birinə çevrilmişdir.
                                </p>
                                <p>
                                    Məqsədimiz müştərilərimizə dünyanın ən məşhur brend ətirlərini
                                    orijinal keyfiyyətdə və əlverişli qiymətlərlə təqdim etməkdir.
                                    Hər bir məhsulumuz diqqətlə seçilir və müştərilərimizin məmnuniyyəti
                                    üçün ən yüksək standartlara cavab verir.
                                </p>
                                <p>
                                    Kredit imkanı, sürətli çatdırılma və mükəmməl müştəri xidməti ilə
                                    alış-veriş təcrübənizi xüsusi edirik.
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-kael-cream">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3/4 h-3/4 bg-gradient-to-br from-kael-gold/20 to-kael-rose/10 rounded-full flex items-center justify-center">
                                    <span className="font-heading text-6xl text-kael-gold">KƏEL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 md:py-24 bg-kael-cream/50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-4">
                            Niyə bizi seçməlisiniz?
                        </h2>
                        <p className="text-kael-gray max-w-2xl mx-auto">
                            Müştərilərimizin etibarını qazanmağımızın əsas səbəbləri
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl text-center">
                            <div className="w-16 h-16 rounded-full bg-kael-gold/10 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-kael-gold" />
                            </div>
                            <h3 className="font-heading font-semibold text-kael-brown mb-2">
                                100% Orijinal
                            </h3>
                            <p className="text-sm text-kael-gray">
                                Bütün məhsullarımız orijinaldır və keyfiyyət zəmanəti verilir
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl text-center">
                            <div className="w-16 h-16 rounded-full bg-kael-gold/10 flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-kael-gold" />
                            </div>
                            <h3 className="font-heading font-semibold text-kael-brown mb-2">
                                Kredit İmkanı
                            </h3>
                            <p className="text-sm text-kael-gray">
                                Tək şəxsiyyət vəsiqəsi ilə 3-12 ay faizsiz kredit
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl text-center">
                            <div className="w-16 h-16 rounded-full bg-kael-gold/10 flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-kael-gold" />
                            </div>
                            <h3 className="font-heading font-semibold text-kael-brown mb-2">
                                Sürətli Çatdırılma
                            </h3>
                            <p className="text-sm text-kael-gray">
                                50₼+ sifarişlərə pulsuz, 2-3 iş günü ərzində çatdırılma
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl text-center">
                            <div className="w-16 h-16 rounded-full bg-kael-gold/10 flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-kael-gold" />
                            </div>
                            <h3 className="font-heading font-semibold text-kael-brown mb-2">
                                Brend Ətirlər
                            </h3>
                            <p className="text-sm text-kael-gray">
                                Dünyanın ən məşhur parfüm brendləri bir yerdə
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-kael-brown mb-8">
                                Bizimlə əlaqə
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-kael-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-kael-brown mb-1">Ünvan</h3>
                                        <p className="text-kael-gray">{CONTACT_INFO.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-kael-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-kael-brown mb-1">Telefon</h3>
                                        {CONTACT_INFO.phones.map((phone, idx) => (
                                            <a
                                                key={idx}
                                                href={`tel:${phone.replace(/\s/g, '')}`}
                                                className="block text-kael-gray hover:text-kael-gold transition-colors"
                                            >
                                                {phone}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-kael-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-kael-brown mb-1">E-poçt</h3>
                                        <a
                                            href={`mailto:${CONTACT_INFO.email}`}
                                            className="text-kael-gray hover:text-kael-gold transition-colors"
                                        >
                                            {CONTACT_INFO.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-kael-cream flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-kael-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-kael-brown mb-1">İş saatları</h3>
                                        <p className="text-kael-gray">{CONTACT_INFO.hours}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 flex items-center gap-4">
                                <a
                                    href={SOCIAL_LINKS.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a
                                    href={SOCIAL_LINKS.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="relative aspect-square lg:aspect-auto rounded-2xl overflow-hidden bg-kael-cream">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-16 h-16 text-kael-gold mx-auto mb-4" />
                                    <p className="text-kael-gray">Qəbələ, Azərbaycan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-kael-brown text-white">
                <div className="container text-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                        İndi alış-verişə başlayın
                    </h2>
                    <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                        Dünyanın ən məşhur brend ətirlərini kəşf edin və özünüzə xüsusi hiss etdirin
                    </p>
                    <Button
                        size="lg"
                        className="bg-kael-gold hover:bg-white hover:text-kael-brown text-white rounded-full px-8 h-14"
                        asChild
                    >
                        <Link href={ROUTES.products}>
                            Kolleksiyaya bax
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
