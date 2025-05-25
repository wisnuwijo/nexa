'use client';

import MainLayout from '@/app/components/main_layout';
import Image from "next/image";
import Link from 'next/link';

export default function ExtinguisherDetailPage() {
  return (
    <MainLayout appBarTitle='APAR' showNavBar={false}>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 pt-24">
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                <Image
                    src="/images/extinguisher.svg"
                    alt="Car cleaning service"
                    className="object-cover"
                    />
            </div>

            {/* Success Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Sebelah Pintu Utama Lobby</h1>

            {/* Reservation Details */}
            <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4 mt-8">
                <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="text-base font-medium text-gray-900">Tanexa</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Media</p>
                    <p className="text-base font-medium text-gray-900">Powder</p>
                </div>
                </div>

                <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">Kapasitas</p>
                    <p className="text-base font-medium text-gray-900">5 Kg</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                    <p className="text-base font-medium text-gray-900">20 Desember 2030</p>
                </div>
                </div>

                <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">Tipe</p>
                    <p className="text-base font-medium text-gray-900">TP5</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Terakhir Inspeksi</p>
                    <p className="text-base font-medium text-gray-900">31 Maret 2025</p>
                </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm space-y-3 mt-16">
                <Link href="/extinguisher/u/1" className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                    Ubah data APAR
                </Link>
            </div>
        </div>
    </MainLayout>
  );
}