'use client'

import MainLayout from "@/app/components/main_layout"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

interface LocationItem {
    type: string
    value: string
    options: string[]
}

export default function ExtinguisherPlacementPage() {
    // const { extid } = use(params)
    // const router = useRouter()

    const [building, setBuilding] = useState("")
    const [placement, setPlacemeent] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeAddLocation, setActiveAddLocation] = useState<LocationItem | null>(null);

    const handleAddLocation = (item: LocationItem) => {
        setActiveAddLocation(item)
        setIsModalOpen(true)
    }

    const handleLocationChange = (item: LocationItem, option: string) => {
        if (item.type == "building") {
            setBuilding(option)
        } else if (item.type == "placement_point") {
            setPlacemeent(option)
        }
    }

    function locationDropdown(item: LocationItem) {
        return <Menu as="div" className="relative inline-block text-left w-full">
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
                            <div onClick={() => handleLocationChange(item, option)} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                {option}
                            </div>
                        </MenuItem>
                    ))}

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

    return <MainLayout appBarTitle="Ubah Penempatan APAR" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24 pt-20">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Gedung</label>
                        {locationDropdown({ type: "building", value: building, options: ["Gedung 1", "Gedung 2"] })}
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Titik penempatan</label>
                        {locationDropdown({ type: "placement_point", value: placement, options: ["Depan pintu", "Sebelah gerbang 2"] })}
                    </div>

                    <div className="pt-8">
                        <button className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4">
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
                                className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                                placeholder={activeAddLocation?.type === "building" ? "Ex. Gedung Produksi" : "Ex. Pintu 1"}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <button
                            type="submit"
                            onClick={() => {
                                setIsModalOpen(false)
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