'use client';

import { getInspectionList, InspectionItem } from '@/api/schedule';
import { DocumentTextIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainLayout from '../components/main_layout';

export default function InspectionPage() {
    const router = useRouter();
    const [inspectionList, setInspectionList] = useState<InspectionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getInspectionList();
                setInspectionList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal mengambil data inspeksi');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
    <MainLayout appBarTitle='' showNavBar={true}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-gray-900 text-xl font-bold">Inspeksi APAR</h1>
                        <p className="text-gray-500 text-sm mt-1">Pantau dan kelola pemeriksaan alat pemadam api ringan secara berkala.</p>
                    </div>
                </div>

                {/* Extinguisher table */}
                <table className="hidden mb-8 md:table w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agenda</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Agenda</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Mulai</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Selesai</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Agenda Dibuat</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-400">Memuat data inspeksi...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-red-500">{error}</td>
                            </tr>
                        ) : inspectionList.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-500">Tidak ada data inspeksi.</td>
                            </tr>
                        ) : (
                            inspectionList.map((ext) => (
                                <tr key={ext.id} className='hover:bg-gray-50'>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.inspeksi_title}</td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.no_jadwal}</td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium">
                                        {ext.status === 'Belum dikerjakan' && (
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">Belum dikerjakan</span>
                                        )}
                                        {ext.status === 'On progress' && (
                                            <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">On progress</span>
                                        )}
                                        {ext.status === 'Selesai' && (
                                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Selesai</span>
                                        )}
                                    </td>

                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {(() => {
                                            const date = new Date(ext.tgl_mulai);
                                            return isNaN(date.getTime())
                                                ? "- - -"
                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                        })()}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {(() => {
                                            const date = new Date(ext.tgl_selesai);
                                            return isNaN(date.getTime())
                                                ? "- - -"
                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                        })()}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                        <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                        {ext.inspection_name}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {(() => {
                                            const date = new Date(ext.created_at);
                                            return isNaN(date.getTime())
                                                ? "- - -"
                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                        })()}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap">
                                        <Link href={`/inspection/d/${ext.id}`} className="text-purple-600 hover:underline font-medium flex items-center">
                                            <DocumentTextIcon width={18} height={18} color='#9334e9' className="inline-block mr-1" />
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Mobile Cards (for responsive view) */}
                <div className="md:hidden mb-8">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-400">Memuat data inspeksi...</div>
                        ) : error ? (
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-red-500">{error}</div>
                        ) : inspectionList.length === 0 ? (
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-500">Tidak ada data inspeksi.</div>
                        ) : (
                            inspectionList.map((ext) => (
                                <div key={ext.id} className="bg-white p-4 rounded-2xl shadow-sm">
                                    <Link href={'/inspection/d/' + ext.id}>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                <DocumentTextIcon width={20} height={20} color='#9334e9' />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-gray-900 font-medium text-base">{ext.inspeksi_title}</h3>
                                                <div className="text-xs text-gray-500 mb-2">{ext.no_jadwal}</div>

                                                <div className="grid grid-cols-3 gap-1">
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Tgl. Mulai</p>
                                                        <p className="text-sm font-medium text-gray-700">{(() => {
                                                            const date = new Date(ext.tgl_mulai);
                                                            return isNaN(date.getTime())
                                                                ? "- - -"
                                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                                        })()}</p>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Tgl. Selesai</p>
                                                        <p className="text-sm font-medium text-gray-700">{(() => {
                                                            const date = new Date(ext.tgl_selesai);
                                                            return isNaN(date.getTime())
                                                                ? "- - -"
                                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                                        })()}</p>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Tgl. dibuat</p>
                                                        <p className="text-sm font-medium text-gray-700">{(() => {
                                                            const date = new Date(ext.created_at);
                                                            return isNaN(date.getTime())
                                                                ? "- - -"
                                                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                                                        })()}</p>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                            {ext.inspection_name}
                                                        </p>
                                                    </div>
                                                    <div className="text-left col-span-2">
                                                        <p className="text-xs text-gray-500">Status</p>
                                                        <p className="text-sm font-medium text-gray-700">{ext.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => router.push('/inspection/create')}
                className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
                <PlusIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    </MainLayout>
  );
}