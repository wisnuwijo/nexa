"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/main_layout';

// Simulate fetching/saving letterhead from localStorage (replace with API as needed)
function getStoredLetterhead(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('letterhead');
    }
    return null;
}
function setStoredLetterhead(dataUrl: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('letterhead', dataUrl);
    }
}

export default function LetterheadPage() {
    const router = useRouter();
    const [letterhead, setLetterhead] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLetterhead(getStoredLetterhead());
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (letterhead) {
            setStoredLetterhead(letterhead);
        }
        // TODO: Replace with API call to save letterhead
        router.back();
    };

    return (
        <MainLayout appBarTitle="Ubah KOP PDF" showNavBar={true}>
            <div className="mx-auto pt-20 max-w-[430px] md:max-w-full px-4 pb-24">
                <form className="bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSave}>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Ubah KOP PDF</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-full max-w-xs h-32 rounded-lg overflow-hidden border-4 border-white shadow bg-gray-100 flex items-center justify-center">
                            {letterhead ? (
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
                        />
                        <button
                            type="button"
                            className="bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Pilih KOP
                        </button>
                        <p className='text-center'>
                            <span className="text-xs text-gray-500">Format gambar sebaiknya PNG/JPG, rasio horizontal (misal: 1200x300px).</span>
                        </p>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
