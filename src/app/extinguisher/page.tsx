'use client';

import { DocumentArrowDownIcon, EllipsisHorizontalIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '../components/main_layout';

type Extinguisher2 = {
    id: string;
    location: string;
    brand: string;
    image: string;
    unitNumber: string;
    capacity: string;
    media: string;
    expiryDate: string;
    lastInspection: string;
};

export default function ExtingisherPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data
    const [extinguishers] = useState<Extinguisher2[]>([
        {
            id: "ext-001",
            unitNumber: "APAR-001",
            capacity: "6 kg",
            media: "Dry Powder",
            expiryDate: "15/10/2025",
            lastInspection: "10/06/2024",
            image: '/images/extinguisher.svg',
            brand: 'Tanexa',
            location: 'Depan Gerbang Utama'
        },
        {
            id: "ext-002",
            unitNumber: "APAR-002",
            capacity: "9 kg",
            media: "CO₂",
            expiryDate: "20/09/2024",
            lastInspection: "05/06/2024",
            image: '/images/extinguisher.svg',
            brand: 'Tanexa',
            location: 'Depan Gerbang Utama'
        },
        // Add more data as needed
    ]);

    const handleViewDetail = (id: string) => {
        router.push(`/extinguisher/d/${id}`);
    };

    return (
        <MainLayout appBarTitle='' showNavBar={true}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] sm:max-w-fit mx-auto px-4 pb-24">
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
                        <div className="relative mb-12 text-gray-600">
                            <select
                                className="w-full py-3.5 px-12 bg-white rounded-2xl shadow-sm text-base"
                                onChange={(e) => {
                                    // Handle building filter change
                                    const selectedBuilding = e.target.value;
                                    // You can implement the filtering logic here
                                }}
                            >
                                <option value="">Semua gedung</option>
                                <option value="building-a">Building A</option>
                                <option value="building-b">Building B</option>
                                <option value="building-c">Building C</option>
                            </select>
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🏢</span>
                        </div>

                        {/* Extinguisher table */}
                        <table className="hidden sm:block min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No Unit
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kapasitas
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Media
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kadaluarsa
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Inspeksi
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {extinguishers.map((ext) => (
                                    <tr key={ext.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {ext.unitNumber}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {ext.location}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {ext.brand}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {ext.capacity}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {ext.media}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {ext.expiryDate}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {ext.lastInspection}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleViewDetail(ext.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                            >
                                                Lihat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards (for responsive view) */}
                        <div className='sm:hidden'>
                            <div className="space-y-4 mt-5">
                                {extinguishers.map((ext, index) => (
                                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                        <Link key={index} href={'/extinguisher/d/' + index}>
                                            <div className="flex space-x-4">
                                                <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                    <Image
                                                        src={ext.image}
                                                        alt={ext.location}
                                                        width={20}
                                                        height={20}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-base">
                                                        <span className='text-gray-900'>
                                                            {ext.location}
                                                        </span>
                                                        <span className='ml-3 text-gray-400'>
                                                            #{ext.unitNumber}
                                                        </span>
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
                                                            <p className="text-sm font-medium text-gray-700">{ext.capacity}</p>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xs text-gray-500">Kadaluarsa</p>
                                                            <p className="text-sm font-medium text-gray-700">{ext.expiryDate}</p>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xs text-gray-500">Inspeksi</p>
                                                            <p className="text-sm font-medium text-gray-700">{ext.lastInspection}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
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
                                    <span className="text-gray-700">Generate QR</span>
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