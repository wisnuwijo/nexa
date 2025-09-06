"use client";

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/main_layout';

export default function EditAvatarPage() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // For cropping (simple center crop preview, not actual crop logic)
    const [crop, setCrop] = useState({ x: 0, y: 0, size: 100 });

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
                setImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Upload/crop logic here
        // For now, just go back
        console.log('Saving avatar...', { file, crop });
        router.back();
    };

    return (
        <MainLayout appBarTitle="Ubah Foto Profil" showNavBar={true}>
            <div className="mx-auto pt-20 max-w-[430px] md:max-w-full px-4 pb-24">
                <form className="bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSave}>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Ubah Foto Profil</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow bg-gray-100 flex items-center justify-center">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                    style={{ objectPosition: `${crop.x}% ${crop.y}%` }}
                                />
                            ) : (
                                <span className="text-5xl text-gray-300">👤</span>
                            )}
                            {/* Crop overlay (visual only) */}
                            {image && (
                                <div className="absolute inset-0 border-2 border-purple-500 pointer-events-none rounded-full"></div>
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
                            Pilih Foto
                        </button>
                        <p className='text-center'>
                            <span className="text-xs text-gray-500">Anda dapat mengatur area potong foto menggunakan kontrol di bawah ini.</span>
                        </p>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        {/* Simple crop controls (move preview area) */}
                        {image && (
                            <div className="flex gap-2 items-center mt-2">
                                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setCrop(c => ({ ...c, y: Math.max(0, c.y - 10) }))}>⬆️</button>
                                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setCrop(c => ({ ...c, y: Math.min(100, c.y + 10) }))}>⬇️</button>
                                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setCrop(c => ({ ...c, x: Math.max(0, c.x - 10) }))}>⬅️</button>
                                <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setCrop(c => ({ ...c, x: Math.min(100, c.x + 10) }))}>➡️</button>
                            </div>
                        )}
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                            Simpan Foto
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
