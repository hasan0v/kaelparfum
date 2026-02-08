'use client';

import { usePathname } from 'next/navigation';

interface AdminAwareFooterProps {
    children: React.ReactNode;
}

export default function AdminAwareFooter({ children }: AdminAwareFooterProps) {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return <>{children}</>;
}
