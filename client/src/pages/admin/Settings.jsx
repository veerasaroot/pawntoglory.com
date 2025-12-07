import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, User, Globe, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
    });

    const [siteSettings, setSiteSettings] = useState({
        siteName: 'Pawn to Glory',
        siteDescription: 'Your premier chess news destination',
        language: i18n.language,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        toast.success('Profile updated');
    };

    const handleSiteSubmit = (e) => {
        e.preventDefault();
        i18n.changeLanguage(siteSettings.language);
        toast.success('Settings saved');
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.settings')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="input resize-none" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <Save className="w-4 h-4" />
                            Save Profile
                        </button>
                    </form>
                </div>

                {/* Site Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Site Settings</h2>
                    </div>

                    <form onSubmit={handleSiteSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                            <input type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea value={siteSettings.siteDescription} onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })} rows={2} className="input resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                            <select value={siteSettings.language} onChange={(e) => setSiteSettings({ ...siteSettings, language: e.target.value })} className="input">
                                <option value="en">English</option>
                                <option value="th">ไทย</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <Save className="w-4 h-4" />
                            Save Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
