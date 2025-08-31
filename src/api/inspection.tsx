// Type for inspected extinguisher item
export type InspectedExtinguisher = {
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
    status: string;
    kode_customer: string;
    pressure: string;
    hose: string;
    head_valve: string;
    korosi: string;
    expired: string;
    last_service: string | null;
    last_refill: string | null;
    last_inspection: string | null;
    kode_mitra: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    titik_penempatan_id: string | null;
};

export type InspectedExtinguisherListResponse = {
    message: string;
    data_list_apar_inspected: InspectedExtinguisher[];
};

export async function getInspectedExtinguisherList(id_jadwal: string): Promise<InspectedExtinguisherListResponse> {
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

    const res = await fetch(`${API_BASE_URL}/inspection/list_apar_inspected?id_jadwal=${id_jadwal}`, {
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
        throw new Error('Gagal mengambil daftar APAR yang sudah diinspeksi.');
    }

    const result: InspectedExtinguisherListResponse = await res.json();
    if (!result.data_list_apar_inspected || !Array.isArray(result.data_list_apar_inspected)) {
        throw new Error(result.message || 'Gagal mengambil daftar APAR yang sudah diinspeksi.');
    }
    return result;
}
import { logout } from "./auth";
import { API_BASE_URL } from "./config";

export type InspectionDetailApar = {
    id_inspection: number;
    no_jadwal: string;
    kode_barang: string;
    kode_customer: string;
    nama_customer: string;
    tanggal_cek: string;
    lokasi: string;
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
    qc_name: string;
    detail_pressure: string;
    detail_hose: string;
    detail_head_valve: string;
    detail_korosi: string;
    detail_expired: string;
};

export type InspectionDetailResponse = {
    message: string;
    list_apar: InspectionDetailApar[];
};

export async function getInspectionDetail(id_inspection: string): Promise<InspectionDetailResponse> {
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

    const res = await fetch(`${API_BASE_URL}/inspection/detail_inspection_apar?id_inspection=${id_inspection}`, {
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
        throw new Error('Gagal mengambil detail inspeksi.');
    }

    const result: InspectionDetailResponse = await res.json();
    if (!result.list_apar || !Array.isArray(result.list_apar)) {
        throw new Error(result.message || 'Gagal mengambil detail inspeksi.');
    }
    return result;
}

export type DoInspectionParams = {
    id_jadwal: string;
    kode_barang: string;
    id_inspection?: string | null;
    pressure: string;
    expired: string;
    selang: string;
    head_valve: string;
    korosi: string;
    pressure_img?: File | null;
    expired_img?: File | null;
    selang_img?: File | null;
    head_valve_img?: File | null;
    korosi_img?: File | null;
};

export type DoInspectionResponse = {
    message: string;
    status: string;
};

export async function doInspection(params: DoInspectionParams): Promise<DoInspectionResponse> {
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
    formData.append('id_jadwal', params.id_jadwal);
    formData.append('kode_barang', params.kode_barang);
    if (params.id_inspection) {
        formData.append('id_inspection', params.id_inspection);
    }
    formData.append('pressure', params.pressure);
    formData.append('expired', params.expired);
    formData.append('selang', params.selang);
    formData.append('head_valve', params.head_valve);
    formData.append('korosi', params.korosi);
    if (params.pressure_img) formData.append('pressure_img', params.pressure_img);
    if (params.expired_img) formData.append('expired_img', params.expired_img);
    if (params.selang_img) formData.append('selang_img', params.selang_img);
    if (params.head_valve_img) formData.append('head_valve_img', params.head_valve_img);
    if (params.korosi_img) formData.append('korosi_img', params.korosi_img);

    const res = await fetch(`${API_BASE_URL}/inspection/do_inspection`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
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
        }
        throw new Error('Gagal menyimpan inspeksi APAR.');
    }

    const result: DoInspectionResponse = await res.json();
    return result;
}