'use client';

import MainLayout from '@/app/components/main_layout';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserDetail, deleteUser } from '@/api/user';
import type { UserDetail } from '@/api/user';
import { toast, ToastContainer } from 'react-toastify';

export default function UserDetail() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const params = useParams();
    const usrid = params.usrid;
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!usrid) return;
        const id = Array.isArray(usrid) ? usrid[0] : usrid;
        setLoading(true);
        getUserDetail(id)
            .then(data => setUserDetail(data))
            .catch(err => toast.error('Gagal mengambil detail user: ' + (err instanceof Error ? err.message : 'Unknown error')))
            .finally(() => setLoading(false));
    }, [usrid]);
    
    const handleDeleteUser = async () => {
        if (!usrid) return;
        const id = Array.isArray(usrid) ? usrid[0] : usrid;
        setDeleting(true);
        try {
            await deleteUser(id);
            toast.success('User berhasil dihapus!');
            setShowDeleteModal(false);
            setTimeout(() => {
                router.push('/users');
            }, 2000);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Gagal menghapus user.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <MainLayout appBarTitle='Pengguna' showNavBar={false}>
                <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                        <UserCircleIcon width={40} height={40} className="text-purple-600"/>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-xl font-semibold text-gray-900 mb-1">
                        {loading ? (
                            <span className="inline-block w-40 h-7 bg-gray-200 rounded animate-pulse">&nbsp;</span>
                        ) : userDetail?.name || '-'}
                    </h1>

                    {/* Inspection Details */}
                    <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-4 mt-8">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Username</p>
                                {loading ? (
                                    <span className="inline-block w-28 h-6 bg-gray-200 rounded animate-pulse">&nbsp;</span>
                                ) : (
                                    <p className="text-base font-medium text-gray-900">{userDetail?.username || '-'}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Email</p>
                                {loading ? (
                                    <span className="inline-block w-36 h-6 bg-gray-200 rounded animate-pulse">&nbsp;</span>
                                ) : (
                                    <p className="text-base font-medium text-gray-900">{userDetail?.email || '-'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Akses</p>
                                {loading ? (
                                    <span className="inline-block w-24 h-6 bg-gray-200 rounded animate-pulse">&nbsp;</span>
                                ) : (
                                    <p className="text-base font-medium text-gray-900">{userDetail?.nama_level || '-'}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tgl. diundang</p>
                                {loading ? (
                                    <span className="inline-block w-28 h-6 bg-gray-200 rounded animate-pulse">&nbsp;</span>
                                ) : (
                                    <p className="text-base font-medium text-gray-900">{userDetail?.created_at ? new Date(userDetail.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full max-w-sm md:max-w-full space-y-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="block w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                        >
                            <TrashIcon width={20} height={20} className="inline-block mr-2"/>
                            Hapus Pengguna
                        </button>
                    </div>

                    {/* Modal Bottom Sheet for Delete Confirmation */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setShowDeleteModal(false)}>
                            <div
                                className="w-full bg-white rounded-t-2xl p-6 pb-8 shadow-lg"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                                <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Konfirmasi Hapus Pengguna</h2>
                                <p className="text-gray-600 text-center mb-6">Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.</p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-400"
                                        onClick={handleDeleteUser}
                                        disabled={deleting}
                                    >
                                        {deleting ? 'Menghapus...' : 'Hapus'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </MainLayout>
        </>
    );
}