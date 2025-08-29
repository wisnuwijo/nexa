'use client';

import MainLayout from '@/app/components/main_layout';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ArrowDownCircleIcon, PlayCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getInspectionScheduleDetail, getInspectionDownloadLink, getQuotationPrice, getQuotationDownloadLink, InspectionScheduleDetailResponse } from '@/api/schedule';

export default function InspectionDetailPage() {
    const params = useParams();
    const extid = typeof params?.extid === 'string' ? params.extid : Array.isArray(params?.extid) ? params.extid[0] : '';
    const [detail, setDetail] = useState<InspectionScheduleDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [quotation, setQuotation] = useState<string>('');
    const [quotationLoading, setQuotationLoading] = useState(false);
    const [quotationError, setQuotationError] = useState<string | null>(null);
    const [quotationDownloadLoading, setQuotationDownloadLoading] = useState(false);
    const [quotationDownloadError, setQuotationDownloadError] = useState<string | null>(null);
    
    const handleDownloadQuotation = async () => {
        if (quotationDownloadLoading) return;
        setQuotationDownloadLoading(true);
        setQuotationDownloadError(null);
        try {
            const res = await getQuotationDownloadLink(extid);
            if (res?.download_url) {
                window.open(res.download_url, "_blank");
            } else {
                setQuotationDownloadError("Gagal mendapatkan link unduhan penawaran.");
            }
        } catch (err) {
            setQuotationDownloadError("Terjadi kesalahan saat mengunduh penawaran. error: " + err);
        } finally {
            setQuotationDownloadLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        setDownloadLoading(true);
        setDownloadError(null);
        try {
            const res = await getInspectionDownloadLink(extid);
            if (res?.download_url) {
                window.open(res.download_url, "_blank");
            } else {
                setDownloadError("Gagal mendapatkan link unduhan.");
            }
        } catch (err) {
            setDownloadError("Terjadi kesalahan saat mengunduh laporan. error: " + err);
        } finally {
            setDownloadLoading(false);
        }
    };

    useEffect(() => {
        if (!extid) return;
        async function fetchDetail() {
            try {
                setLoading(true);
                const result = await getInspectionScheduleDetail(extid);
                setDetail(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal mengambil detail inspeksi');
            } finally {
                setLoading(false);
            }
        }
        async function fetchQuotation() {
            try {
                setQuotationLoading(true);
                setQuotationError(null);
                const res = await getQuotationPrice(extid);
                setQuotation(res.penawaran);
            } catch (err) {
                setQuotationError(err instanceof Error ? err.message : 'Gagal mengambil estimasi penawaran');
            } finally {
                setQuotationLoading(false);
            }
        }
        fetchDetail();
        fetchQuotation();
    }, [extid]);

    if (loading) {
        return <MainLayout appBarTitle='Inspeksi' showNavBar={false}>
            <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
                <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 mt-8 text-center animate-pulse text-gray-400">Memuat detail inspeksi...</div>
            </div>
        </MainLayout>;
    }
    if (error) {
        return <MainLayout appBarTitle='Inspeksi' showNavBar={false}>
            <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
                <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 mt-8 text-center text-red-500">{error}</div>
            </div>
        </MainLayout>;
    }
    if (!detail) return null;

    const agenda = detail.detail_agenda;
    const aparList = detail.list_apar;

    return (
    <MainLayout appBarTitle='Inspeksi' showNavBar={false}>
        <div className="bg-gray-50 flex flex-col items-center px-6 pt-24">
            
            {/* Success Icon */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon width={40} height={40} className="text-purple-600"/>
            </div>

            {/* Success Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-1">{agenda.inspeksi_title}</h1>

            {/* Inspection Details */}
            <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-4 mt-8">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Tgl Dibuat</p>
                        <p className="text-base font-medium text-gray-900">{(() => {
                            const date = new Date(agenda.created_at);
                            return isNaN(date.getTime())
                                ? agenda.created_at
                                : `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                        })()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Dibuat oleh</p>
                        <p className="text-base font-medium text-gray-900">
                            <UserCircleIcon width={20} height={20} className="inline-block mr-2 text-purple-600"/>
                            {agenda.created_name}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Jumlah apar</p>
                        <p className="text-base font-medium text-gray-900">{agenda.jumlah_apar ?? 0}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-base font-medium text-gray-900">{agenda.status}</p>
                    </div>
                </div>
            </div>

            {/* Inspection Details */}
            {
                agenda.jumlah_apar != null ? (
                    <div className="w-full max-w-sm md:max-w-full bg-white rounded-xl p-6 space-y-4 mt-8">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Estimasi Penawaran</p>
                                <p className="text-base font-medium text-gray-900">
                                    {quotationLoading ? 'Memuat...' : quotationError ? <span className="text-red-500">{quotationError}</span> : quotation || '-'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Penawaran</p>
                                <p className="text-base font-medium text-gray-900">
                                    <Link 
                                        href="#"
                                        onClick={handleDownloadQuotation}
                                    >
                                        {
                                            quotationDownloadLoading ? (
                                                <>
                                                    <ArrowDownCircleIcon width={20} height={20} className="inline-block mr-2 text-purple-600 animate-bounce" />
                                                    Mengunduh...
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDownCircleIcon width={20} height={20} className="inline-block mr-2 text-purple-600" />
                                                    Unduh
                                                </>
                                            )}
                                    </Link>
                                    {quotationDownloadError && (
                                        <div className="text-red-500 text-sm mt-2 text-center">{quotationDownloadError}</div>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null
            }

            {/* Action Buttons */}
            <div className="w-full max-w-sm md:max-w-full space-y-3 mt-8">
                <Link href={`/inspection/i/${extid}`} className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                    <PlayCircleIcon width={20} height={20} className="inline-block mr-2"/>
                    Lanjut Inspeksi
                </Link>
                    <button
                        type="button"
                        className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center"
                        onClick={handleDownloadReport}
                        disabled={downloadLoading}
                    >
                        {downloadLoading ? (
                            <span className="flex items-center justify-center">
                                <ArrowDownCircleIcon width={20} height={20} className="inline-block mr-2 animate-bounce"/>
                                Mengunduh...
                            </span>
                        ) : (
                            <span>
                                <ArrowDownCircleIcon width={20} height={20} className="inline-block mr-2"/>
                                Unduh Laporan
                            </span>
                        )}
                    </button>
                    {downloadError && (
                        <div className="text-red-500 text-sm mt-2 text-center">{downloadError}</div>
                    )}
            </div>
        </div>
        
            {/* List APAR */}
            <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-gray-900 text-xl font-bold">Daftar APAR</h1>
                        <p className="text-gray-500 text-sm mt-1">Alat pemadam kebakaran yang sudah di-inspeksi</p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="space-y-4">
                        {aparList.length === 0 ? (
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-gray-500">Tidak ada data APAR.</div>
                        ) : (
                            aparList.map((ext, index) => (
                                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                                    <div className="flex space-x-4">
                                        <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                            <Image
                                                width={20}
                                                height={20}
                                                src="/images/extinguisher.svg"
                                                alt="APAR"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-gray-900 font-medium text-base">{ext.lokasi}</h3>
                                            <div className="grid grid-cols-2 gap-1">
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Tanggal</p>
                                                    <p className="text-sm font-medium text-gray-700">{ext.tanggal_cek}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500">Inspeksi oleh</p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <UserCircleIcon width={15} height={15} color='#9334e9' className="inline-block mr-2" />
                                                        {ext.qc_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
    </MainLayout>
  );
}