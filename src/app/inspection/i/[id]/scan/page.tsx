"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function QrScannerPage() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
    const router = useRouter();
    const pathname = usePathname();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const startedRef = useRef(false);
    const streamRef = useRef<MediaStream | null>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const qrRegionId = "reader";

    // Hard kill: stop html5-qrcode and any stray MediaStreams/videos
    const hardStop = async () => {
        try {
            if (scannerRef.current && startedRef.current) {
                try {
                    await scannerRef.current.stop();
                } catch (e) {
                    console.warn("stop() error:", e);
                }
                try {
                    await scannerRef.current.clear();
                } catch (e) {
                    console.warn("clear() error:", e);
                }
            }

            // Stop the stream we captured from the <video> (if any)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }

            // As a final safety: stop ALL <video> elements’ streams
            document.querySelectorAll("video").forEach((v) => {
                const s = v.srcObject as MediaStream | null;
                if (s) {
                    s.getTracks().forEach((t) => t.stop());
                }
                // fully detach & pause
                try {
                    v.pause();
                } catch { }
                try {
                    v.srcObject = null;
                } catch { }
                v.removeAttribute("src");
                try {
                    v.load();
                } catch { }
            });

            // Empty the container to avoid re-init conflicts
            const elem = document.getElementById(qrRegionId);
            if (elem) elem.innerHTML = "";

        } finally {
            scannerRef.current = null;
            startedRef.current = false;
        }
    };

    useEffect(() => {
        let cancelled = false;

        const start = async () => {
            if (startedRef.current || cancelled) return;

            // Watch for the internal <video> so we can grab its MediaStream
            const container = document.getElementById(qrRegionId);
            if (container && !observerRef.current) {
                observerRef.current = new MutationObserver(() => {
                    const v = container.querySelector("video") as HTMLVideoElement | null;
                    const s = v?.srcObject as MediaStream | null;
                    if (s && s !== streamRef.current) {
                        streamRef.current = s;
                    }
                });
                observerRef.current.observe(container, { childList: true, subtree: true });
            }

            try {
                const instance = new Html5Qrcode(qrRegionId);
                scannerRef.current = instance;

                await instance.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (text) => {
                        console.log("✅ QR:", text);
                        const encoded = btoa(unescape(encodeURIComponent(text)));
                        router.push(`/inspection/i/${id}/${encoded}`);
                    },
                    () => { } // suppress noisy frame errors
                );

                if (!cancelled) {
                    startedRef.current = true;
                    console.log("Scanner started");
                } else {
                    // If effect is already cleaning up, stop immediately
                    await hardStop();
                }
            } catch (e) {
                console.error("start() failed:", e);
                // If start fails, ensure we’re fully stopped
                await hardStop();
            }
        };

        // Start when this page is active
        start();

        // Stop on visibility change / page hide / unload
        const onHidden = () => {
            if (document.hidden) hardStop();
        };
        const onPageHide = () => hardStop();
        const onBeforeUnload = () => hardStop();

        document.addEventListener("visibilitychange", onHidden);
        window.addEventListener("pagehide", onPageHide);
        window.addEventListener("beforeunload", onBeforeUnload);

        // Cleanup on unmount or route change
        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", onHidden);
            window.removeEventListener("pagehide", onPageHide);
            window.removeEventListener("beforeunload", onBeforeUnload);

            observerRef.current?.disconnect();
            observerRef.current = null;

            // Do a hard stop. No need to await — but you can if you want to be extra safe.
            void hardStop();
        };
        // Re-run only when entering/leaving this route
    }, [pathname]);

    return (
        <div key={pathname} className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col items-center relative">
                <button
                    className="absolute top-4 left-4 bg-purple-100 text-purple-700 rounded-full p-2 shadow hover:bg-purple-200 transition-colors"
                    onClick={() => router.back()}
                    aria-label="Kembali"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-purple-700 mb-2">QR Scan</h1>
                <h3 className="text-base text-gray-600 mb-4">Arahkan kamera ke QR Code</h3>
                <div className="relative flex items-center justify-center w-full" style={{ maxWidth: 400 }}>
                    <div id={qrRegionId} className="rounded-lg overflow-hidden border-2 border-purple-200 w-full" style={{ height: 320, background: '#f9f9fb' }} />
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
                        <div className="border-4 border-purple-500 rounded-lg" style={{ width: 220, height: 220 }} />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Pastikan QR berada di dalam kotak ungu</p>
            </div>
        </div>
    );
}
