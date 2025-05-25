'use client';

import { DocumentArrowDownIcon, PlusIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '../components/main_layout';

interface Extinguisher {
  location: string;
  brand: string;
  medium: string;
  capacity: string;
  image: string;
}

export default function ExtingisherPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const extinguisherList: Extinguisher[] = [
    { location: 'Depan Gerbang Utama', brand: 'Tanexa', medium: 'Powder', capacity: '3.0 kg', image: '/images/extinguisher.svg'},
    { location: 'Pojok Aula', brand: 'Tanexa', medium: 'Powder', capacity: '3.0 kg', image: '/images/extinguisher.svg' },
    { location: 'Basement 12', brand: 'Tanexa', medium: 'Powder', capacity: '3.0 kg', image: '/images/extinguisher.svg' }
  ];

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6">
                <div>
                    <h1 className="text-gray-900 text-xl font-bold">Kelola APAR</h1>
                    <p className="text-gray-500 text-sm mt-1">Pastikan alat pemadam selalu siap digunakan dalam keadaan darurat.</p>
                </div>
                </div>

                <div className="mb-8">
                    <div className="space-y-4">
                        {extinguisherList.map((ext, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                <Link key={index} href={'/extinguisher/d/' + index}>
                                    <div className="flex items-center space-x-4">
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
                                        <h3 className="text-gray-900 font-medium mb-3 text-base">{ext.location}</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">Brand</p>
                                            <p className="text-sm font-medium text-gray-700">{ext.brand}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">Media</p>
                                            <p className="text-sm font-medium text-gray-700">{ext.medium}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">Kapasitas</p>
                                            <p className="text-sm font-medium text-gray-700">{ext.capacity}</p>
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

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
                <PlusIcon className="w-6 h-6 text-white" />
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