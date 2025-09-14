'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyOtp, resetPassword } from '@/api/auth';

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan coba lagi dari halaman reset password.");
      router.push('/reset_password');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await resetPassword(email);
      toast.success('Email verifikasi telah dikirim ulang.');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim ulang email.';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (otp.length !== 6) {
      toast.error('Kode verifikasi harus 6 digit.');
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyOtp(email, otp);
      toast.success('Verifikasi berhasil! Anda akan diarahkan untuk mengubah kata sandi.');
      setTimeout(() => {
        router.push(`/reset_password/change?email=${email}&code=${otp}`);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verifikasi gagal.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[320px] bg-white rounded-2xl p-6">
      <h1 className="text-gray-900 text-xl font-bold text-center mb-2">Verifikasi Email</h1>
      <p className="text-gray-500 text-center text-sm mb-6">
        Masukkan 6 digit kode verifikasi yang kami kirimkan ke <span className="font-medium text-gray-700">{email}</span>.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="ml-3 text-sm text-yellow-700">
            Kode berlaku selama 1 menit. Apabila tidak menerima email, mohon cek folder spam.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-[13px] mb-1.5">Kode verifikasi</label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            className="w-full text-center tracking-[0.5em] text-2xl text-gray-500 font-mono bg-gray-100 border border-gray-200 rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500"
            placeholder="------"
            required
            autoComplete="one-time-code"
            inputMode="numeric"
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-purple-600 hover:underline font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Mengirim ulang...' : 'Kirim ulang kode'}
            </button>
          ) : (
            <p>Kirim ulang kode dalam {timer} detik</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] disabled:opacity-60"
        >
          {isSubmitting ? 'Memverifikasi...' : 'Verifikasi'}
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
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
        <ToastContainer />
        <VerifyEmailInner />
      </main>
    </Suspense>
  );
}