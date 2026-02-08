# 🌸 KƏEL PARFÜM - E-Ticarət Platforması

Azərbaycanda fəaliyyət göstərən premium ətir və kosmetika mağazası KƏEL PARFÜM üçün müasir, tam funksiyalı e-ticarət platforması. Next.js 16, TypeScript və Supabase ilə hazırlanmışdır.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.90-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 📋 Məzmun

- [Xüsusiyyətlər](#-xüsusiyyətlər)
- [Texnologiya Yığını](#-texnologiya-yığını)
- [Layihə Strukturu](#-layihə-strukturu)
- [Başlanğıc](#-başlanğıc)
- [Mühit Dəyişənləri](#-mühit-dəyişənləri)
- [Verilənlər Bazasının Qurulması](#-verilənlər-bazasının-qurulması)
- [Skriptlər](#-skriptlər)
- [Yerləşdirmə](#-yerləşdirmə)
- [Töhfə](#-töhfə)

## ✨ Xüsusiyyətlər

### İstifadəçi Xüsusiyyətləri
- 🛍️ **Məhsul Kataloqu** - Kateqoriya və brendlərə görə məhsulları axtarış və filterləmə
- 🔍 **Tam Mətn Axtarışı** - PostgreSQL ilə sürətli məhsul axtarışı
- 🛒 **Alış-veriş Səbəti** - Zustand ilə davamlı səbət idarəetməsi
- ❤️ **Sevimlilər** - Məhsulları sevimli kimi saxlama
- 👤 **İstifadəçi Autentifikasiyası** - Supabase Auth ilə təhlükəsiz qeydiyyat/giriş
- 📦 **Sifariş İdarəetməsi** - Sifariş yerləşdirmə, izləmə və tarixçə
- ⭐ **Məhsul Rəyləri** - Məhsullara qiymət və rəy yazma (təsdiqlənmiş alış nişanı)
- 💬 **WhatsApp İnteqrasiyası** - Sifarişlər üçün birbaşa WhatsApp əlaqəsi
- 📱 **Responsiv Dizayn** - Mobil, planşet və masaüstü üçün optimallaşdırılmış
- 🌙 **Qaranlıq Rejim** - next-themes ilə tema dəyişdirmə
- 🎨 **Müasir İnterfeys** - Radix UI və Tailwind CSS ilə gözəl interfeys

### Admin Xüsusiyyətləri
- 📊 **Admin Paneli** - Mağaza idarəetməsi üçün əhatəli admin paneli
- 📦 **Məhsul İdarəetməsi** - Variantları olan məhsullar üçün CRUD əməliyyatları
- 🏷️ **Kateqoriya İdarəetməsi** - Iç-içə kateqoriyalarla məhsulları təşkil etmə
- 🏢 **Brend İdarəetməsi** - Məhsul brendlərini idarə etmə
- 🚚 **Sifariş Emalı** - Müştəri sifarişlərini baxma, yeniləmə və idarə etmə
- 📝 **Rəy Moderasiyası** - Müştəri rəylərini təsdiqləmə/rədd etmə
- 👥 **İstifadəçi İdarəetməsi** - Qeydiyyatdan keçmiş istifadəçiləri baxma və idarə etmə
- ⚙️ **Sayt Parametrləri** - Çatdırılma haqqı, WhatsApp nömrəsi və s. konfiqurasiya
- 📸 **Şəkil Yükləmə** - Supabase Storage-a birbaşa drag-and-drop ilə yükləmə
- 🔐 **Rol Əsaslı Giriş** - Middleware ilə qorunan admin marşrutları

### Texniki Xüsusiyyətlər
- ⚡ **Server Actions** - Next.js Server Actions ilə müasir data fetching
- 🔄 **React Query** - Effektiv data keşləmə və sinxronizasiya
- 🎯 **Type-Safe** - Supabase tipləri ilə tam TypeScript dəstəyi
- 🛡️ **Row Level Security** - Supabase RLS ilə təhlükəsiz verilənlər bazası girişi
- 📈 **SEO Optimallaşdırılmış** - Meta teqlər, strukturlaşdırılmış data və dinamik sitemap
- 🎬 **Animasiyalar** - Framer Motion ilə hamar animasiyalar
- 📊 **Analitika Hazır** - Baxış sayının izlənməsi və məhsul analitikası
- 🔔 **Bildiriş Sistemı** - Sonner ilə istifadəçi geri bildirimi

## 🛠️ Texnologiya Yığını

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Dil:** [TypeScript 5](https://www.typescriptlang.org/)
- **Üslublandırma:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Komponentlər:** [Radix UI](https://www.radix-ui.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **State İdarəetməsi:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **Formlar:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animasiyalar:** [Framer Motion](https://www.framer.com/motion/)
- **Karusellər:** [Embla Carousel](https://www.embla-carousel.com/)
- **Fayl Yükləmə:** [React Dropzone](https://react-dropzone.js.org/)

### Backend
- **Verilənlər Bazası:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Autentifikasiya:** Supabase Auth
- **Saxlama:** Supabase Storage
- **Şəkil Optimallaşdırma:** [Sharp](https://sharp.pixelplumbing.com/)

### Development Alətləri
- **Paket Meneceri:** npm
- **Linting:** ESLint
- **Kod Keyfiyyəti:** TypeScript Strict Mode

## 📁 Layihə Strukturu

```
kaelparfum/
├── src/
│   ├── app/                      # Next.js App Router səhifələri
│   │   ├── (public)/            # İctimai marşrutlar
│   │   │   ├── brendler/        # Brendlərin siyahısı və təfərrüatı
│   │   │   ├── kateqoriyalar/   # Kateqoriyaların siyahısı və təfərrüatı
│   │   │   ├── mehsullar/       # Məhsulların siyahısı və təfərrüatı
│   │   │   ├── haqqimizda/      # Haqqımızda səhifəsi
│   │   │   └── giris/           # Giriş səhifəsi
│   │   ├── admin/               # Admin paneli (qorunan)
│   │   │   ├── brendler/        # Brend idarəetməsi
│   │   │   ├── kateqoriyalar/   # Kateqoriya idarəetməsi
│   │   │   ├── mehsullar/       # Məhsul idarəetməsi
│   │   │   ├── sifarisler/      # Sifariş idarəetməsi
│   │   │   ├── serhler/         # Rəy moderasiyası
│   │   │   ├── istifadeciler/   # İstifadəçi idarəetməsi
│   │   │   └── parametrler/     # Sayt parametrləri
│   │   ├── hesabim/             # İstifadəçi hesabı səhifələri
│   │   │   ├── sifarisler/      # Sifariş tarixçəsi
│   │   │   └── sevimliler/      # Sevimlilər
│   │   ├── sebet/               # Alış-veriş səbəti
│   │   ├── sifaris/             # Ödəniş
│   │   └── api/                 # API marşrutları
│   ├── components/              # React komponentlər
│   │   ├── admin/               # Admin-spesifik komponentlər
│   │   ├── cart/                # Səbət komponentləri
│   │   ├── layout/              # Layout komponentləri
│   │   ├── product/             # Məhsul komponentləri
│   │   └── ui/                  # Təkrar istifadə olunan UI komponentləri (shadcn/ui)
│   ├── lib/                     # Yardımçı və kitabxanalar
│   │   ├── actions/             # Server Actions
│   │   ├── constants/           # Konfiqurasiya sabitləri
│   │   ├── hooks/               # Xüsusi React hooks
│   │   ├── supabase/            # Supabase müştəriləri
│   │   └── utils/               # Yardımçı funksiyalar
│   ├── types/                   # TypeScript tip tərifləri
│   └── middleware.ts            # Next.js middleware (auth və admin qoruması)
├── supabase/                    # Verilənlər bazası sxemi
│   ├── schema.sql               # Verilənlər bazası sxemi
│   ├── seed.sql                 # Başlanğıc data
│   └── storage.sql              # Saxlama konfiqurasiyası
└── public/                      # Statik aktivlər
```

## 🚀 Başlanğıc

### Tələblər

- **Node.js** 20.x və ya daha yüksək
- **npm** 9.x və ya daha yüksək
- **Supabase hesabı** ([supabase.com](https://supabase.com) saytında pulsuz tier mövcuddur)

### Quraşdırma

1. **Repozitoriyanı klonlayın**
   ```bash
   git clone https://github.com/yourusername/kaelparfum.git
   cd kaelparfum
   ```

2. **Asılılıqları quraşdırın**
   ```bash
   npm install
   ```

3. **Mühit dəyişənlərini qurun**
   
   Kök qovluqda `.env.local` faylı yaradın:
   ```bash
   cp .env.example .env.local
   ```
   
   Supabase məlumatlarınızı doldurun (bax [Mühit Dəyişənləri](#-mühit-dəyişənləri))

4. **Verilənlər bazasını qurun**
   
   SQL fayllarını Supabase SQL Editor-da bu ardıcıllıqla işlədin:
   ```bash
   1. supabase/schema.sql
   2. supabase/storage.sql
   3. supabase/seed.sql (ixtiyari)
   ```

5. **Development serverini işə salın**
   ```bash
   npm run dev
   ```

6. **Brauzeri açın**
   
   [http://localhost:3000](http://localhost:3000) ünvanına gedin

## 🔐 Mühit Dəyişənləri

Aşağıdakı dəyişənlərlə `.env.local` faylı yaradın:

```env
# Supabase Konfiqurasiyası
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sayt Konfiqurasiyası (İxtiyari - config.ts-də default var)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=994709717477
NEXT_PUBLIC_DELIVERY_FEE=5
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=50
```

### Supabase Məlumatlarını Əldə Etmək

1. [supabase.com](https://supabase.com) saytında layihə yaradın
2. **Project Settings** → **API** bölməsinə gedin
3. **Project URL** və **anon/public key** kopyalayın

## 💾 Verilənlər Bazasının Qurulması

### Sxemə Ümumi Baxış

Verilənlər bazası aşağıdakı əsas cədvəlləri ehtiva edir:

- **categories** - Məhsul kateqoriyaları (parent_id ilə iyerarxik)
- **brands** - Məhsul brendləri
- **products** - Tam mətn axtarışı ilə əsas məhsullar cədvəli
- **product_images** - Məhsul şəkil qalereyası
- **product_variants** - Məhsul variantları (ölçülər, növlər və s.)
- **profiles** - İstifadəçi profilləri (auth.users-i genişləndirir)
- **addresses** - İstifadəçi çatdırılma ünvanları
- **orders** - Müştəri sifarişləri
- **order_items** - Sifariş sətir elementləri
- **reviews** - Məhsul rəyləri və reytinqlər
- **wishlists** - İstifadəçi sevimliləri
- **site_settings** - Tənzimlənən sayt parametrləri

### Əsas Xüsusiyyətlər

- **Row Level Security (RLS)** - Bütün cədvəllərdə RLS siyasətləri var
- **Tam Mətn Axtarışı** - Məhsullarda `search_vector` sütunu var
- **Avtomatik Sifariş Nömrələri** - Format: `KP20260208001`
- **Triggerlər** - `updated_at` timestamp-lərini avtomatik yeniləyir
- **Funksiyalar** - Stok statusu, endirim hesablamaları və s.

### Miqrasiyaların İşə Salınması

SQL fayllarını Supabase panelində icra edin:

1. Supabase panelində **SQL Editor** açın
2. Yeni sorğu yaradın
3. `supabase/schema.sql` faylının məzmununu kopyalayın
4. **Run** düyməsini basın
5. `storage.sql` və `seed.sql` üçün təkrarlayın

### Saxlama Bucketləri

Aşağıdakı saxlama bucketlərinə ehtiyac var:

- `products` - Məhsul şəkilləri
- `categories` - Kateqoriya şəkilləri
- `brands` - Brend loqoları

Bunları Supabase Storage bölməsində konfiqurasiya edin və ya `storage.sql` işlədin.

## 📜 Skriptlər

```bash
# Development
npm run dev          # Development serverini başlat (http://localhost:3000)

# Production
npm run build        # Production üçün build et
npm run start        # Production serverini başlat

# Kod Keyfiyyəti
npm run lint         # ESLint işlət
```

## 🌍 Yerləşdirmə

### Vercel-ə Yerləşdirmə (Tövsiyə olunur)

1. **Kodunuzu GitHub-a göndərin**

2. **Vercel-ə import edin**
   - [vercel.com](https://vercel.com) saytına gedin
   - Repozitoriyanızı import edin
   - Mühit dəyişənlərini əlavə edin
   - Deploy edin

3. **Vercel-də mühit dəyişənlərini əlavə edin**
   - **Settings** → **Environment Variables** bölməsinə gedin
   - `.env.local` faylındakı bütün dəyişənləri əlavə edin

### Digər Platformalara Yerləşdirmə

Bu Next.js tətbiqi aşağıdakı platformalara yerləşdirilə bilər:
- Vercel (tövsiyə olunur)
- Netlify
- Railway
- Render
- İstənilən Node.js hosting platforması

## 🧑‍💼 Admin Girişi

Admin istifadəçi yaratmaq üçün:

1. Sayt vasitəsilə hesab yaradın
2. Supabase panelinə gedin
3. **Authentication** → **Users** bölməsinə keçin
4. Siyahıda öz istifadəçinizi tapın
5. **Table Editor** → **profiles** bölməsinə gedin
6. Profil sətrinizi tapın
7. `role` sütunu əlavə edin və `'admin'` dəyərini verin (və ya sxemə role sütunu əlavə edin)

**Qeyd:** `profiles` cədvəlinə `role` sütunu əlavə etməli ola bilərsiniz:

```sql
ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

## 🤝 Töhfə

Töhfələr xoş qarşılanır! Zəhmət olmasa bu addımları izləyin:

1. Repozitoriyanı fork edin
2. Xüsusiyyət branch yaradın (`git checkout -b feature/amazing-feature`)
3. Dəyişikliklərinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch-ı push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisenziya

Bu layihə məxfi və şəxsidir. Bütün hüquqlar qorunur.

## 📞 Əlaqə

**KƏEL PARFÜM**
- 📱 Telefon: +994 070 971 74 77 / +994 051 572 73 78
- 📧 Email: info@kaelparfum.com
- 📍 Ünvan: Qəbələ, Azərbaycan
- 📷 Instagram: [@kaelparfum](https://www.instagram.com/kaelparfum/)

## 🙏 Təşəkkürlər

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Açıq Mənbəli Firebase Alternativ
- [shadcn/ui](https://ui.shadcn.com/) - Gözəl dizayn edilmiş komponentlər
- [Vercel](https://vercel.com/) - Yerləşdirmə platforması

---

KƏEL PARFÜM üçün ❤️ ilə hazırlanmışdır
