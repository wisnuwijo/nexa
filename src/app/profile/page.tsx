"use client";

import { User } from "@/api/auth";
import { getLastInspectionsByUser, LastInspectionItem } from "@/api/inspection";
import { getBrokenExtinguisherCount, getBrokenExtinguisherList, BrokenExtinguisher, getInspectedExtinguisherCount, getInspectionStats, InspectionStats } from "@/api/extinguisher";
import { useEffect, useState } from "react";
import MainLayout from "../components/main_layout";
import Link from "next/link";
import { EnvelopeIcon, UsersIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [brokenCount, setBrokenCount] = useState<number | null>(null);
    const [brokenCountError, setBrokenCountError] = useState<string | null>(null);
    const [inspectedCount, setInspectedCount] = useState<number | null>(null);
    const [inspectedCountError, setInspectedCountError] = useState<string | null>(null);
    const [inspectionStats, setInspectionStats] = useState<InspectionStats | null>(null);
    const [inspectionStatsError, setInspectionStatsError] = useState<string | null>(null);
    const [recentInspections, setRecentInspections] = useState<LastInspectionItem[]>([]);
    const [recentInspectionsLoading, setRecentInspectionsLoading] = useState(true);
    const [recentInspectionsError, setRecentInspectionsError] = useState<string | null>(null);

    // Modal for broken extinguishers
    const [showBrokenModal, setShowBrokenModal] = useState(false);
    const [brokenList, setBrokenList] = useState<BrokenExtinguisher[] | null>(null);
    const [brokenListLoading, setBrokenListLoading] = useState(false);
    const [brokenListError, setBrokenListError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        getBrokenExtinguisherCount()
            .then(count => { if (mounted) setBrokenCount(count); })
            .catch(err => { if (mounted) setBrokenCountError('Gagal memuat data, error: ' + err.message); });
        
        getInspectedExtinguisherCount()
            .then(count => { if (mounted) setInspectedCount(count); })
            .catch(err => { if (mounted) setInspectedCountError('Gagal memuat data, error: ' + err.message); });

        getInspectionStats()
            .then(stats => { if (mounted) setInspectionStats(stats); })
            .catch(err => { if (mounted) setInspectionStatsError('Gagal memuat data, error: ' + err.message); });

        setRecentInspectionsLoading(true);
        getLastInspectionsByUser()
            .then(inspections => {
                if (mounted) setRecentInspections(inspections);
            })
            .catch(err => {
                if (mounted) setRecentInspectionsError(err instanceof Error ? err.message : 'Gagal memuat riwayat inspeksi');
            })
            .finally(() => {
                if (mounted) setRecentInspectionsLoading(false);
            });

        return () => { mounted = false; };
    }, []);

    const handleShowBrokenModal = () => {
        setShowBrokenModal(true);
        setBrokenList(null);
        setBrokenListError(null);
        setBrokenListLoading(true);
        getBrokenExtinguisherList()
            .then(list => {
                setBrokenList(list);
                setBrokenListLoading(false);
            })
            .catch(err => {
                setBrokenListError(err instanceof Error ? err.message : 'Gagal memuat data');
                setBrokenListLoading(false);
            });
    };

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

    function formatShortDate(dateStr: string): string {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} ${month}`;
    }

    return (
        <MainLayout appBarTitle='Profil' showNavBar={true}>
            <div className="mx-auto pt-10 max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow mb-4">
                    <div className="bg-purple-600 p-4 text-center">
                        <div className="flex justify-center pt-5">
                            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-1 border-white shadow-md bg-gray-200 flex items-center justify-center">
                                <img
                                    src={user.image != null && user.image !== "" ? user.image : "/images/profile.jpg"}
                                    alt="Profile Picture"
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    onClick={() => router.push('/profile/avatar')}
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                    title="Edit Foto Profil"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.789l-4 1 1-4 14.362-14.302z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-white mt-2">{user.name}</h2>
                    </div>

                    <div className="p-4 space-y-3">
                        <ProfileDetail label="Email" value={user.email} />
                        <ProfileDetail label="Username" value={user.username} />
                        <ProfileDetail label="Tanggal Bergabung" value={formatIndoDate(user.created_at)} />

                        <Link href="/profile/edit" className="w-full block bg-purple-600 text-white py-2 rounded-lg text-sm text-center font-medium hover:bg-purple-700 transition-colors">
                            Edit Profil
                        </Link>
                    </div>
                </div>

                {/* Stats - Horizontal Scroll */}
                <div className="flex flex-row overflow-x-auto gap-2 pb-2 no-scrollbar justify-between items-center">
                    <StatCard
                        title="Perlu Tindakan"
                        value={brokenCountError ? '-' : brokenCount === null ? '...' : brokenCount}
                        icon="⚠️"
                        isWarning
                        onClick={handleShowBrokenModal}
                        clickable
                    />
                    <StatCard 
                        title="Total Inspeksi" 
                        value={inspectedCountError ? '-' : inspectedCount === null ? '...' : inspectedCount} 
                        icon="🧯" 
                    />
                    <StatCard 
                        title="Lulus Inspeksi" 
                        value={inspectionStatsError ? '-' : inspectionStats === null ? '...' : `${inspectionStats.percentageNotRusak}%`} 
                        icon="✅" 
                        isGood 
                    />
                {/* Broken Extinguisher Modal */}
                {showBrokenModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowBrokenModal(false)}>
                        <div className="bg-white rounded-lg p-4 mx-4 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowBrokenModal(false)}>&times;</button>
                            <h2 className="text-lg font-bold mb-2 text-gray-800">Daftar APAR Perlu Tindakan ({brokenCount})</h2>
                            {brokenListLoading && <div className="text-gray-500 py-4">Memuat data...</div>}
                            {brokenListError && <div className="text-red-500 py-4">{brokenListError}</div>}
                            {brokenList && brokenList.length === 0 && <div className="text-gray-500 py-4">Tidak ada APAR rusak.</div>}
                            {brokenList && brokenList.length > 0 && (
                                <ul className="divide-y max-h-[400px] overflow-y-auto">
                                    {brokenList.map((item, idx) => (
                                        <li key={item.id} className="py-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold text-gray-800">{idx + 1}. {item.kode_barang} - {item.brand} {item.type}</div>
                                                    <div className="text-xs text-gray-500">Media: {item.media}</div>
                                                    <div className="text-xs text-gray-500">Kapasitas: {item.kapasitas}kg</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Status: {item.status}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                </div>

                {/* User management */}
                <div className="bg-white rounded-lg shadow mt-3">
                    <div className="p-3 text-center">
                        <Link href={"/users"} className="text-gray-600 text-xs font-medium">
                            <div className="flex w-full items-center">
                                <div className="text-left mr-5">
                                    <UsersIcon className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="text-left text-md">
                                    Kelola Pengguna
                                </div>
                            </div>
                        </Link>
                    </div>
                    <hr />
                    <div className="p-3 text-center">
                        <Link href={"/profile/letterhead"} className="text-gray-600 text-xs font-medium">
                            <div className="flex w-full items-center">
                                <div className="text-left mr-5">
                                    <EnvelopeIcon className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="text-left text-md">
                                    Ubah Kop PDF
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Inspections */}
                <div className="bg-white rounded-lg shadow mt-3">
                    <div className="p-3 border-b">
                        <h2 className="font-medium text-gray-500">Inspeksi Terakhir</h2>
                    </div>
                    <div className="divide-y">
                        {recentInspectionsLoading ? (
                            <div className="p-3 text-center text-gray-500">Memuat riwayat...</div>
                        ) : recentInspectionsError ? (
                            <div className="p-3 text-center text-red-500">{recentInspectionsError}</div>
                        ) : recentInspections.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">Tidak ada riwayat inspeksi.</div>
                        ) : (
                            recentInspections.slice(0, 5).map((item) => (
                                <div key={item.id_inspection} className="p-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">#{item.kode_barang}</p>
                                            <p className="text-xs text-gray-600">{item.lokasi || item.location_point || '- - -'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">{formatShortDate(item.tanggal_cek)}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${item.status !== "rusak" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                {item.status !== "rusak" ? "OK" : "APAR Rusak"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
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
        </MainLayout>
    );


    // Components
    function ProfileDetail({ label, value }: { label: string; value: string }) {
        return (
            <div>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="text-sm text-gray-400 font-medium">{value}</p>
            </div>
        );
    }

    function StatCard({
        title,
        value,
        icon,
        isGood = false,
        isWarning = false,
        onClick,
        clickable = false
    }: {
        title: string;
        value: string | number;
        icon: string;
        isGood?: boolean;
        isWarning?: boolean;
        onClick?: () => void;
        clickable?: boolean;
    }) {
        return (
            <div
                className={`basis-1/3 bg-white p-3 rounded-lg shadow-sm border ${clickable ? 'cursor-pointer hover:bg-gray-100 active:scale-[0.98] transition' : ''}`}
                onClick={clickable ? onClick : undefined}
            >
                <p className="text-xs text-gray-500">{title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className={`text-lg font-bold ${isGood ? 'text-green-600' :
                        isWarning ? 'text-yellow-600' :
                            'text-gray-800'
                        }`}>
                        {value}
                    </p>
                    <span className="text-lg">{icon}</span>
                </div>
            </div>
        );
    }
}