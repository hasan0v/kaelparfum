import { getSiteSettings } from '@/lib/actions/settings';
import SettingsForm from './SettingsForm';

export default async function AdminSettingsPage() {
    const { settings } = await getSiteSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Parametrlər</h1>
                <p className="text-gray-500">Mağaza tənzimləmələri</p>
            </div>

            <SettingsForm initialSettings={settings || []} />
        </div>
    );
}
