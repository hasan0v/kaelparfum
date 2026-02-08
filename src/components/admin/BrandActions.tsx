'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ROUTES } from '@/lib/constants/routes';
import { deleteBrand } from '@/lib/actions/brands';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BrandActionsProps {
    brandId: string;
}

export default function BrandActions({ brandId }: BrandActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteBrand(brandId);
            if (result.success) {
                toast.success('Brend silindi');
                setIsAlertOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || 'Xəta baş verdi');
                // Don't close alert on error so user can retry or read functionality
                // Actually, maybe close it if it's a permanent blocking error?
                // For now, keep it open or close it? If it fails because of products, user needs to know.
                // The toast shows the error. I'll close the dialog to avoid stuck state if they can't fix it here.
                setIsAlertOpen(false);
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            toast.error('Xəta baş verdi');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isDeleting}>
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreVertical className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`${ROUTES.admin.brands}/${brandId}`} className="flex items-center gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Redaktə et
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setIsAlertOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bu brendi silmək istədiyinizə əminsiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu əməliyyat geri qaytarıla bilməz. Əgər bu brendə aid məhsullar varsa, silinmə uğursuz olacaq.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Ləğv et</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Silinir...
                                </>
                            ) : (
                                'Sil'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
