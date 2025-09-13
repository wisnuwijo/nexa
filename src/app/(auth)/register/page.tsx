'use client';

import { login, register, RegisterParams } from '@/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterParams>({
    gender: '',
    name: '',
    username: '',
    email: '',
    password: '',
    konfirmasi_password: '',
    telpon: '',
    nama_organisasi: '',
    jenis_customer: '',
    alamat: '',
    email_organisasi: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error('Anda harus menyetujui Syarat & Ketentuan sebelum mendaftar');
      return;
    }
    if (formData.password !== formData.konfirmasi_password) {
      toast.error('Kata sandi dan konfirmasi sandi harus sama');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      await toast.promise(
        (async () => {
          const res = await login(formData.email, formData.password);

          setTimeout(() => {
            // Simulate a delay for processing
            if (res && res.token) {
              localStorage.setItem('user', JSON.stringify(res.user));
              document.cookie = `token=${res.token}; path=/; secure; samesite=strict`;
              router.push('/home');
            }
          }, 1000);
          return res;
        })(),
        {
          pending: 'Registrasi berhasil! Memproses...',
          success: 'Berhasil masuk',
          error: {
            render({ data }) {
              let message = 'Terjadi kesalahan saat login. Silakan coba lagi.';
              if (typeof data === 'string') {
                message = data;
              } else if (data instanceof Error) {
                message = data.message;
              }
              return <p>{message}</p>;
            }
          }
        }
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Registrasi gagal. Silakan coba lagi.');
      } else if (typeof err === 'string') {
        toast.error(err || 'Registrasi gagal. Silakan coba lagi.');
      } else {
        toast.error('Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
      <div className="w-full max-w-[320px] bg-white rounded-2xl p-6">

        <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

        <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Buat Akun</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Isi informasi Anda di bawah ini untuk membuat akun.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Nama</label>
            <input
              type="text"
              value={formData.name}
              name='name'
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. John"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Username</label>
            <input
              type="text"
              value={formData.username}
              name='username'
              pattern="^[a-zA-Z0-9]+$"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {
                  setFormData(prev => ({ ...prev, username: value }));
                }
              }}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. john.doe"
              required
              title="Username hanya boleh berisi huruf dan angka"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              name='email'
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. contoh@mail.com"
              required
              inputMode="email"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Telepon</label>
            <input
              type="number"
              value={formData.telpon}
              name='telepon'
              onChange={(e) => setFormData(prev => ({ ...prev, telpon: e.target.value }))}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. +628383838383"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Jenis Organisasi</label>
            <select name="organization" value={formData.jenis_customer} onChange={(val) => {
              setFormData(prev => ({ ...prev, jenis_customer: val.target.value }));
            }} required className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]">
              <option value="">Jenis organisasi</option>
              <option value="COMPANY">Perusahaan</option>
              <option value="PERSONAL">Perseorangan</option>
            </select>
          </div>

          {
            formData.jenis_customer != "PERSONAL" && <div>
              <label className="block text-gray-600 text-[13px] mb-1.5">Nama Organisasi</label>
              <input
                type="text"
                value={formData.nama_organisasi}
                name='nama_organisasi'
                onChange={(e) => setFormData(prev => ({ ...prev, nama_organisasi: e.target.value }))}
                className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                placeholder="Ex. PT. Sejahtera Selalu"
                required
              />
            </div>
          }

          {
            formData.jenis_customer != "PERSONAL" && <div>
              <label className="block text-gray-600 text-[13px] mb-1.5">Email Organisasi</label>
              <input
                type="email"
                value={formData.email_organisasi}
                name='email_organisasi'
                onChange={(e) => setFormData(prev => ({ ...prev, email_organisasi: e.target.value }))}
                className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                placeholder="Ex. contoh@mail.com"
                required
                inputMode="email"
              />
            </div>
          }

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Alamat</label>
            <input
              type="text"
              value={formData.alamat}
              name='alamat'
              onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. Jl. Soekarno-Hatta Jakarta"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Gender</label>
            <select onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} name="organization" id="" className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]">
              <option value="">Pilih gender</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Kata sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                name='password'
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                placeholder="••••••••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Konfirmasi sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.konfirmasi_password}
                name='konfirmasi_password'
                onChange={(e) => setFormData(prev => ({ ...prev, konfirmasi_password: e.target.value }))}
                className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                placeholder="••••••••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Menyetujui {' '}
              <Link href="/terms" target='_blank' className="text-purple-600 hover:text-purple-700 font-medium">
                Syarat & Ketentuan
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="text-gray-600 w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-"
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {isSubmitting ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-700 font-medium active:scale-95 transition-transform inline-block"
          >
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}