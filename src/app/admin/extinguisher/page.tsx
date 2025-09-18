'use client';

import { getQrStickerListSuperAdmin, QrBatchSuperAdmin, updateBatchOwner } from '@/api/extinguisher';
import AdminLayout from '@/app/components/admin_layout';
import { ArrowDownCircleIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCustomerList, Customer } from '@/api/customer';

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

export default function ExtinguisherPage() {
    const router = useRouter();
    const [qrBatches, setQrBatches] = useState<QrBatchSuperAdmin[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingStates, setSavingStates] = useState<Record<number, boolean>>({});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [batchData, customerData] = await Promise.all([
                    getQrStickerListSuperAdmin(),
                    getCustomerList()
                ]);
                setQrBatches(batchData);
                setCustomers(customerData);
                // Initialize selected customers from the fetched batch data
                const initialSelected: Record<number, string> = {};
                batchData.forEach(batch => {
                    if (batch.kode_customer) initialSelected[batch.id] = batch.kode_customer;
                });
                setSelectedCustomers(initialSelected);
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
        fetchData();
    }, []);

    const handleCustomerChange = (batchId: number, customerCode: string) => {
        setSelectedCustomers(prev => ({
            ...prev,
            [batchId]: customerCode,
        }));
    };

    const handleUpdateOwner = async (batchId: number, batchCode: string) => {
        const customerCode = selectedCustomers[batchId];
        if (!customerCode) {
            toast.warn("Silakan pilih client terlebih dahulu.");
            return;
        }

        setSavingStates(prev => ({ ...prev, [batchId]: true }));
        try {
            await updateBatchOwner({ batch: batchCode, kode_customer: customerCode });
            toast.success("Client berhasil ditetapkan untuk batch ini.");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memperbarui pemilik batch.";
            toast.error(message);
        } finally {
            setSavingStates(prev => ({ ...prev, [batchId]: false }));
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <AdminLayout appBarTitle="Produksi APAR" showNavBar={false}>
                <div className="min-h-screen bg-gray-50 relative">
                    <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Daftar Produksi APAR</h2>
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
                        ) : qrBatches.length === 0 ? (
                            <div className="text-center text-gray-500">Tidak ada data QR stiker ditemukan.</div>
                        ) : (
                            <ul className="space-y-4">
                                {qrBatches.map(batch => (
                                    <div key={batch.id} className="bg-white p-4 rounded-2xl shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-gray-900 font-medium mb-3 text-base">🗓️ {formatIndoDateTime(batch.created_at)} ({batch.count_qr} tabung)</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Client</p>
                                                        <div className='grid grid-cols-3 gap-2 border border-gray-200 rounded-lg p-2 mt-1 h-[46px]'>
                                                            <div className='col-span-2'>
                                                                <select
                                                                    value={selectedCustomers[batch.id] || ""}
                                                                    onChange={(e) => handleCustomerChange(batch.id, e.target.value)}
                                                                    className="text-sm font-medium text-gray-700 bg-gray-100 rounded px-2 py-1 mt-1 w-full"
                                                                    disabled={savingStates[batch.id]}
                                                                >
                                                                    <option value="">- Pilih Client -</option>
                                                                    {customers.map(customer => (
                                                                        <option key={customer.id_customer} value={customer.kode_customer}>{customer.nama_customer}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-span-1'>
                                                                <div className="bg-green-50 p-1 rounded-lg flex text-center justify-center w-full h-full">
                                                                    <button onClick={() => handleUpdateOwner(batch.id, batch.batch)} className="text-black disabled:opacity-50 disabled:cursor-not-allowed" disabled={savingStates[batch.id]}>
                                                                        {savingStates[batch.id]
                                                                            ? <span className='text-xs'>Menyimpan...</span>
                                                                            : <><CheckCircleIcon className="w-5 text-green-600 inline-block mr-1" /> Simpan</>}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-500">Aksi</p>
                                                        <div className='border border-gray-200 rounded-lg p-2 mt-1 h-[46px]'>
                                                            <Link target='_blank' href={batch.download_qr_url} className="text-purple-600 hover:text-purple-700 mt-1">
                                                                <table>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <ArrowDownCircleIcon className="w-5 text-green-600" />
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
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => router.push('/admin/extinguisher/create')}
                    className="fixed right-[5%] bottom-20 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                >
                    <PlusIcon className="w-6 h-6 text-white" />
                </button>
            </AdminLayout>
        </>
    );
}