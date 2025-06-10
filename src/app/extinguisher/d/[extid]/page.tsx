'use client';

import MainLayout from '@/app/components/main_layout';
import Image from "next/image";
import Link from 'next/link';
import { use } from 'react'; // Removed useState as it's not needed for displaying history

export default function ExtinguisherDetailPage({ params }: { params: Promise<{ extid: string }> }) {
    const { extid } = use(params);

    // Dummy data for inspection history
    // In a real application, you would fetch this data from your backend API
    const inspectionHistory = [
        {
            date: '10 Juni 2025',
            pressureGauge: 'Bagus',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Bagus',
            korosi: 'Tidak',
        },
        {
            date: '01 Juni 2025',
            pressureGauge: 'Bagus',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Rusak',
            korosi: 'Ya',
        },
        {
            date: '15 Mei 2025',
            pressureGauge: 'Rusak',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Bagus',
            korosi: 'Tidak',
        },
        // Add more historical inspection records as needed
    ];

    return (
        <MainLayout appBarTitle='APAR' showNavBar={false}>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 pt-24">

                {/* Extinguisher Icon */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                    <Image
                        width={40}
                        height={40}
                        src="/images/extinguisher.svg"
                        alt="Fire extinguisher"
                        className="object-cover"
                    />
                </div>

                {/* Extinguisher Info */}
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Sebelah Pintu Utama Lobby</h1>
                <h3 className="text-xl font-semibold text-gray-400 mb-1">{extid}</h3>

                {/* Extinguisher Details */}
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

                ---

                {/* Inspection History Log Display */}
                <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-6 mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">Riwayat Inspeksi</h2>
                    {inspectionHistory.length > 0 ? (
                        inspectionHistory.map((log, index) => (
                            <div key={index} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Tanggal: <span className="font-semibold text-gray-900">{log.date}</span>
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><span className="font-medium">Pressure Gauge:</span> {log.pressureGauge}</li>
                                    <li><span className="font-medium">Kadaluarsa:</span> {log.expired}</li>
                                    <li><span className="font-medium">Selang:</span> {log.selang}</li>
                                    <li><span className="font-medium">Head Valve:</span> {log.headValve}</li>
                                    <li><span className="font-medium">Korosi:</span> {log.korosi}</li>
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Belum ada riwayat inspeksi untuk APAR ini.</p>
                    )}
                </div>

                ---

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-3 mt-6 mb-8">
                    <Link href="/extinguisher/u/1" className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                        Ubah data APAR
                    </Link>
                    {/* If you want to add a button to navigate to a new inspection form, you can uncomment this */}
                    {/* <Link href={`/extinguisher/${extid}/new-inspection`} className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center">
                        Tambah Inspeksi Baru
                    </Link> */}
                </div>
            </div>
        </MainLayout>
    );
}