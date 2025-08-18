import { logout } from "./auth";
import { API_BASE_URL } from "./config";

export type AddProductParams = {
    deskripsi: string;
    brand: string;
    type: string;
    media: string;
    jumlah: string;
    kapasitas: string;
    tanggal_produksi: string; // Format: YYYY-MM-DD
    tanggal_kadaluarsa: string; // Format: YYYY-MM-DD
};

export async function addProduct(params: AddProductParams) {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        setTimeout(() => {
            logout();
            window.location.reload();
        }, 2000);

        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const formData = new FormData();
    formData.append('deskripsi', params.deskripsi);
    formData.append('brand', params.brand);
    formData.append('type', params.type);
    formData.append('media', params.media);
    formData.append('jumlah', params.jumlah);
    formData.append('kapasitas', params.kapasitas);
    formData.append('tanggal_produksi', params.tanggal_produksi);
    formData.append('tanggal_kadaluarsa', params.tanggal_kadaluarsa);

    const res = await fetch(`${API_BASE_URL}/product/add_product`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            // Do NOT set Content-Type when using FormData; browser will set it with boundary
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 401) {
            setTimeout(() => {
                logout();
                window.location.reload();
            }, 2000);

            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        } else if (res.status === 422) {
            const errorData = await res.json();
            // Handle validation errors
            const firstErrorKey = Object.keys(errorData.errors || {})[0];
            let errorMsg = 'Data produk tidak valid.';
            
            if (firstErrorKey === 'deskripsi') {
                errorMsg = 'Deskripsi tidak valid.';
            } else if (firstErrorKey === 'brand') {
                errorMsg = 'Brand tidak valid.';
            } else if (firstErrorKey === 'type') {
                errorMsg = 'Tipe tidak valid.';
            } else if (firstErrorKey === 'media') {
                errorMsg = 'Media tidak valid.';
            } else if (firstErrorKey === 'jumlah') {
                errorMsg = 'Jumlah tidak valid.';
            } else if (firstErrorKey === 'kapasitas') {
                errorMsg = 'Kapasitas tidak valid.';
            } else if (firstErrorKey === 'tanggal_produksi') {
                errorMsg = 'Tanggal produksi tidak valid.';
            } else if (firstErrorKey === 'tanggal_kadaluarsa') {
                errorMsg = 'Tanggal kadaluarsa tidak valid.';
            }
            
            throw new Error(errorMsg);
        }
        
        throw new Error('Gagal menambahkan produk.');
    }
    
    return res.json();
}

export type QrSticker = {
    id: number;
    date: string;
    count_qr: number;
    kode_customer: string;
    path_qr: string;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    url_qr: string;
};

export type QrStickerListResponse = {
    message: string;
    data: QrSticker[];
};

export type Extinguisher = {
    id: number;
    barcode: string;
    kode_barang: string;
    deskripsi: string;
    brand: string;
    type: string;
    media: string;
    kapasitas: string;
    tgl_produksi: string;
    tgl_beli: string | null;
    tgl_kadaluarsa: string;
    garansi: string | null;
    berat: string | null;
    lokasi: string | null;
    status: string | null;
    kode_customer: string;
    pressure: string | null;
    hose: string | null;
    head_valve: string | null;
    korosi: string | null;
    expired: string | null;
    last_service: string | null;
    last_refill: string | null;
    last_inspection: string | null;
    kode_mitra: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    titik_penempatan_id: string | null;
};

export type ExtinguisherListResponse = {
    message: string;
    list_apar: Extinguisher[];
};

export async function getExtinguisherList(): Promise<Extinguisher[]> {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        setTimeout(() => {
            logout();
            window.location.reload();
        }, 2000);
        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const res = await fetch('https://nexadev.cloud/nexa-backend/public/api/product/list_apar', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            setTimeout(() => {
                logout();
                window.location.reload();
            }, 2000);
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        throw new Error('Gagal mengambil daftar APAR.');
    }

    const result: ExtinguisherListResponse = await res.json();
    return result.list_apar;
}

export async function getQrStickerList(): Promise<QrSticker[]> {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        setTimeout(() => {
            logout();
            window.location.reload();
        }, 2000);

        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const res = await fetch(`${API_BASE_URL}/product/list_qr_apar`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            setTimeout(() => {
                logout();
                window.location.reload();
            }, 2000);

            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        console.log("res.body", res.body);
        throw new Error('Gagal mengambil daftar QR sticker.');
    }

    const result: QrStickerListResponse = await res.json();
    return result.data;
}