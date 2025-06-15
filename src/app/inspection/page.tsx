'use client';

import { DocumentTextIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/main_layout';

enum Status {
  Pending = 'Belum dikerjakan',
  OnProgress = 'On progress',
  Finished = 'Selesai'
}

interface InspectionReport {
  name: string;
  status: Status;
  createdAt: string;
  createdBy: string;
}

export default function InspectionPage() {
  const router = useRouter();
  const extinguisherList: InspectionReport[] = [
    { name: 'Inspeksi Maret', status: Status.Finished, createdAt: '12 Maret 2025', createdBy: 'Suryo'},
    { name: 'Inspeksi April', status: Status.Pending, createdAt: '20 April 2025', createdBy: 'Tukiman'},
    { name: 'Inspeksi Mei', status: Status.OnProgress, createdAt: '03 Mei 2025', createdBy: 'Pardjo'}
  ];

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-gray-900 text-xl font-bold">Inspeksi APAR</h1>
                        <p className="text-gray-500 text-sm mt-1">Pantau dan kelola pemeriksaan alat pemadam api ringan secara berkala.</p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="space-y-4">
                        {extinguisherList.map((ext, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                <Link key={index} href={'/inspection/d/' + index}>
                                    <div className="flex items-center space-x-4">
                                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                        <DocumentTextIcon width={20} height={20} color='#9334e9' />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 font-medium text-base">{ext.name}</h3>
                                        <div className="grid grid-cols-3 gap-1">
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Tgl. dibuat</p>
                                                <p className="text-sm font-medium text-gray-700">{ext.createdAt}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className="text-sm font-medium text-gray-700">{ext.status}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                    {ext.createdBy}
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
                onClick={() => router.push('/inspection/create')}
                className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
                <PlusIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    </MainLayout>
  );
}