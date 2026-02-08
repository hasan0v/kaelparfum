'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-kael-error hover:bg-kael-error/10 transition-colors w-full text-left"
        >
            <LogOut className="h-5 w-5" />
            Çıxış
        </button>
    );
}
