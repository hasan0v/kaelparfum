'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateSiteSettings } from '@/lib/actions/settings';
import { SiteSetting } from '@/types/database';

interface SettingsFormProps {
    initialSettings: SiteSetting[];
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Map settings to state for easy access
    const getSetting = (key: string) => initialSettings.find(s => s.key === key)?.value || '';

    const [formValues, setFormValues] = useState({
        store_name: getSetting('store_name') || 'KƏEL Parfüm',
        support_email: getSetting('support_email') || 'info@kael.az',
        support_phone: getSetting('support_phone') || '+994 50 000 00 00',
        shipping_cost: getSetting('shipping_cost') || '5',
        free_shipping_limit: getSetting('free_shipping_limit') || '50',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormValues(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const settingsToUpdate = Object.entries(formValues).map(([key, value]) => ({
                key,
                value: String(value)
            }));

            const result = await updateSiteSettings(settingsToUpdate);

            if (result.success) {
                toast.success('Parametrlər uğurla yadda saxlanıldı');
            } else {
                toast.error(result.error || 'Xəta baş verdi');
            }
        } catch (error) {
            toast.error('Gözlənilməz xəta baş verdi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ümumi Məlumatlar</CardTitle>
                    <CardDescription>Mağaza adı, əlaqə və sosial media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="store_name">Mağaza Adı</Label>
                        <Input
                            id="store_name"
                            value={formValues.store_name}
                            onChange={handleChange}
                            placeholder="KƏEL Parfüm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="support_email">Dəstək Email</Label>
                        <Input
                            id="support_email"
                            value={formValues.support_email}
                            onChange={handleChange}
                            placeholder="info@kael.az"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="support_phone">Telefon</Label>
                        <Input
                            id="support_phone"
                            value={formValues.support_phone}
                            onChange={handleChange}
                            placeholder="+994 50 000 00 00"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Çatdırılma</CardTitle>
                    <CardDescription>Çatdırılma qiymətləri və limitlər</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="shipping_cost">Standart Çatdırılma (AZN)</Label>
                        <Input
                            id="shipping_cost"
                            type="number"
                            value={formValues.shipping_cost}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="free_shipping_limit">Pulsuz Çatdırılma Limiti (AZN)</Label>
                        <Input
                            id="free_shipping_limit"
                            type="number"
                            value={formValues.free_shipping_limit}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2 flex justify-end">
                <Button
                    type="submit"
                    className="bg-kael-gold hover:bg-kael-brown text-white"
                    disabled={isLoading}
                >
                    {isLoading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
                </Button>
            </div>
        </form>
    );
}
