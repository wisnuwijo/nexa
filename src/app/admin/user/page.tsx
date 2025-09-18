"use client";

import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/app/components/admin_layout';
import { getAllUserList, User, updateUserPasswordAdmin } from '@/api/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { KeyIcon } from '@heroicons/react/24/solid';

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // 0.5 seconds debounce
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchQuery]);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            try {
                const userList = await getAllUserList({ email: debouncedSearchQuery || undefined });
                setUsers(userList);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Gagal memuat daftar pengguna.';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [debouncedSearchQuery]);

    const openPasswordModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setPassword('');
        setConfirmPassword('');
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        if (password !== confirmPassword) {
            toast.error("Password dan konfirmasi password tidak cocok.");
            return;
        }
        if (password.length < 8) {
            toast.error("Password minimal harus 8 karakter.");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUserPasswordAdmin({
                id: selectedUser.id,
                password: password
            });
            toast.success(`Password untuk ${selectedUser.name} berhasil diperbarui.`);
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memperbarui password.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} />
            <AdminLayout appBarTitle='Pengguna' showNavBar={false}>
                <div className="mx-auto pt-20 max-w-[430px] md:max-w-full px-4 pb-24">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Daftar Pengguna</h2>

                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Cari pengguna berdasarkan email..."
                            className="w-full py-3.5 px-12 bg-white rounded-2xl shadow-sm text-base text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Memuat pengguna...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow">
                            <ul className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <li key={user.id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <p className="text-xs text-purple-600 font-semibold mt-1">{user.nama_level}</p>
                                        </div>
                                        <button
                                            onClick={() => openPasswordModal(user)}
                                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                                        >
                                            <KeyIcon className="w-4 h-4" />
                                            Ubah Password
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
                        <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Ubah Password untuk {selectedUser.name}</h2>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-300"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}