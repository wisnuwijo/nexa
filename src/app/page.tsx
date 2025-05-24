'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
      <div className="flex min-h-screen w-full max-w-[430px] mx-auto flex-col items-center px-6 py-8 bg-white relative">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -z-10 blur-3xl opacity-30" />
        <div className="absolute top-20 left-0 w-32 h-32 bg-purple-100 rounded-full -z-10 blur-3xl opacity-30" />
        
        {/* Main content */}
        <main className="flex flex-col items-center w-full mt-12 space-y-8">
          {/* Circular image container with purple border */}
          <div className="relative w-72 h-72 overflow-hidden">
            <Image
              src="/images/welcome.svg"
              alt="Car cleaning service"
              fill
              className="object-cover"
              priority
            />
          </div>

        {/* Text content */}
        <div className="text-center space-y-4">
          <h1 className="text-gray-900 text-2xl font-semibold">
            Selamat Datang di <span className="text-purple-600">NEXA</span>!
          </h1>
          <p className="text-gray-500 text-sm px-4">
            Pantau, periksa, dan kelola alat pemadam Anda dalam satu aplikasi.
          </p>
        </div>

          {/* CTA Buttons */}
          <div className="w-full space-y-4 mt-8">
            {/* Fixed bottom button */}
            <div className="fixed bottom-10 left-0 right-0 max-w-[430px] mx-auto px-6">
              <Link 
                href="/welcome" 
                className="block w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] text-center leading-[48px]"
              >
                Mulai
              </Link>

              <p className="mt-8 text-center text-gray-600 text-sm">
                NEXA by{' '}
                <Link 
                  href="https://tananugrahsejahtera.com/" 
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700 font-medium active:scale-95 transition-transform inline-block"
                >
                  PT Tan Anugrah Sejahtera
                </Link>
              </p>
            </div>
          </div>

        </main>
      </div>
    </main>
  );
}
