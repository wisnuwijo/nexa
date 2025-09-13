'use client'

import MainLayout from "@/app/components/main_layout";
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from "react";
import { getLevelList, UserLevel, createUser } from '@/api/user';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateUsersPage() {
    const router = useRouter();
    const [levels, setLevels] = useState<UserLevel[]>([]);
    const [levelsLoading, setLevelsLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLevelsLoading(true);
        getLevelList()
            .then(data => setLevels(data))
            .catch(err => toast.error('Gagal mengambil daftar level: ' + (err instanceof Error ? err.message : 'Unknown error')))
            .finally(() => setLevelsLoading(false));
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password dan konfirmasi password tidak sama.");
            return;
        }

        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
        const username = (form.elements.namedItem('username') as HTMLInputElement)?.value;
        const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
        // selectedLevel and gender are from state

        setSubmitting(true);
        try {
            await createUser({
                name,
                username,
                email,
                password,
                level: selectedLevel,
                gender,
            });
            toast.success('User berhasil ditambahkan!');
            setTimeout(() => {
                router.push('/users');
            }, 2000);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Gagal menambahkan user.');
        } finally {
            setSubmitting(false);
        }
    };

    return <>
        <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <MainLayout appBarTitle="Buat Pengguna Baru" showNavBar={false}>
            <div className="min-h-screen bg-gray-50 relative">
                <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Nama</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. Michael William"
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. michael.william"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder="Ex. michael.william@mail.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Akses</label>
                            <select
                                name="level"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                value={selectedLevel}
                                onChange={e => setSelectedLevel(e.target.value)}
                                required
                                disabled={levelsLoading}
                            >
                                <option value="" disabled>{levelsLoading ? 'Memuat...' : 'Pilih akses'}</option>
                                {levels.map(level => (
                                    <option key={level.id} value={level.id}>{level.nama_level}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Jenis Kelamin</label>
                            <select
                                name="gender"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                required
                            >
                                <option value="">Pilih jenis kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder=""
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">Konfirmasi Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder=""
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">Password dan konfirmasi password tidak sama.</p>
                            )}
                        </div>

                        <div className="pt-12">
                            <button
                                type="submit"
                                className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4 disabled:bg-gray-300 disabled:text-gray-400"
                                disabled={password !== confirmPassword || !password || !confirmPassword || !selectedLevel || !gender || submitting}
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>;
    </>
}