'use client';

import { login } from '@/api/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPageInner() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath: string = searchParams.get('redirect') || '/home';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await toast.promise(
      (async () => {
        const res = await login(formData.email, formData.password);
        // Store JWT token to cookies
        if (res && res.token) {
          document.cookie = `token=${res.token}; path=/; secure; samesite=strict`;

          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }

          router.push(redirectPath);
        }
        return res;
      })(),
      {
        pending: 'Tunggu sebentar, sedang memproses...',
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
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
        <div className="w-full max-w-[320px] bg-white rounded-2xl p-6">
          <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Login</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Halo! Senang Anda kembali, kami sudah menunggu!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-[13px] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-gray-500 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                placeholder="example@gmail.com"
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-[13px] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full text-gray-500 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                  placeholder="••••••••••••••"
                  required
                  autoComplete="current-password"
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

            <div className="flex justify-end">
              <Link
                href="/reset_password"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium active:scale-95 transition-transform py-2"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px]"
            >
              Masuk
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
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-medium active:scale-95 transition-transform inline-block"
            >
              Daftar
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}