'use client'

import MainLayout from "@/app/components/main_layout";
import { useRouter } from 'next/navigation';
import { FormEvent } from "react";

export default function StickerCreatePage() {
    const router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push("/inspection/i/83180142903")
    }
    
    return <MainLayout appBarTitle="Inspeksi Baru" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Judul Agenda</label>
                        <input
                        type="text"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. Inspeksi Bulan Juni"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Mulai</label>
                        <input
                        type="datetime-local"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Selesai</label>
                        <input
                        type="datetime-local"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Catatan</label>
                        <textarea
                        name="name"
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
                            className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </MainLayout>;
}