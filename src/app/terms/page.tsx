'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    return (
        <>
            <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
                <div className="w-full max-w-[320px] md:max-w-[520px] bg-white rounded-2xl p-6">
                    <h1 className="text-gray-900 text-xl font-bold text-center mb-4">Syarat & Ketentuan</h1>
                    <div className="text-gray-700 text-sm space-y-4">
                        <p>
                            Selamat datang di NEXA! Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan berikut:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                <strong>Penggunaan Data:</strong> Data inspeksi yang Anda masukkan akan digunakan untuk keperluan pencatatan, pelaporan, dan peningkatan layanan aplikasi.
                            </li>
                            <li>
                                <strong>Akses & Keamanan:</strong> Anda bertanggung jawab menjaga kerahasiaan akun dan sandi. Segala aktivitas yang terjadi melalui akun Anda menjadi tanggung jawab Anda sepenuhnya.
                            </li>
                            <li>
                                <strong>Kepemilikan Data:</strong> Data yang diinput tetap menjadi milik pengguna, namun aplikasi berhak mengelola data tersebut sesuai kebutuhan operasional dan pengembangan.
                            </li>
                            <li>
                                <strong>Pembatasan Tanggung Jawab:</strong> Kami tidak bertanggung jawab atas kerugian akibat penggunaan aplikasi ini di luar ketentuan yang berlaku.
                            </li>
                            <li>
                                <strong>Perubahan Ketentuan:</strong> Syarat dan ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
                            </li>
                        </ol>
                        <h2 className="text-gray-900 text-lg font-semibold mt-6 mb-2">Kebijakan Privasi</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Pengumpulan Data:</strong> Kami mengumpulkan data pribadi seperti nama, email, dan data inspeksi untuk keperluan autentikasi dan pelaporan.
                            </li>
                            <li>
                                <strong>Perlindungan Data:</strong> Data Anda disimpan dengan aman dan tidak dibagikan ke pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.
                            </li>
                            <li>
                                <strong>Hak Pengguna:</strong> Anda dapat meminta penghapusan atau perubahan data pribadi dengan menghubungi admin aplikasi.
                            </li>
                        </ul>
                        <p>
                            Dengan menggunakan aplikasi ini, Anda menyetujui syarat, ketentuan, dan kebijakan privasi yang berlaku.
                        </p>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all font-medium"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
