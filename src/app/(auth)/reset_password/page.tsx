'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
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
        <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Reset Kata Sandi</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Masukkan email yang terdaftar untuk reset kata sandi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-600 text-[13px] mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-gray-600 w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
              placeholder="Ex. example@example.com"
              required
            />
          </div>

          <button
            type="submit"
            onClick={() => router.push('/reset_password/verify_email')}
            className="text-gray-600 w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-"
          >
            Reset
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
          Ingat kata sandi?{' '}
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