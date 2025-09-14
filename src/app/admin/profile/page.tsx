"use client";

import { User } from '@/api/auth';
import AdminLayout from '@/app/components/admin_layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
    const router = useRouter();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

    // Mock user data
    const [user] = useState(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    return JSON.parse(storedUser) as User;
                } catch {
                    // fallback to default if parsing fails
                }
            }
        }
        
        // Default user data if no user is stored
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

    const handleLogout = () => {
        setIsFinishModalOpen(false);

        // Clear only the 'token' cookie
        if (typeof document !== "undefined") {
            document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        localStorage.clear()

        router.push('/login');
    };

    const optionModal = <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsFinishModalOpen(false)}>
        <div
            className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <div className="space-y-4">
                <h1 className="text-lg font-medium text-gray-900">Konfirmasi</h1>
                <p className="text-sm text-gray-500">Apakah Anda yakin ingin keluar?</p>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <button
                            onClick={handleLogout}
                            className="bg-purple-600 w-full text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Ya</span>
                            </div>
                        </button>
                    </div>
                    <div className="w-1/2">
                        <button
                            onClick={() => setIsFinishModalOpen(false)}
                            className="bg-gray-100 w-full text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-200 transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Tidak</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    function formatIndoDate(created_at: string): string {
        if (!created_at) return "";
        const date = new Date(created_at);
        const months = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
            "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <AdminLayout appBarTitle='Profil' showNavBar={true}>
            <div className="mx-auto pt-10 max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow mb-4">
                    <div className="bg-purple-600 p-4 text-center">
                        <div className="flex justify-center pt-5">
                            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-1 border-white shadow-md bg-gray-200 flex items-center justify-center">
                                <img
                                    src="/images/profile.jpg"
                                    alt="Profile Picture"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-white">{user.name}</h2>
                        <p className="text-blue-100 text-sm">Administrator</p>
                    </div>

                    <div className="p-4 space-y-3">
                        <ProfileDetail label="Email" value={user.email} />
                        <ProfileDetail label="Username" value={user.username} />
                        <ProfileDetail label="Tanggal Bergabung" value={formatIndoDate(user.created_at)} />
                    </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="bg-white rounded-lg shadow mt-5 flex justify-center">
                    <div className="bg-white p-4 w-full flex justify-between">
                        <button
                            onClick={() => setShowAboutModal(true)}
                            className="text-gray-600 text-sm flex items-center"
                        >
                            ℹ️ Tentang
                        </button>
                        <button
                            onClick={() => setIsFinishModalOpen(true)}
                            className="text-red-600 text-sm flex items-center"
                        >
                            🔓 Keluar
                        </button>
                    </div>
                </div>

                {/* About App Modal */}
                {showAboutModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 mx-4 w-full max-w-xs">
                            <h2 className="text-lg text-gray-500 font-bold mb-2">Tentang Aplikasi</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Aplikasi NEXA v1.0.0
                                <br />
                                © 2025 PT Tan Anugerah Sejahtera
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowAboutModal(false)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={isFinishModalOpen ? "block" : "hidden"}>
                    {optionModal}
                </div>

            </div>
        </AdminLayout>
    );
}

// Components
function ProfileDetail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-600">{label}</p>
            <p className="text-sm text-gray-400 font-medium">{value}</p>
        </div>
    );
}