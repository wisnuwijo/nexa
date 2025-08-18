'use client';

import { useEffect, useState } from 'react';
import { getQrStickerList, QrSticker } from '@/api/extinguisher';
import MainLayout from '@/app/components/main_layout';
import { ArrowDownCircleIcon, PlusIcon } from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatIndoDateTime(dateString: string) {
  // dateString: "2025-08-18 16:17:32"
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year} ${hour}:${minute}`;
}

export default function QrStickerListPage() {
  const router = useRouter();
  const [qrStickers, setQrStickers] = useState<QrSticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStickers() {
      setLoading(true);
      try {
        const data = await getQrStickerList();
        setQrStickers(data);
      } catch (err) {
        const errorMessage = typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : 'Gagal mengambil daftar QR sticker.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchStickers();
  }, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <MainLayout appBarTitle="Daftar QR Stiker" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
          <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Daftar QR Stiker</h2>
            {loading ? (
              <ul className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <li key={idx} className="bg-white p-4 rounded-2xl shadow-sm animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded mb-3" />
                        <div className="h-4 bg-gray-200 rounded mb-3" />
                        <div className="h-4 bg-gray-200 rounded mb-3" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : qrStickers.length === 0 ? (
              <div className="text-center text-gray-500">Tidak ada data QR stiker ditemukan.</div>
            ) : (
              <ul className="space-y-4">
                {qrStickers.map(sticker => (
                    <div key={sticker.id} className="bg-white p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-medium mb-3 text-base">🗓️ {formatIndoDateTime(sticker.created_at)}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500">Jumlah QR</p>
                                        <p className="text-sm font-medium text-gray-700">{sticker.count_qr}</p>
                                    </div>

                                    <div className="text-left">
                                        <p className="text-xs text-gray-500">Aksi</p>
                                        <Link target='_blank' href={sticker.url_qr} className="text-purple-600 hover:text-purple-700">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <ArrowDownCircleIcon className="w-5 text-purple-600" />
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
              </ul>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
            onClick={() => router.push('/extinguisher/sticker/create')}
            className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        >
            <PlusIcon className="w-6 h-6 text-white" />
        </button>
      </MainLayout>
    </>
  );
}