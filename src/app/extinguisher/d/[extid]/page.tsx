'use client';

import MainLayout from '@/app/components/main_layout';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getExtinguisherDetail, ExtinguisherDetail } from '../../../../api/extinguisher';
import { use } from 'react';

// temporary as response provide no example
type ExtinguisherHistoryItem = {
    id_inspection: number;
    no_jadwal: string;
    kode_barang: string;
    kode_customer: string;
    nama_customer: string;
    tanggal_cek: string;
    lokasi: string | null;
    barcode: string;
    type: string;
    brand: string;
    media: string;
    kapasitas: string;
    pressure: string;
    pressure_img: string | null;
    hose: string;
    hose_img: string | null;
    head_valve: string;
    head_valve_img: string | null;
    expired: string;
    expired_img: string | null;
    korosi: string;
    korosi_img: string | null;
    status: string;
    qc: string;
    created_at: string;
    updated_at: string;
    detail_pressure: string;
    detail_hose: string;
    detail_head_valve: string;
    detail_korosi: string;
    detail_expired: string;
};

export default function ExtinguisherDetailPage({ params }: { params: Promise<{ extid: string }> }) {
    const { extid } = use(params);
    const [extinguisher, setExtinguisher] = useState<ExtinguisherDetail | null>(null);
    const [history, setHistory] = useState<ExtinguisherHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!extid) return;
        async function fetchDetail() {
            try {
                setLoading(true);
                const detail = await getExtinguisherDetail(extid);
                setExtinguisher(detail.data);
                setHistory((detail.history as ExtinguisherHistoryItem[]) || []);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Gagal mengambil detail APAR');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [extid]);

    function formatIndoDate(dateStr: string) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    return (
        <MainLayout appBarTitle='APAR' showNavBar={false}>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 pt-24">
                {/* Loading/Error State */}
                {loading ? (
                    <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 mt-8 text-center animate-pulse text-gray-400">Memuat detail APAR...</div>
                ) : error ? (
                    <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 mt-8 text-center text-red-500">{error}</div>
                ) : extinguisher ? (
                    <>
                        {/* Extinguisher Icon */}
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                            <Image
                                width={40}
                                height={40}
                                src="/images/extinguisher.svg"
                                alt="Fire extinguisher"
                                className="object-cover"
                            />
                        </div>

                        {/* Extinguisher Info */}
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">{extinguisher.lokasi || '- - -'}</h1>
                        <h3 className="text-xl font-semibold text-gray-400 mb-1">{extinguisher.kode_barang}</h3>

                        {/* Extinguisher Details */}
                        <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-4 mt-8">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Brand</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.brand}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Media</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.media}</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Kapasitas</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.kapasitas} Kg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                                    <p className="text-base font-medium text-gray-900">{formatIndoDate(extinguisher.tgl_kadaluarsa)}</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Tipe</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Terakhir Inspeksi</p>
                                    <p className="text-base font-medium text-gray-900">{formatIndoDate(extinguisher.last_inspection || '')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full max-w-sm md:max-w-full space-y-3 mt-6">
                            <Link href={`/extinguisher/u/${extinguisher.kode_barang}`} className="block w-full bg-white border border-purple-600 text-purple-600 py-3 rounded-xl font-bold transition-colors text-center">
                                Edit APAR
                            </Link>
                            <Link href={`/extinguisher/placement/${extinguisher.id}`} className="block w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors text-center">
                                Ubah Penempatan APAR
                            </Link>
                        </div>

                        {/* Inspection History Log Display */}
                        <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-6 mt-8 mb-8">
                            <h2 className="text-lg font-semibold text-gray-900">Riwayat Inspeksi</h2>
                            {history.length > 0 ? (
                                history.map((log, index) => (
                                    <div key={index} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                                        {/* Adjust log fields as needed based on API response */}
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Tanggal: <span className="font-semibold text-gray-900">{formatIndoDate(log.created_at)}</span>
                                        </p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li><span className="font-medium">Pressure Gauge:</span> {log.detail_pressure}</li>
                                            <li><span className="font-medium">Kadaluarsa:</span> {log.detail_expired}</li>
                                            <li><span className="font-medium">Selang:</span> {log.detail_hose}</li>
                                            <li><span className="font-medium">Head Valve:</span> {log.detail_head_valve}</li>
                                            <li><span className="font-medium">Korosi:</span> {log.detail_korosi}</li>
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Belum ada riwayat inspeksi untuk APAR ini.</p>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </MainLayout>
    );
}