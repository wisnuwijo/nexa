'use client'

import MainLayout from "@/app/components/main_layout"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import { useState, useEffect } from "react"
import { getLocationList, getLocationPointList, createBuilding, createLocationPoint, Location, LocationPoint } from '@/api/location';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LocationItem {
    type: string
    value: string
    options: string[]
}

export default function ExtinguisherPlacementPage() {
    // const { extid } = use(params)
    // const router = useRouter()

    const [building, setBuilding] = useState("")
    const [buildingID, setBuildingID] = useState<number | null>(null)
    const [placement, setPlacement] = useState("")
    const [placementID, setPlacementID] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeAddLocation, setActiveAddLocation] = useState<LocationItem | null>(null);
    const [buildingOptions, setBuildingOptions] = useState<string[]>([]);
    const [buildingOptionsID, setBuildingOptionsID] = useState<number[]>([]);
    
    const [placementOptions, setPlacementOptions] = useState<string[]>([]);
    const [placementOptionsID, setPlacementOptionsID] = useState<number[]>([]);
    const [buildingLoading, setBuildingLoading] = useState(false);
    const [placementLoading, setPlacementLoading] = useState(false);

    useEffect(() => {
        async function fetchBuildings() {
            try {
                setBuildingLoading(true);
                const locations: Location[] = await getLocationList();
                setBuildingOptions(locations.map(loc => loc.nama_gedung));
                setBuildingOptionsID(locations.map(loc => loc.id));
            } catch (err) {
                // Optionally handle error
                toast.error("Terjadi kesalahan saat mengambil data gedung: " + (err instanceof Error ? err.message : "Unknown error"));
            } finally {
                setBuildingLoading(false);
            }
        }
        fetchBuildings();
    }, []);

    const handleAddLocation = (item: LocationItem) => {
        setActiveAddLocation(item)
        setIsModalOpen(true)
    }

    const handleLocationChange = (item: LocationItem, option: string) => {
        const index = item.options.indexOf(option);
        if (item.type == "building") {
            // Update building and reset placement when building changes
            setBuilding(option)
            setBuildingID(buildingOptionsID[index])
            setPlacement("")
            
            if (index !== -1) {
                async function fetchLocationPoint() {
                    try {
                        setPlacementLoading(true);
                        const locations: LocationPoint[] = await getLocationPointList(buildingOptionsID[index]);
                        setPlacementOptions(locations.map(loc => loc.nama_titik));
                        setPlacementOptionsID(locations.map(loc => loc.id));
                    } catch (err) {
                        toast.error("Terjadi kesalahan saat mengambil data titik penempatan: " + (err instanceof Error ? err.message : "Unknown error"));
                    } finally {
                        setPlacementLoading(false);
                    }
                }
                fetchLocationPoint();
            }
        } else if (item.type == "placement_point") {
            setPlacement(option)
            setPlacementID(placementOptionsID[index])
        }
    }

    function locationDropdown(item: LocationItem) {
        const isBuilding = item.type === "building";
        const loading = isBuilding ? buildingLoading : placementLoading;
        let idx = 0;

        return <Menu as="div" className="relative inline-block text-left w-full">
            <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                    {loading ? (
                        <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Memuat...</span>
                    ) : (
                        <>
                            {item.value == "" ? "Pilih.." : item.value}
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                        </>
                    )}
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
                <div className="py-1">
                    {item.options.map((option) => {
                        idx++;
                        return (
                            <MenuItem key={option + idx}>
                                <div onClick={() => handleLocationChange(item, option)} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                    {option}
                                </div>
                            </MenuItem>
                        )
                    })}

                    <MenuItem key="add">
                        <div onClick={() => handleAddLocation(item)} className="cursor-pointer border-t border-gray-200 w-full flex items-center space-x-3 px-3 py-3 rounded-md text-gray-600">
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Tambah baru</span>
                        </div>
                    </MenuItem>

                </div>
            </MenuItems>
        </Menu>
    }

    const [updating, setUpdating] = useState(false);
    // You need to get extid from the route params
    // If you use next/navigation:
    // import { useParams } from 'next/navigation';
    // const params = useParams();
    // const extid = params.extid as string;
    // For now, let's assume extid is available
    // TODO: Replace with actual extid from params
    const extid = typeof window !== 'undefined' ? (window.location.pathname.split('/').pop() || '') : '';

    const handleUpdateLocation = async () => {
        if (!buildingID || !placementID) {
            toast.error("Gedung dan titik penempatan harus diisi.");
            return;
        }

        setUpdating(true);
        try {
            const { updateExtinguisher } = await import('@/api/extinguisher');
            await updateExtinguisher({
                id: extid,
                deskripsi: '',
                brand: '',
                type: '',
                media: '',
                kapasitas: '',
                tanggal_produksi: '',
                tanggal_kadaluarsa: '',
                lokasi: String(buildingID),
                titik_penempatan_id: String(placementID),
            });
            toast.success("Lokasi APAR berhasil diperbarui.");

            setTimeout(() => {
                window.history.back();
            }, 2200);
        } catch (err) {
            toast.error("Gagal memperbarui lokasi APAR: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setUpdating(false);
        }
    }

    return <MainLayout appBarTitle="Ubah Penempatan APAR" showNavBar={false}>
        <ToastContainer position="top-center" autoClose={4000} />
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24 pt-20">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Gedung</label>
                        {locationDropdown({ type: "building", value: building, options: buildingOptions })}
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Titik penempatan</label>
                        {locationDropdown({ type: "placement_point", value: placement, options: placementOptions })}
                    </div>

                    <div className="pt-8">
                        <button disabled={updating} type="button" onClick={handleUpdateLocation} className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Bottom Sheet */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">Tambah lokasi</h1>
                        <div>
                            <label className="block text-gray-600 text-[13px] mb-1.5">{activeAddLocation?.type === "building" ? "Gedung" : "Titik penempatan"}</label>
                            <input
                                type="text"
                                name="name"
                                id="modal-location-input"
                                onChange={e => {
                                    if (activeAddLocation) {
                                        const updatedLocation = { ...activeAddLocation, value: e.target.value };
                                        setActiveAddLocation(updatedLocation);
                                    }
                                }} 
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder={activeAddLocation?.type === "building" ? "Ex. Gedung Produksi" : "Ex. Pintu 1"}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <button
                            type="submit"
                            onClick={async (e) => {
                                e.preventDefault();
                                const value = activeAddLocation?.value;
                                
                                if (!value) return;
                                setIsModalOpen(false);

                                if (activeAddLocation?.type === "building") {
                                    try {
                                        await createBuilding(value);
                                        toast.success('Gedung berhasil ditambahkan!');
                                        // Refresh building list
                                        setBuildingLoading(true);
                                        const locations: Location[] = await getLocationList();
                                        setBuildingOptions(locations.map(loc => loc.nama_gedung));
                                        setBuildingOptionsID(locations.map(loc => loc.id));
                                    } catch (err) {
                                        toast.error('Gagal menambah gedung: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                    } finally {
                                        setBuildingLoading(false);
                                    }
                                } else if (activeAddLocation?.type === "placement_point" && buildingID) {
                                    try {
                                        await createLocationPoint(buildingID, value);
                                        toast.success('Titik penempatan berhasil ditambahkan!');
                                        // Refresh placement list
                                        setPlacementLoading(true);
                                        const locations: LocationPoint[] = await getLocationPointList(buildingID);
                                        setPlacementOptions(locations.map(loc => loc.nama_titik));
                                        setPlacementOptionsID(locations.map(loc => loc.id));
                                    } catch (err) {
                                        toast.error('Gagal menambah titik penempatan: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                    } finally {
                                        setPlacementLoading(false);
                                    }
                                }

                                setActiveAddLocation(null);
                            }}
                            className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-8"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}
        </div>
    </MainLayout>
}