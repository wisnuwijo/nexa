'use client';

import MainLayout from '@/app/components/main_layout';
import { ArrowDownCircleIcon, PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StickerData {
  createdAt: string;
  link: string;
  qty: number;
}

export default function StickerPage() {
  const router = useRouter();
  const stickerList: StickerData[] = [
    { createdAt: '21 Juni 2024 22:30', link: 'https://google.com', qty: 10 },
    { createdAt: '10 Maret 2024 09:23', link: 'https://google.com', qty: 10 },
    { createdAt: '29 Desember 2024 13:11', link: 'https://google.com', qty: 10 },
  ];

  return (
    <MainLayout appBarTitle='Stiker QR' showNavBar={true}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6 pt-20">
                <div>
                    <p className="text-gray-500 text-sm mt-1">Stiker QR dapat digunakan untuk identifikasi pencatatan APAR. Berikut ini adalah daftar stiker APAR yang sudah dibuat.</p>
                </div>
                </div>

                <div className="mb-8">
                    <div className="space-y-4">
                        {stickerList.map((ext, index) => (
                        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-medium mb-3 text-base">🗓️ {ext.createdAt}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                <div className="text-left">
                                    <p className="text-xs text-gray-500">Jumlah QR</p>
                                    <p className="text-sm font-medium text-gray-700">{ext.qty}</p>
                                </div>

                                <div className="text-left">
                                    <p className="text-xs text-gray-500">Aksi</p>
                                    <Link target='_blank' href={ext.link} className="text-purple-600 hover:text-purple-700">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <ArrowDownCircleIcon className="w-5 text-purple-600"/>
                                                    </td>
                                                    <td>
                                                        <span className="text-gray-700">Unduh</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Link>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => router.push('/extinguisher/sticker/create')}
                className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
                <PlusIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    </MainLayout>
  );
}