"use client";

import { getCurrentUser } from '@/api/auth';
import { updateUserProfilePicture } from '@/api/user';
import MainLayout from '@/app/components/main_layout';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditAvatarPage() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get userId from localStorage
    const userId = getCurrentUser()?.id?.toString() || null;

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setImage(currentUser.image);
        }
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
                setImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Pilih file gambar terlebih dahulu.');
            toast.error('Pilih file gambar terlebih dahulu.');
            return;
        }
        if (!userId) {
            setError('User ID tidak ditemukan.');
            toast.error('User ID tidak ditemukan.');
            return;
        }
        setUploading(true);
        try {
            const response = await updateUserProfilePicture(userId, file);
            const currentUser = getCurrentUser();
            if (currentUser) {
                // The response.data contains the full updated user object.
                // We can use it to update the user data in localStorage.
                currentUser.image = response.data.image;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
            toast.success('Foto profil berhasil diperbarui!');
            setTimeout(() => router.back(), 2000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Gagal memperbarui foto profil.';
            setError(msg);
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <MainLayout appBarTitle="Ubah Foto Profil" showNavBar={true}>
            <ToastContainer position="top-center" autoClose={4000} />
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
                            disabled={uploading}
                        />
                        <button
                            type="button"
                            className="bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            Pilih Foto
                        </button>
                        <div>
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center disabled:bg-gray-300 disabled:text-gray-400" disabled={uploading}>
                            {uploading ? 'Menyimpan...' : 'Simpan Foto'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
