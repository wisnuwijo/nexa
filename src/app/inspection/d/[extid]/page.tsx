'use client';

import MainLayout from '@/app/components/main_layout';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ArrowDownCircleIcon, PlayCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from "next/image";

enum Status {
    Pending = 'Belum dikerjakan',
    OnProgress = 'On progress',
    Finished = 'Selesai'
}

interface ExtinguisherInspectionResult {
    location: string;
    brand: Status;
    medium: string;
    capacity: string;
    note: string;
}

export default function InspectionDetailPage() {
    const extinguisherList:ExtinguisherInspectionResult[] = [
        { location: 'Dekat Aula Depan Pintu', brand: Status.Finished, medium: '12 Maret 2025', capacity: 'Suryo', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { location: 'Ruang Inventory', brand: Status.Pending, medium: '20 April 2025', capacity: 'Tukiman', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { location: 'Lab 12P1', brand: Status.OnProgress, medium: '03 Mei 2025', capacity: 'Pardjo', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    ];

  return (
    <MainLayout appBarTitle='Inspeksi' showNavBar={false}>
        <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
            
            {/* Success Icon */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon width={40} height={40} className="text-purple-600"/>
            </div>

            {/* Success Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Inspeksi Mei</h1>

            {/* Reservation Details */}
            <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4 mt-8">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Tgl Dibuat</p>
                        <p className="text-base font-medium text-gray-900">12 Mei 2025</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Dibuat oleh</p>
                        <p className="text-base font-medium text-gray-900">
                            <UserCircleIcon width={20} height={20} className="inline-block mr-2 text-purple-600"/>
                            Suryo
                        </p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Jumlah apar</p>
                        <p className="text-base font-medium text-gray-900">21</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-base font-medium text-gray-900">On progress</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm space-y-3 mt-8">
                <Link href="/extinguisher/u/1" className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                    <PlayCircleIcon width={20} height={20} className="inline-block mr-2"/>
                    Lanjut Inspeksi
                </Link>
                <Link href="/extinguisher/u/1" className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                    <ArrowDownCircleIcon width={20} height={20} className="inline-block mr-2"/>
                    Unduh Laporan
                </Link>
            </div>
        </div>
        
        {/* List APAR */}
        <div className="max-w-[430px] mx-auto px-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center py-6">
                <div>
                    <h1 className="text-gray-900 text-xl font-bold">Daftar APAR</h1>
                    <p className="text-gray-500 text-sm mt-1">Catatan lengkap inspeksi alat pemadam kebakaran</p>
                </div>
            </div>

            <div className="mb-8">
                <div className="space-y-4">
                    {extinguisherList.map((ext, index) => (
                        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                            <Link key={index} href={'/inspection/d/' + index}>
                                <div className="flex space-x-4">
                                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                        <Image
                                            width={20}
                                            height={20}
                                            src="/images/extinguisher.svg"
                                            alt="Car cleaning service"
                                            className="object-cover"
                                            />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 font-medium text-base">{ext.location}</h3>
                                        <div className="grid grid-cols-2 gap-1">
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Tanggal</p>
                                                <p className="text-sm font-medium text-gray-700">{ext.medium}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                    {ext.capacity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 mt-3">
                                            <p className="text-xs text-gray-500">Keterangan</p>
                                            <p className="text-sm font-medium text-gray-700">{ext.note}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </MainLayout>
  );
}