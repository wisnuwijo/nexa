'use client';

import MainLayout from '@/app/components/main_layout';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// enum Status {
//     Pending = 'Belum dikerjakan',
//     OnProgress = 'On progress',
//     Finished = 'Selesai'
// }

export default function InspectionDetailPage() {
    // const extinguisherList:ExtinguisherInspectionResult[] = [
    //     { location: 'Dekat Aula Depan Pintu', brand: Status.Finished, medium: '12 Maret 2025', capacity: 'Suryo', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    //     { location: 'Ruang Inventory', brand: Status.Pending, medium: '20 April 2025', capacity: 'Tukiman', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    //     { location: 'Lab 12P1', brand: Status.OnProgress, medium: '03 Mei 2025', capacity: 'Pardjo', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    // ];

  return (
    <MainLayout appBarTitle='Pengguna' showNavBar={false}>
        <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
            
            {/* Success Icon */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                <UserCircleIcon width={40} height={40} className="text-purple-600"/>
            </div>

            {/* Success Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Michael William</h1>

            {/* Inspection Details */}
            <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-4 mt-8">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="text-base font-medium text-gray-900">MichaelWilliam</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-medium text-gray-900">
                            michael.william@mail.com
                        </p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Akses</p>
                        <p className="text-base font-medium text-gray-900">Administrator</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tgl. diundang</p>
                        <p className="text-base font-medium text-gray-900">15 Jun 2025</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm md:max-w-full space-y-3 mt-8">
                <Link href="#" className="block w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                    <TrashIcon width={20} height={20} className="inline-block mr-2"/>
                    Hapus Pengguna
                </Link>
            </div>
        </div>
    </MainLayout>
  );
}