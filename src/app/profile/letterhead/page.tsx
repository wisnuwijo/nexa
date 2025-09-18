"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/main_layout';
import { uploadLetterhead, getLetterheadSettings } from '@/api/report';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LetterheadPage() {
    const router = useRouter();
    const [letterhead, setLetterhead] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoading(true);
        getLetterheadSettings('inspection')
            .then(settings => {
                if (settings.length > 0) {
                    setLetterhead(settings[0].image_url);
                }
            })
            .catch(err => {
                toast.error(err.message || 'Gagal memuat KOP surat saat ini.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar.');
                return;
            }
            setFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLetterhead(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('Pilih file gambar terlebih dahulu.');
            return;
        }

        setIsSaving(true);
        const toastId = toast.loading("Mengunggah KOP surat...");
        try {
            // Call the upload function for both types
            await Promise.all([
                uploadLetterhead(file, 'inspection'),
                uploadLetterhead(file, 'inventory')
            ]);

            toast.update(toastId, { render: "KOP surat berhasil diperbarui!", type: "success", isLoading: false, autoClose: 3000 });
            setTimeout(() => router.back(), 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal mengunggah KOP surat.";
            toast.update(toastId, { render: message, type: "error", isLoading: false, autoClose: 5000 });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout appBarTitle="Ubah KOP PDF" showNavBar={true}>
            <ToastContainer position="top-center" />
            <div className="mx-auto pt-20 max-w-[430px] md:max-w-full px-4 pb-24">
                <form className="bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSave}>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Ubah KOP PDF</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-full max-w-xs h-32 rounded-lg overflow-hidden border-4 border-white shadow bg-gray-100 flex items-center justify-center">
                            {loading ? (
                                <span className="text-sm text-gray-400">Memuat KOP surat...</span>
                            ) : letterhead ? (
                                <img
                                    src={letterhead}
                                    alt="Letterhead Preview"
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <span className="text-base text-gray-400 text-center">Belum ada KOP PDF yang diunggah.<br/>Unggah gambar KOP PDF untuk digunakan pada laporan PDF.</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={isSaving}
                        />
                        <button
                            type="button"
                            className="bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSaving}
                        >
                            Pilih KOP
                        </button>
                        <p className='text-center'>
                            <span className="text-xs text-gray-500">Format gambar sebaiknya PNG/JPG, rasio horizontal (misal: 1200x300px).</span>
                        </p>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center disabled:opacity-60" disabled={isSaving}>
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
