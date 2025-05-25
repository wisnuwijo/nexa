import MainLayout from "@/app/components/main_layout";

export default function StickerCreatePage() {
    return <MainLayout appBarTitle="Buat Stiker QR" showNavBar={false}>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-[430px] mx-auto px-4 pb-24">
                {/* Header */}
                <div className="flex justify-between items-center py-6 pt-20">
                    <div>
                        <p className="text-gray-500 text-sm mt-1">Data yang di entri dalam form berikut akan disimpan ke dalam stiker QR.</p>
                    </div>
                </div>

                <form className="space-y-4">
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

                    <div>
                        <label className="block text-gray-600 text-[13px] mb-1.5">Jumlah QR</label>
                        <input
                        type="number"
                        name="name"
                        className="w-full h-12 px-4 text-gray-500 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-[15px]"
                        placeholder="Ex. 100"
                        required
                        autoComplete="name"
                        />
                    </div>

                    <div className="pt-12">
                        <button
                            type="submit"
                            className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all font-medium text-[15px] mt-4"
                        >
                            Generate Stiker QR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </MainLayout>;
}