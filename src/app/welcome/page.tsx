'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath:string = searchParams.get('redirect') || '/login';

    const [cameraPermissionChecked, setCameraPermissionChecked] = useState(false);

    useEffect(() => {
        // Check if the permission has already been checked
        const permissionChecked = document.cookie.includes('camera_permission_checked=true');
        if (permissionChecked) {
            // Redirect to the original destination
            router.push(redirectPath);
        }
    }, [redirectPath]);

    useEffect(() => {
        setTimeout(() => {
            setCameraPermissionChecked(!cameraPermissionChecked);
        }, 900); // Delay for 900ms before checking the permission to avoid flickering on the screen when the permission is not checked yet
    }, []);

    const checkCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            
            // Set permission checked cookie
            document.cookie = `camera_permission_checked=true;max-age=${60 * 60 * 24 * 7};path=/`;
            
            // Redirect to the original destination
            router.push(redirectPath);
        } catch (error) {
            console.error('Camera permission denied:', error);
            // Handle denied permission - you might want to show an error message
        }
    };

    return cameraPermissionChecked ? (
        <main className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-0">
            <div className="flex min-h-screen w-full max-w-[430px] mx-auto flex-col items-center justify-center px-6 py-8 bg-white">
            <div className="w-full max-w-sm space-y-12">
                {/* Location Icon */}
                <div className="relative w-full flex justify-center">
                    {/* Circular image container with purple border */}
                    <div className="relative w-72 h-48 overflow-hidden">
                        <Image
                        src="/images/camera.svg"
                        alt="Car cleaning service"
                        fill
                        className="object-cover"
                        priority
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Akses Kamera Diperlukan
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Izinkan aplikasi mengakses kamera untuk memindai QR code atau mengambil foto dokumen.
                </p>
                </div>

                {/* Buttons */}
                {/* CTA Buttons */}
                <div className="w-full space-y-4 mt-8">
                    {/* Fixed bottom button */}
                    <div className="fixed bottom-10 left-0 right-0 max-w-[430px] mx-auto px-6">
                    <button 
                        onClick={checkCameraPermission}
                        className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px]"
                    >
                        Ijinkan
                    </button>

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

            </div>
            </div>
        </main>
    ) : (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}