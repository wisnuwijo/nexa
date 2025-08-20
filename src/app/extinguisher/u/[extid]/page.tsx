'use client';

import { ExtinguisherDetail, getExtinguisherDetail } from "@/api/extinguisher";
import MainLayout from "@/app/components/main_layout";
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ExtinguisherUpdateDataPage({ params }: { params: Promise<{ extid: string }> }) {
    const { extid } = use(params);
    const router = useRouter();
    const [extinguisher, setExtinguisher] = useState<ExtinguisherDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!extid) return;
        async function fetchDetail() {
            try {
                setLoading(true);
                const detail = await getExtinguisherDetail(extid);
                setExtinguisher(detail.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Gagal mengambil detail APAR');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [extid]);
    
    return <MainLayout appBarTitle="Ubah Data APAR" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            {/* Loading/Error State */}
            {loading ? (
                <div className="bg-white rounded-xl p-6 mt-8 text-center animate-pulse text-gray-400 max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">Memuat detail APAR...</div>
            ) : error ? (
                <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 mt-8 text-center text-red-500">{error}</div>
            ) : extinguisher ? (
                <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);
                        setError(null);
                        const { updateExtinguisher } = await import('@/api/extinguisher');
                        const params = {
                            id: String(extinguisher.id),
                            deskripsi: extinguisher.deskripsi || '',
                            brand: extinguisher.brand || '',
                            type: extinguisher.type || '',
                            media: extinguisher.media || '',
                            kapasitas: extinguisher.kapasitas || '',
                            tanggal_produksi: extinguisher.tgl_produksi || '',
                            tanggal_kadaluarsa: extinguisher.tgl_kadaluarsa || '',
                            lokasi: extinguisher.lokasi || '',
                            titik_penempatan_id: extinguisher.titik_penempatan_id || '',
                        };
                        
                        try {
                            const result = await updateExtinguisher(params);
                            toast.dismiss();
                            toast.success(result.message || 'Berhasil menyimpan perubahan.');
                            setTimeout(() => {
                                router.back();
                            }, 2200);
                        } catch (err) {
                            toast.dismiss();
                            if (err instanceof Error) {
                                toast.error(err.message);
                            } else {
                                toast.error('Gagal menyimpan perubahan.');
                            }
                        }
                        setSaving(false);
                    }}>
                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={extinguisher.brand}
                                onChange={(e) => setExtinguisher({ ...extinguisher, brand: e.target.value })}
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. Tanexa"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Media</label>
                            <input
                                type="text"
                                name="media"
                                value={extinguisher.media}
                                onChange={(e) => setExtinguisher({ ...extinguisher, media: e.target.value })}
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. Powder"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Tipe APAR</label>
                            <input
                                type="text"
                                name="type"
                                value={extinguisher.type}
                                onChange={(e) => setExtinguisher({ ...extinguisher, type: e.target.value })}
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. TP5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Kapasitas (Kg)</label>
                            <input
                                type="number"
                                name="kapasitas"
                                value={extinguisher.kapasitas}
                                onChange={(e) => setExtinguisher({ ...extinguisher, kapasitas: e.target.value })}
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. 5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Tgl Kadaluarsa</label>
                            <input
                                type="date"
                                name="tgl_kadaluarsa"
                                value={extinguisher.tgl_kadaluarsa}
                                onChange={(e) => setExtinguisher({ ...extinguisher, tgl_kadaluarsa: e.target.value })}
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. 5"
                                required
                            />
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className={`w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    </MainLayout>;
}