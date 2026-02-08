import { createAdminClient } from '@/lib/supabase/admin';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Users, ShoppingBag } from 'lucide-react';

export default async function AdminCustomersPage() {
    const supabase = await createAdminClient();

    // Fetch users with role 'customer'
    // Note: In a real app we would join with orders to get count, 
    // but simplified here we just fetch profiles
    const { data: customersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    // Removed .eq('role', 'customer') as profiles table might not have role column or we want all users

    const customers = customersData as any[] || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Müştərilər</h1>
                    <p className="text-gray-500">Müştəri bazası</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Müştəri</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Qeydiyyat Tarixi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!customers || customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Müştəri tapılmadı
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{customer.full_name || 'Adsız'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone || '-'}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(customer.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
