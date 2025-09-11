'use client'

import { ExtinguisherDetail, getExtinguisherDetail } from '@/api/extinguisher'
import { doInspection, DoInspectionParams, getInspectionDetail } from '@/api/inspection'
import MainLayout from '@/app/components/main_layout'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CameraIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ChecklistItem {
    name: string,
    value: string,
    valueID: string,
    options: string[],
    optionsID: string[],
}

const checklistData: ChecklistItem[] = [
    { name: "Pressure Gauge", value: "", valueID: "", options: ["Bagus", "Rusak"], optionsID: ['1', '2']},
    { name: "Expired", value: "", valueID: "", options: ["Ya", "Tidak"], optionsID: ['4', '5'] },
    { name: "Selang", value: "", valueID: "", options: ["Bagus", "Rusak"], optionsID: ['7', '8'] },
    { name: "Head Valve", value: "", valueID: "", options: ["Bagus", "Rusak"], optionsID: ['11', '12'] },
    { name: "Korosi", value: "", valueID: "", options: ["Ya", "Tidak"], optionsID: ['15', '16'] },
]

export default function InspectionChecklist({ params }: { params: Promise<{ id: string, extid: string }> }) {
    const searchParams = useSearchParams();
    const id_inspection = searchParams.get("id_inspection");
    
    const router = useRouter()
    const { id, extid } = use(params)
    const [lastSegment, setLastSegment] = useState("")
    const [checklist, setChecklist] = useState(checklistData)
    const [isBase64Valid, setIsBase64Valid] = useState(true)
    const [extinguisher, setExtinguisher] = useState<ExtinguisherDetail | null>(null);
    const [extinguisherLoading, setExtinguisherLoading] = useState(false);
    const [extinguisherError, setExtinguisherError] = useState<string | null>(null);

    const [photos, setPhotos] = useState<(string | null)[]>(Array(checklistData.length).fill(null));
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Decode extid and extract last segment
    useEffect(() => {
        if (extid) {
            try {
                // Decode URI component first to handle %3D etc
                const normalizedExtid = decodeURIComponent(extid);
                // Validate base64: must be a string with only base64 characters and length % 4 == 0
                if (!/^[A-Za-z0-9+/=]+$/.test(normalizedExtid) || normalizedExtid.length % 4 !== 0) {
                    throw new Error("extid is not valid base64");
                }

                setIsBase64Valid(true)
                const decodedUrl = atob(normalizedExtid);
                const segments = decodedUrl.split("/");
                setLastSegment(segments[segments.length - 1]);
            } catch (e) {
                console.log("Error decoding extid:", e);
                setLastSegment("");
                setIsBase64Valid(false);
            }
        }
    }, [extid])

    // Fetch extinguisher details
    useEffect(() => {
        if (lastSegment) {
            setExtinguisherLoading(true);
            setExtinguisherError(null);
            getExtinguisherDetail(lastSegment)
                .then(res => setExtinguisher(res.data))
                .catch(err => setExtinguisherError(err instanceof Error ? err.message : 'Gagal mengambil data APAR'))
                .finally(() => setExtinguisherLoading(false));

            if (id_inspection != "" && id_inspection != null) {
                getInspectionDetail(id_inspection)
                    .then(res => {
                        const inspectionPhotos = []
                        if (res.list_apar.length > 0) {
                            inspectionPhotos.push(res.list_apar[0].pressure_img);
                            inspectionPhotos.push(res.list_apar[0].expired_img);
                            inspectionPhotos.push(res.list_apar[0].hose_img);
                            inspectionPhotos.push(res.list_apar[0].head_valve_img);
                            inspectionPhotos.push(res.list_apar[0].korosi_img);

                            setChecklist(checklistData.map(item => {
                                if (item.name == "Pressure Gauge" ) {
                                    return {
                                        ...item, 
                                        value: res.list_apar[0].detail_pressure, 
                                        valueID: item.optionsID[ item.options.indexOf(res.list_apar[0].detail_pressure) ] || '' 
                                    };
                                } else if (item.name == "Expired" ) {
                                    return {
                                        ...item,
                                        value: res.list_apar[0].detail_expired,
                                        valueID: item.optionsID[item.options.indexOf(res.list_apar[0].detail_expired)] || ''
                                    };
                                } else if (item.name == "Selang" ) {
                                    return {
                                        ...item,
                                        value: res.list_apar[0].detail_hose,
                                        valueID: item.optionsID[item.options.indexOf(res.list_apar[0].detail_hose)] || ''
                                    };
                                } else if (item.name == "Head Valve" ) {
                                    return {
                                        ...item,
                                        value: res.list_apar[0].detail_head_valve,
                                        valueID: item.optionsID[item.options.indexOf(res.list_apar[0].detail_head_valve)] || ''
                                    };
                                } else if (item.name == "Korosi" ) {
                                    return {
                                        ...item,
                                        value: res.list_apar[0].detail_korosi,
                                        valueID: item.optionsID[item.options.indexOf(res.list_apar[0].detail_korosi)] || ''
                                    };
                                }
                                return item;
                            }))
                        }
                        setPhotos(inspectionPhotos)
                    })
                    .catch(err => {
                        toast.error(err instanceof Error ? err.message : 'Gagal mengambil data inspeksi', {
                            position: 'top-center',
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    })
                    .finally(() => {});
            }
        }
    }, [lastSegment])

    function handleTakePhoto(index: number) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    video.setAttribute('playsinline', 'true');
                    video.style.position = 'fixed';
                    video.style.top = '50%';
                    video.style.left = '50%';
                    video.style.transform = 'translate(-50%, -50%)';
                    video.style.zIndex = '9999';
                    video.style.width = '320px';
                    video.style.height = '240px';
                    video.style.background = '#000';
                    video.style.borderRadius = '12px';
                    document.body.appendChild(video);

                    // Add capture button
                    const captureBtn = document.createElement('button');
                    captureBtn.innerText = 'Ambil Foto';
                    captureBtn.style.position = 'fixed';
                    captureBtn.style.top = 'calc(50% + 130px)';
                    captureBtn.style.left = '50%';
                    captureBtn.style.transform = 'translateX(-50%)';
                    captureBtn.style.zIndex = '10000';
                    captureBtn.style.background = '#9333ea';
                    captureBtn.style.color = '#fff';
                    captureBtn.style.padding = '10px 24px';
                    captureBtn.style.borderRadius = '8px';
                    captureBtn.style.border = 'none';
                    captureBtn.style.fontWeight = 'bold';
                    captureBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                    document.body.appendChild(captureBtn);

                    // Add cancel button
                    const cancelBtn = document.createElement('button');
                    cancelBtn.innerText = 'Batal';
                    cancelBtn.style.position = 'fixed';
                    cancelBtn.style.top = 'calc(50% + 170px)';
                    cancelBtn.style.left = '50%';
                    cancelBtn.style.transform = 'translateX(-50%)';
                    cancelBtn.style.zIndex = '10000';
                    cancelBtn.style.background = '#e5e7eb';
                    cancelBtn.style.color = '#9333ea';
                    cancelBtn.style.padding = '8px 20px';
                    cancelBtn.style.borderRadius = '8px';
                    cancelBtn.style.border = 'none';
                    cancelBtn.style.fontWeight = 'bold';
                    cancelBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
                    document.body.appendChild(cancelBtn);

                    function cleanup() {
                        stream.getTracks().forEach(track => track.stop());
                        if (video.parentNode) document.body.removeChild(video);
                        if (captureBtn.parentNode) document.body.removeChild(captureBtn);
                        if (cancelBtn.parentNode) document.body.removeChild(cancelBtn);
                    }

                    captureBtn.onclick = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = 320;
                        canvas.height = 240;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const dataUrl = canvas.toDataURL('image/jpeg');
                            setPhotos((prev) => {
                                const updated = [...prev];
                                updated[index] = dataUrl;
                                return updated;
                            });
                        }
                        cleanup();
                    };

                    cancelBtn.onclick = () => {
                        cleanup();
                    };
                })
                .catch(err => {
                    alert('Tidak dapat mengakses kamera. error: ' + err);
                });
        } else {
            alert('Perangkat tidak mendukung akses kamera.');
        }
    }

    async function handleSave() {
        setSaving(true);
        setSaveError(null);
        try {
            // Prepare images as File objects if available
            const photoFiles = await Promise.all(photos.map((dataUrl, idx) => {
                if (!dataUrl) return null;
                if (dataUrl.startsWith('data:')) {
                    // Handle base64 data URL
                    const arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)?.[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
                    return new File([u8arr], `checklist_${idx + 1}.jpg`, { type: mime || 'image/jpeg' });
                } else {
                    // Handle normal URL (fetch and convert to File)
                    return fetch(dataUrl)
                        .then(res => res.blob())
                        .then(blob => new File([blob], `checklist_${idx + 1}.jpg`, { type: blob.type || 'image/jpeg' }));
                }
            }));

            let paramsToSend: DoInspectionParams = {
                id_jadwal: id || '',
                kode_barang: lastSegment || '',
                pressure: checklist[0].valueID,
                expired: checklist[1].valueID,
                selang: checklist[2].valueID,
                head_valve: checklist[3].valueID,
                korosi: checklist[4].valueID,
                pressure_img: photoFiles[0],
                expired_img: photoFiles[1],
                selang_img: photoFiles[2],
                head_valve_img: photoFiles[3],
                korosi_img: photoFiles[4],
            };

            if (id_inspection != "" && id_inspection != null) {
                paramsToSend = {
                    id_inspection: id_inspection,
                    ...paramsToSend,
                }
            }
            const result = await doInspection(paramsToSend);
            toast.success(result.message || 'Berhasil menyimpan inspeksi', {
                position: 'top-center',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                router.push(`/inspection/i/${id}`);
            }, 1000);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan inspeksi');
            toast.error(saveError, {
                position: 'top-center',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setSaving(false);
        }
    }

    function checklistDropdown(item: ChecklistItem) {
        return (
            <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                        {item.value == "" ? "Pilih.." : item.value}
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                    <div className="py-1">
                        {item.options.map((option) => (
                            <MenuItem key={option}>
                                <div
                                    onClick={() => setChecklist(checklist.map((i) => i.name == item.name ? { ...i, value: option, valueID: item.optionsID[item.options.indexOf(option)] } : i))}
                                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                    {option}
                                </div>
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        );
    }

    function checklistBody() {
        return (
            <div className="min-h-screen bg-gray-50 flex md:hidden flex-col items-center px-6">
                {/* Extinguisher Details */}
                <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4 mt-20">
                    {extinguisherLoading ? (
                        <div className="text-center text-gray-400">Memuat data APAR...</div>
                    ) : extinguisherError ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="text-red-500 mb-4">{extinguisherError}</div>
                            <button
                                onClick={() => router.back()}
                                className="bg-purple-600 text-white py-2 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                            >
                                Kembali
                            </button>
                        </div>
                    ) : extinguisher ? (
                        <>
                            <h2 className="text-lg text-center font-semibold text-gray-900">ID: {lastSegment}</h2>
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
                                    <p className="text-base font-medium text-gray-900">{extinguisher.kapasitas} kg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.tgl_kadaluarsa}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Tipe</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Lokasi</p>
                                    <p className="text-base font-medium text-gray-900">{extinguisher.lokasi ?? "- - -"}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400"></div>
                    )}
                </div>
                {extinguisher ? (
                    <>
                        <div className="w-full max-w-sm bg-white rounded-xl space-y-4 mt-5">
                            {/* Checklist */}
                            <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-6 mt-8">
                                {checklist.map((item, idx) => (
                                    <div key={item.name} className="flex text-gray-500 items-center">
                                        <div className="w-1/2">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                        </div>
                                        <div className="w-1/2 flex items-center">
                                            {item.value != null && (item.value.toLowerCase() == "rusak" || item.value.toLowerCase() == "ya") ? (
                                                <div className="flex items-center w-full">
                                                    <div className="w-2/3">{checklistDropdown(item)}</div>
                                                    <div className="w-1/3 flex items-center">
                                                        {photos[idx] ? null : (
                                                            <button
                                                                type="button"
                                                                className="ml-2 p-2 border border-gray-300 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
                                                                aria-label="Take photo"
                                                                onClick={() => handleTakePhoto(idx)}
                                                            >
                                                                <CameraIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        {photos[idx] && (
                                                            <img
                                                                onClick={() => handleTakePhoto(idx)}
                                                                src={photos[idx] as string}
                                                                alt="Checklist Foto"
                                                                className="ml-2 w-10 h-10 object-cover rounded-md border"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                checklistDropdown(item)
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="w-full max-w-sm space-y-3 mt-6 mb-8">
                            <button
                                type="button"
                                onClick={handleSave}
                                className={`block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400"></div>
                )}
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <MainLayout appBarTitle='Checklist' showNavBar={false}>
                {/* Warning message */}
                <div className="hidden md:flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <div className="max-w-md p-8 bg-white rounded-2xl shadow-lg text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900">Perangkat Tidak Didukung</h2>
                        <p className="text-gray-600">
                            Inspeksi menggunakan perangkat desktop tidak didukung. Mohon gunakan perangkat ponsel untuk melakukan inspeksi.
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center px-4 py-2 bg-purple-50 text-sm text-purple-700 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Buka di Perangkat Mobile
                            </span>
                        </div>
                    </div>
                </div>
                {isBase64Valid ? checklistBody() : (
                    <div className="flex flex-col justify-center items-center min-h-screen">
                        <p className="text-gray-500 mb-4">QR code tidak valid. Silakan scan QR yang benar.</p>
                        <button
                            onClick={() => router.back()}
                            className="bg-purple-600 text-white py-2 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                        >
                            Kembali
                        </button>
                    </div>
                )}
            </MainLayout>
        </>
    );
}