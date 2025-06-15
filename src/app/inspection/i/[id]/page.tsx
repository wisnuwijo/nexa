'use client'

import MainLayout from '@/app/components/main_layout'
import ProgressBar from '@/app/components/progress_bar'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Image from "next/image"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'; // Removed useState as it's not needed for displaying history

export default function InspectionExtinguisherList() {
    // const { id } = use(params)
    const router = useRouter()
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

    // Dummy data for inspection history
    // In a real application, you would fetch this data from your backend API
    const extinguisherList = [
        {
            location: 'Pintu Depan (Gedung A)',
            pressureGauge: 'Bagus',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Bagus',
            korosi: 'Tidak',
        },
        {
            location: 'Pintu Depan (Gedung A)',
            pressureGauge: 'Bagus',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Rusak',
            korosi: 'Ya',
        },
        {
            location: 'Pintu Depan (Gedung A)',
            pressureGauge: 'Rusak',
            expired: 'Tidak',
            selang: 'Bagus',
            headValve: 'Bagus',
            korosi: 'Tidak',
        },
        // Add more historical inspection records as needed
    ]

    const optionModal = <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsFinishModalOpen(false)}>
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
                            onClick={() => router.push('/inspection/d/0')}
                            className="bg-purple-600 w-full text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Selesai</span>
                            </div>
                        </button>
                    </div>
                    <div className="w-1/2">
                    <button
                            onClick={() => setIsFinishModalOpen(false)}
                            className="bg-gray-100 w-full text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
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
        <MainLayout appBarTitle='Inspeksi Juni' showNavBar={false}>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 pt-16">

                <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-3">
                    <p className="text-sm font-medium text-gray-500">
                        <span className="font-bold">Progress</span> <br />
                        50/100 APAR sudah inspeksi
                    </p>

                    <ProgressBar progress={50} label="" />
                </div>

                {/* Extinguisher list */}
                <div className="w-full max-w-sm rounded-xl space-y-6 mt-8">
                    {extinguisherList.length > 0 ? (
                        extinguisherList.map((ext, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                <Link key={index} href={'/inspection/d/' + index}>
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
                                            <h3 className="text-gray-900 font-medium text-base">{ext.location}</h3>
                                            <div className="grid grid-cols-3 gap-1">
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Brand</p>
                                                    <p className="text-sm font-medium text-gray-700">Tanexa</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Media</p>
                                                    <p className="text-sm font-medium text-gray-700">Powder</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Kapasitas</p>
                                                    <p className="text-sm font-medium text-gray-700">6.0 kg</p>
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
                                                    <p className="text-sm font-medium text-gray-700">12 Mar 2025</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Status</p>
                                                    <p className="text-sm font-medium text-gray-700">OK</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                        {ext.selang}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Belum ada riwayat inspeksi untuk APAR ini.</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm p-6 sm:p-6 space-y-6 mt-8">
                    <div className="flex gap-4 fixed bottom-2 left-0 right-0 mx-auto max-w-sm px-6">
                        <button
                            onClick={() => router.push('/inspection/i/83180142903/extid')}
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

                        {/* Option modal */}
                        <div className={isFinishModalOpen ? "block" : "hidden"}>
                            {optionModal}
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    )
}