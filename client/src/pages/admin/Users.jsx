import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Shield, ShieldOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, updateUser, deleteUser } from '../../services/api';

const Users = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleActive = async (id) => {
        const user = users.find((u) => u._id === id);
        try {
            await updateUser(id, { isActive: !user.isActive });
            setUsers(users.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)));
            toast.success('User status updated');
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const changeRole = async (id, role) => {
        try {
            await updateUser(id, { role });
            setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
            toast.success('User role updated');
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
            try {
                await deleteUser(id);
                setUsers(users.filter((u) => u._id !== id));
                toast.success('User deleted');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const roleColors = {
        admin: 'bg-purple-100 text-purple-800',
        editor: 'bg-blue-100 text-blue-800',
        user: 'bg-gray-100 text-gray-800',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('admin.users')}</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Joined</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {user.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user._id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${roleColors[user.role]}`}
                                            >
                                                <option value="user">User</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleActive(user._id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                    title={user.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {user.isActive ? (
                                                        <ShieldOff className="w-4 h-4 text-orange-600" />
                                                    ) : (
                                                        <Shield className="w-4 h-4 text-green-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('common.noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
