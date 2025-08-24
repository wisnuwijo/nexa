"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/api/auth';
import MainLayout from '@/app/components/main_layout';

export default function EditProfilePage() {
    const router = useRouter();
    // Mock user data (replace with real fetch if available)
    const [user, setUser] = useState<User>(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    return JSON.parse(storedUser) as User;
                } catch {}
            }
        }
        return {
            id: 0,
            name: "",
            username: "",
            email: "",
            email_verified_at: null,
            code_verifikasi: null,
            akun_aktif: 1,
            id_level: 1,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
            deleted_at: null,
            image: null,
            created_by: null,
            updated_by: null,
            gender: "male",
            kode_customer: "",
        } as User;
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save user changes (API call)
        // Optionally validate password
        router.back();
    };

    return (
        <MainLayout appBarTitle='Edit Profil' showNavBar={true}>
            <div className="mx-auto pt-10 max-w-[430px] md:max-w-full px-4 pb-24">
                <form className="bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Edit Profil</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Nama</label>
                            <input type="text" name="name" value={user.name} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Username</label>
                            <input type="text" name="username" value={user.username} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Email</label>
                            <input type="email" name="email" value={user.email} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Telepon</label>
                            <input type="tel" name="telepon" value={""} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Gender</label>
                            <select name="gender" value={user.gender} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <button type="button" className="w-full bg-gray-100 text-purple-600 py-2 rounded-lg text-sm mb-2" onClick={() => setShowPasswordSection(v => !v)}>
                            {showPasswordSection ? "Tutup Ubah Password" : "Ubah Password"}
                        </button>
                        {showPasswordSection && (
                            <div className="space-y-4 mt-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Password Baru</label>
                                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Konfirmasi Password</label>
                                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
