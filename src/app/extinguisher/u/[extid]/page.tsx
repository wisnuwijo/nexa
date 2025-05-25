import MainLayout from "@/app/components/main_layout";

export default function ExtinguisherUpdateDataPage() {
    return <MainLayout appBarTitle="Ubah Data APAR" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24 pt-20">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Lokasi</label>
                        <input
                        type="text"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. Sebelah Pintu Utama Lobby"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Brand</label>
                        <input
                        type="text"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. Tanexa"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Media</label>
                        <input
                        type="text"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. Powder"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Tipe APAR</label>
                        <input
                        type="text"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. TP5"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Kapasitas (Kg)</label>
                        <input
                        type="number"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. 5"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Tgl Kadaluarsa</label>
                        <input
                        type="date"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. 5"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div className="pt-8">
                        <button
                            type="submit"
                            className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </MainLayout>;
}