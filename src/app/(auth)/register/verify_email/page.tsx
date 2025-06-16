'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
      <div className="w-full max-w-[320px] bg-white rounded-2xl p-6">
        <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Verifikasi Email</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Masukkan kode verifikasi yang kami kirimkan ke email Anda.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-yellow-700">
              Apabila tidak menerima email, mohon cek folder spam.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Kode verifikasi</label>
            <div className="flex gap-4">
              <input
                type="text"
                maxLength={1}
                name="code1"
                // value={formData.code1}
                onChange={handleChange}
                className="text-gray-600 w-12 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px] text-center"
                required
              />
              <input
                type="text"
                maxLength={1}
                name="code2"
                // value={formData.code2}
                onChange={handleChange}
                className="text-gray-600 w-12 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px] text-center"
                required
              />
              <input
                type="text"
                maxLength={1}
                name="code3"
                // value={formData.code3}
                onChange={handleChange}
                className="text-gray-600 w-12 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px] text-center"
                required
              />
              <input
                type="text"
                maxLength={1}
                name="code4"
                // value={formData.code4}
                onChange={handleChange}
                className="text-gray-600 w-12 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px] text-center"
                required
              />
              <input
                type="text"
                maxLength={1}
                name="code5"
                // value={formData.code5}
                onChange={handleChange}
                className="text-gray-600 w-12 h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px] text-center"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={() => router.push('/')}
            className="text-gray-600 w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-"
          >
            Verifikasi
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