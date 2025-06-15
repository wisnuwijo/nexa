'use client';

import { CalendarDaysIcon, PlusIcon, UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '../components/main_layout';

interface UserData {
    name: string;
    access: string;
    createdAt: string;
}

export default function InspectionPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userList: UserData[] = [
        { name: 'Tristan', access: 'Administrator', createdAt: '21 Mar 2025' },
        { name: 'Wisnu', access: 'Inspektor', createdAt: '31 Jan 2025' },
        { name: 'Tedy', access: 'Inspektor', createdAt: '04 Mei 2020' }
    ];

    return (
        <MainLayout appBarTitle='' showNavBar={true}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] mx-auto px-4 pb-24">
                    {/* Header */}
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-gray-900 text-xl font-bold">Kelola Pengguna</h1>
                            <p className="text-gray-500 text-sm mt-1">Tambahkan pengguna baru agar dapat berkolaborasi</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="space-y-4">
                            {userList.map((ext, index) => (
                                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                    <Link key={index} href={'/users/d/' + index}>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                <UserIcon width={20} height={20} color='#9334e9' />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-gray-900 font-medium text-base">{ext.name}</h3>
                                                <div className="grid grid-cols-2 gap-1">
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Akses</p>
                                                        <p className="text-sm font-medium text-gray-700">{ext.access}</p>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Tgl. diundang</p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            <CalendarDaysIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                            {ext.createdAt}
                                                        </p>
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
                    onClick={() => router.push('/users/create')}
                    className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                >
                    <PlusIcon className="w-6 h-6 text-white" />
                </button>
            </div>
        </MainLayout>
    );
}