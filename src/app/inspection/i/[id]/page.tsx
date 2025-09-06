'use client'

import { getInspectedExtinguisherList, getInspectionProgress, InspectedExtinguisher, InspectionProgressResponse } from '@/api/inspection'
import { getInspectionScheduleDetail, InspectionScheduleDetailResponse, updateInspectionScheduleStatus } from '@/api/schedule'
import MainLayout from '@/app/components/main_layout'
import ProgressBar from '@/app/components/progress_bar'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { PlusIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Image from "next/image"
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function InspectionExtinguisherList() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
    const router = useRouter();
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [finishLoading, setFinishLoading] = useState(false);
    const [finishError, setFinishError] = useState<string | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [selectedExtinguisherToBeDeleted, setSelectedExtinguisherToBeDeleted] = useState<InspectedExtinguisher | null>(null);

    const [extinguisherList, setExtinguisherList] = useState<InspectedExtinguisher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<InspectionProgressResponse | null>(null);
    const [scheduleDetail, setScheduleDetail] = useState<InspectionScheduleDetailResponse | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const [extResult, progressResult, scheduleResult] = await Promise.all([
                    getInspectedExtinguisherList(id),
                    getInspectionProgress(id),
                    getInspectionScheduleDetail(id)
                ]);
                setExtinguisherList(extResult.data_list_apar_inspected);
                setProgress(progressResult);
                setScheduleDetail(scheduleResult);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal mengambil data inspeksi');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function handleFinish() {
        setFinishLoading(true);
        setFinishError(null);
        try {
            await updateInspectionScheduleStatus(id, 'Selesai');
            setIsFinishModalOpen(false);

            toast.success('Inspeksi berhasil diselesaikan!');
            setTimeout(() => {
                router.push('/inspection/d/' + id);
            }, 2000);
        } catch (err) {
            toast.error('Gagal memperbarui status jadwal inspeksi');
            setFinishError(err instanceof Error ? err.message : 'Gagal memperbarui status jadwal inspeksi');
        } finally {
            setFinishLoading(false);
        }
    }

    async function handleDelete() {
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            // await updateInspectionScheduleStatus(id, 'Selesai');
            setIsDeleteModalOpen(false);

            toast.success('Inspeksi berhasil dihapus!');
            setTimeout(() => {
                router.push('/inspection/d/' + id);
            }, 2000);
        } catch (err) {
            toast.error('Gagal memperbarui status jadwal inspeksi');
            setDeleteError(err instanceof Error ? err.message : 'Gagal memperbarui status jadwal inspeksi');
        } finally {
            setDeleteLoading(false);
        }
    }

    const deleteConfirmModal = <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDeleteModalOpen(false)}>
        <div
            className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <div className="space-y-4">
                <h1 className="text-lg font-medium text-gray-900">Konfirmasi</h1>
                <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus APAR <strong>#{selectedExtinguisherToBeDeleted?.kode_barang}</strong> dari inspeksi?</p>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <button
                            onClick={handleDelete}
                            className={`bg-purple-600 w-full text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center ${deleteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={deleteLoading}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>{deleteLoading ? 'Menyimpan...' : 'Hapus'}</span>
                            </div>
                        </button>
                        {deleteError && <div className="text-red-500 text-center mt-2">{deleteError}</div>}
                    </div>
                    <div className="w-1/2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="bg-gray-100 w-full text-purple-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Batal</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    const finisihConfirmModal = <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsFinishModalOpen(false)}>
        <div
            className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <div className="space-y-4">
                <h1 className="text-lg font-medium text-gray-900">Konfirmasi</h1>
                <p className="text-sm text-gray-500">Apakah Anda yakin ingin menyelesaikan inspeksi?</p>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <button
                            onClick={handleFinish}
                            className={`bg-purple-600 w-full text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center ${finishLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={finishLoading}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>{finishLoading ? 'Menyimpan...' : 'Selesai'}</span>
                            </div>
                        </button>
                        {finishError && <div className="text-red-500 text-center mt-2">{finishError}</div>}
                    </div>
                    <div className="w-1/2">
                        <button
                            onClick={() => setIsFinishModalOpen(false)}
                            className="bg-gray-100 w-full text-purple-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Batal</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    return (
        <MainLayout appBarTitle='Inspeksi' showNavBar={false}>
            {/* Finish Confirm modal */}
            <div className={isFinishModalOpen ? "block" : "hidden"}>
                {finisihConfirmModal}
            </div>

            {/* Delete Confirm modal */}
            <div className={isDeleteModalOpen ? "block" : "hidden"}>
                {deleteConfirmModal}
            </div>

            {
                scheduleDetail?.detail_agenda.status.toLowerCase() === 'selesai'
                    ? <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Inspeksi Selesai</h2>
                            <p className="text-gray-600">
                                Data inspeksi telah selesai dan tidak dapat diubah lagi
                            </p>
                            <div className="pt-2">
                                <span className="inline-flex items-center px-4 py-2 bg-green-50 text-sm text-green-700 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tidak dapat mengubah data
                                </span>
                            </div>
                        </div>
                    </div>
                    : <>
                        {/* Warning message */}
                        <div className="hidden md:flex flex-col items-center justify-center min-h-screen bg-gray-50">
                            <div className="max-w-md p-8 bg-white rounded-2xl shadow-lg text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900">Perangkat Tidak Didukung</h2>
                                <p className="text-gray-600">
                                    Inspeksi menggunakan perangkat desktop tidak didukung. Mohon gunakan perangkat ponsel untuk melakukan inspeksi.
                                </p>
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-4 py-2 bg-purple-50 text-sm text-purple-700 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Buka di Perangkat Mobile
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-screen md:hidden bg-gray-50 flex flex-col items-center px-6 pt-16">

                            <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-3">
                                <p className="text-sm font-medium text-gray-500">
                                    <span className="font-bold">Progress</span> <br />
                                    {progress
                                        ? `${progress.proggress_inspected}/${progress.proggress_inspected + progress.proggress_uninspected} APAR sudah inspeksi`
                                        : 'Memuat progress...'}
                                </p>
                                <ProgressBar
                                    progress={progress ? Math.round((progress.proggress_inspected / (progress.proggress_inspected + progress.proggress_uninspected)) * 100) : 0}
                                    label=""
                                />
                            </div>

                            {/* Extinguisher list */}
                            <div className="w-full max-w-sm rounded-xl space-y-6 mt-8">
                                {loading ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-400">Memuat data inspeksi...</div>
                                ) : error ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-red-500">{error}</div>
                                ) : extinguisherList.length > 0 ? (
                                    extinguisherList.map((ext, index) => (
                                        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Link key={index} href={'/inspection/i/' + id + '/' + btoa(String(ext.barcode)) + '?id=' + ext.id}>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src="/images/extinguisher.svg"
                                                            alt="Fire extinguisher"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-gray-900 font-medium text-base">{ext.lokasi}</h3>
                                                        <p className='text-gray-400 font-medium text-xs mb-1'>#{ext.kode_barang}</p>
                                                        <div className="grid grid-cols-3 gap-1">
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Brand</p>
                                                                <p className="text-sm font-medium text-gray-700">{ext.brand}</p>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Media</p>
                                                                <p className="text-sm font-medium text-gray-700">{ext.media}</p>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Kapasitas</p>
                                                                <p className="text-sm font-medium text-gray-700">{ext.kapasitas} kg</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-[50px] h-[50px] rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="grid grid-cols-3 gap-1">
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Tgl. inspeksi</p>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    {ext.last_inspection ? new Date(ext.created_at).toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    }) : ''}
                                                                </p>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Status</p>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    {ext.status ? ext.status.charAt(0).toUpperCase() + ext.status.slice(1) : ''}
                                                                </p>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                                    {/* Nama QC tidak tersedia di InspectedExtinguisher */}
                                                                    - - -
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            
                                            {/* Delete button */}
                                            <div className="bg-red-50 mt-4 p-3 rounded-lg flex text-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        setIsDeleteModalOpen(true)
                                                        setSelectedExtinguisherToBeDeleted(ext);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <TrashIcon className="w-5 h-5 inline-block mr-2" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm">
                                        {/* "No data" icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17a4 4 0 004 4h8a4 4 0 004-4V7a4 4 0 00-4-4H8a4 4 0 00-4 4v10zm8-4v.01M8 13h.01M16 13h.01" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Belum Ada Data Inspeksi</h3>
                                        <p className="text-gray-500 text-center">
                                            Silakan lakukan inspeksi untuk mulai mencatat data.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full max-w-sm p-6 sm:p-6 space-y-6 mt-8">
                                <div className="flex gap-4 fixed bottom-2 left-0 right-0 mx-auto max-w-sm px-6">
                                    <button
                                        onClick={() => {
                                            router.push(`/inspection/i/${id}/scan`);
                                        }}
                                        className="bg-purple-600 w-3/4 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <PlusIcon className="w-6 h-6 text-white" />
                                            <span>Cek APAR</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setIsFinishModalOpen(true)}
                                        className="bg-purple-600 w-1/4 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircleIcon className="w-6 h-6 text-white" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </MainLayout>
    )
}