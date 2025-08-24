'use client';

import { DocumentArrowDownIcon, EllipsisHorizontalIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getExtinguisherList, Extinguisher } from '../../api/extinguisher';
import MainLayout from '../components/main_layout';
import { getLocationList, Location } from '@/api/location';

export default function ExtingisherPage() {
    function formatDate(dateStr: string) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ /g, ' ');
    }
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const extList = await getExtinguisherList();
                const locationList = await getLocationList();
                setExtinguishers(extList);
                setLocations(locationList);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Gagal mengambil detail APAR');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleViewDetail = (id: string) => {
        router.push(`/extinguisher/d/${id}`);
    };

    return (
        <MainLayout appBarTitle='' showNavBar={true}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                    {/* Header */}
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-gray-900 text-xl font-bold">Kelola APAR</h1>
                            <p className="text-gray-500 text-sm mt-1">Pastikan alat pemadam selalu siap digunakan dalam keadaan darurat.</p>
                        </div>
                    </div>

                    <div className="mb-8">

                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Cari APAR.."
                                className="w-full py-3.5 px-12 bg-white rounded-2xl shadow-sm text-base"
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                        </div>

                        {/* Building Filter */}
                        <div className={`relative mb-12 text-gray-600 ${locations.length === 0 ? 'hidden' : ''}`}>
                            <select
                                className="w-full py-3.5 px-12 bg-white rounded-2xl shadow-sm text-base"
                                // onChange={(e) => {
                                    // Handle building filter change
                                    // const selectedBuilding = e.target.value;
                                // }}
                            >
                                <option value="">Semua gedung</option>
                                {
                                    locations.map(location => (
                                        <option key={location.id} value={location.id}>{location.nama_gedung}</option>
                                    ))
                                }
                            </select>
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🏢</span>
                        </div>

                        {/* Extinguisher table */}
                        <table className="hidden md:table w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Unit</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspeksi</th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-gray-400 animate-pulse">Memuat data APAR...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-red-500">{error}</td>
                                    </tr>
                                ) : extinguishers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-gray-400">Tidak ada data APAR.</td>
                                    </tr>
                                ) : (
                                    extinguishers.map((ext) => (
                                        <tr key={ext.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.kode_barang}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.lokasi || '- - -'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.brand}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.kapasitas} kg</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.media}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(ext.tgl_kadaluarsa)}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ext.last_inspection || '- - -'}</td>
                                            <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <button
                                                    onClick={() => handleViewDetail(ext.kode_barang)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                >
                                                    Lihat
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Mobile Cards (for responsive view) */}
                        <div className='md:hidden'>
                            <div className="space-y-4 mt-5">
                                {loading ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-sm animate-pulse text-center text-gray-400">Memuat data APAR...</div>
                                ) : error ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-red-500">{error}</div>
                                ) : extinguishers.length === 0 ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-400">Tidak ada data APAR.</div>
                                ) : (
                                    extinguishers.map((ext) => (
                                        <div key={ext.id} className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Link href={'/extinguisher/d/' + ext.kode_barang}>
                                                <div className="flex space-x-4">
                                                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                        <Image
                                                            src={'/images/extinguisher.svg'}
                                                            alt={ext.lokasi || '-'}
                                                            width={20}
                                                            height={20}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-base">
                                                            <span className='text-gray-900'>{ext.lokasi || '- - -'}</span>
                                                            <span className='ml-3 text-gray-400'>#{ext.kode_barang}</span>
                                                        </h3>
                                                        <div className="grid grid-cols-3 gap-2">
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
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Kadaluarsa</p>
                                                                <p className="text-sm font-medium text-gray-700">{formatDate(ext.tgl_kadaluarsa)}</p>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs text-gray-500">Inspeksi</p>
                                                                <p className="text-sm font-medium text-gray-700">{ext.last_inspection || '-'}</p>
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
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                >
                    <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
                </button>

                {/* Modal Bottom Sheet */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsModalOpen(false)}>
                        <div
                            className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                            <div className="space-y-4">
                                <button
                                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                                    onClick={() => {
                                        // Handle QR generation
                                        setIsModalOpen(false);
                                        router.push('/extinguisher/sticker'); // Navigate to the QR generation pag
                                    }}
                                >
                                    <QrCodeIcon className="w-6 h-6 text-purple-600" />
                                    <span className="text-gray-700">Kelola Stiker QR</span>
                                </button>
                                <button
                                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                                    onClick={() => {
                                        // Handle PDF download
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <DocumentArrowDownIcon className="w-6 h-6 text-purple-600" />
                                    <span className="text-gray-700">Download PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}