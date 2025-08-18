'use client'

import MainLayout from "@/app/components/main_layout";
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import { addInspection } from '@/api/schedule';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from "@/api/auth";

export default function StickerCreatePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        inspeksi_title: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        keterangan: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);
        
        try {
            // Convert datetime-local to date format (YYYY-MM-DD)
            const tanggal_mulai = formData.tanggal_mulai ? formData.tanggal_mulai.split('T')[0] : '';
            const tanggal_selesai = formData.tanggal_selesai ? formData.tanggal_selesai.split('T')[0] : '';
            const currentUser = getCurrentUser()
            const currentUserID = currentUser?.id || '1'; // Fallback to '1' if no user is found

            await addInspection({
                inspeksi_title: formData.inspeksi_title,
                inspeksi_pic: currentUserID.toString(),
                keterangan: formData.keterangan,
                tanggal_mulai: tanggal_mulai,
                tanggal_selesai: tanggal_selesai
            });
            
            toast.success('Inspeksi berhasil dibuat!');
            
            // Navigate to inspection details or list after successful creation
            setTimeout(() => {
                router.push('/inspection/i/83180142903');
            }, 2000);
            
        } catch (err) {
            const errorMessage = typeof err === 'string'
                ? err
                : err instanceof Error
                    ? err.message
                    : 'Terjadi kesalahan saat membuat inspeksi.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return <>
        <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <MainLayout appBarTitle="Inspeksi Baru" showNavBar={false}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Judul Agenda</label>
                            <input
                            type="text"
                            name="inspeksi_title"
                            value={formData.inspeksi_title}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. Inspeksi Bulan Juni"
                            required
                            autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Mulai</label>
                            <input
                            type="datetime-local"
                            name="tanggal_mulai"
                            value={formData.tanggal_mulai}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Selesai</label>
                            <input
                            type="datetime-local"
                            name="tanggal_selesai"
                            value={formData.tanggal_selesai}
                            onChange={handleChange}
                            className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Catatan</label>
                            <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                            placeholder="Ex. Inspeksi area gedung A"
                            required
                            rows={3}
                            autoComplete="off"
                            />
                        </div>

                        <div className="pt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    </>;
}