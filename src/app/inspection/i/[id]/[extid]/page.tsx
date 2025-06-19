'use client'

import MainLayout from '@/app/components/main_layout'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CameraIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

interface ChecklistItem {
    name: string
    value: string
    options: string[]
}

const checklistData: ChecklistItem[] = [
    { name: "Pressure Gauge", value: "", options: ["Bagus", "Rusak"] },
    { name: "Expired", value: "", options: ["Ya", "Tidak"] },
    { name: "Selang", value: "", options: ["Bagus", "Rusak"] },
    { name: "Head Valve", value: "", options: ["Bagus", "Rusak"] },
    { name: "Korosi", value: "", options: ["Ya", "Tidak"] },
]

export default function InspectionChecklist({ params }: { params: Promise<{ extid: string }> }) {
    const router = useRouter()
    const { extid } = use(params)
    const [checklist, setChecklist] = useState(checklistData)

    return (
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

            <div className="min-h-screen bg-gray-50 flex md:hidden flex-col items-center px-6">
                {/* Extinguisher Details */}
                <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4 mt-20">
                    <h2 className="text-lg text-center font-semibold text-gray-900">ID: {extid}</h2>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Brand</p>
                            <p className="text-base font-medium text-gray-900">Tanexa</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Media</p>
                            <p className="text-base font-medium text-gray-900">Powder</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Kapasitas</p>
                            <p className="text-base font-medium text-gray-900">5 Kg</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                            <p className="text-base font-medium text-gray-900">20 Desember 2030</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tipe</p>
                            <p className="text-base font-medium text-gray-900">TP5</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Lokasi</p>
                            <p className="text-base font-medium text-gray-900">Lobby</p>
                        </div>
                    </div>
                </div>

                {/* Checklist */}
                <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-6 mt-8">
                    {checklist.map((item) => (
                        <div key={item.name} className="flex text-gray-500">
                            <div className="w-1/2">
                                <p className="font-medium text-gray-900">{item.name}</p>
                            </div>
                            <div className="w-1/2">
                                {
                                    item.value.toLowerCase() == "rusak" || item.value.toLowerCase() == "ya"
                                        ? 
                                            <div className="flex">
                                                <div className="w-2/3">
                                                    {checklistDropdown(item)}
                                                </div>
                                                <div className="w-1/3">
                                                    <button
                                                        type="button"
                                                        className="ml-2 p-2 border border-gray-300 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
                                                        aria-label="Take photo"
                                                    >
                                                        <CameraIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        : checklistDropdown(item)
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-3 mt-6 mb-8">
                    <button type="submit" onClick={() => router.back()} className="block w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors text-center">
                        Simpan
                    </button>
                </div>
            </div>
        </MainLayout>
    )

    function checklistDropdown(item: ChecklistItem) {
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
                            <div
                                onClick={() => setChecklist(checklist.map((i) => i.name == item.name ? { ...i, value: option } : i))}
                                className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                {option}
                            </div>
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    }
}