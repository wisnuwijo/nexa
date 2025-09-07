'use client';

import { addProduct } from '@/api/extinguisher';
import AdminLayout from "@/app/components/admin_layout";
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ExtinguisherCreatePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        media: '',
        type: '',
        kapasitas: '',
        tanggal_produksi: '',
        tanggal_kadaluarsa: '',
        deskripsi: '',
        jumlah: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await addProduct({
                deskripsi: formData.deskripsi,
                brand: formData.brand,
                type: formData.type,
                media: formData.media,
                jumlah: formData.jumlah,
                kapasitas: formData.kapasitas,
                tanggal_produksi: formData.tanggal_produksi,
                tanggal_kadaluarsa: formData.tanggal_kadaluarsa
            });
            
            toast.success('Produk berhasil dibuat! QR Stiker sedang diproses.');
            setTimeout(() => {
                router.push('/extinguisher/sticker');
            }, 2000);

            // Reset form after successful creation
            setFormData({
                brand: '',
                media: '',
                type: '',
                kapasitas: '',
                tanggal_produksi: '',
                tanggal_kadaluarsa: '',
                deskripsi: '',
                jumlah: ''
            });
            
        } catch (err) {
            const errorMessage = typeof err === 'string'
                ? err
                : err instanceof Error
                    ? err.message
                    : 'Terjadi kesalahan saat membuat produk.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return <>
        <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <AdminLayout appBarTitle="Buat Tabung APAR" showNavBar={false}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                    {/* Header */}
                    <div className="flex justify-between items-center py-6 pt-20">
                        <div>
                            <p className="text-gray-500 text-sm mt-1">Data yang di entri dalam form berikut akan disimpan ke dalam stiker QR.</p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Brand</label>
                            <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. Tanexa"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Media</label>
                            <input
                            type="text"
                            name="media"
                            value={formData.media}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. Powder"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Tipe</label>
                            <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. ABC"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Kapasitas (Kg)</label>
                            <input
                            type="number"
                            name="kapasitas"
                            value={formData.kapasitas}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. 5"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Tgl Produksi</label>
                            <input
                            type="date"
                            name="tanggal_produksi"
                            value={formData.tanggal_produksi}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Tgl Kadaluarsa</label>
                            <input
                            type="date"
                            name="tanggal_kadaluarsa"
                            value={formData.tanggal_kadaluarsa}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Client (Opsional)</label>
                            <select
                                name="client"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                required
                            >
                                <option value="">- - -</option>
                                <option value="Client A">Client A</option>
                                <option value="Client B">Client B</option>
                                <option value="Client C">Client C</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Deskripsi</label>
                            <textarea
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. Alat pemadam api untuk area kantor"
                            rows={3}
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Jumlah QR</label>
                            <input
                            type="number"
                            name="jumlah"
                            min={1}
                            value={formData.jumlah}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. 100"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div className="pt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Memproses...' : 'Generate QR APAR'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    </>;
}