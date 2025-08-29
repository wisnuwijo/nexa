import { logout } from "./auth";
import { API_BASE_URL } from "./config";

export type InspectionItem = {
    id: number;
    no_jadwal: string;
    inspeksi_title: string;
    inspeksi_pic: string;
    inspeksi_no_hp_pic: string | null;
    jumlah_apar: number | null;
    status: string;
    tgl_mulai: string;
    tgl_selesai: string;
    tgl_mulai_sebenarnya: string | null;
    tgl_selesai_sebenarnya: string | null;
    kode_customer: string;
    kode_activity: string;
    keterangan: string;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    created_by: string;
    execute_by: string;
    inspection_name: string;
};

export type InspectionListResponse = {
    message: string;
    data_list_inspeksi: InspectionItem[];
};

export async function getInspectionList(): Promise<InspectionItem[]> {
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

    const res = await fetch(`${API_BASE_URL}/inspection/list_inspection`, {
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
        throw new Error('Gagal mengambil daftar inspeksi.');
    }

    const result: InspectionListResponse = await res.json();
    if (!result.data_list_inspeksi || !Array.isArray(result.data_list_inspeksi)) {
        throw new Error(result.message || 'Gagal mengambil daftar inspeksi.');
    }
    return result.data_list_inspeksi;
}

export type AddInspectionParams = {
    inspeksi_title: string;
    inspeksi_pic: string;
    keterangan: string;
    tanggal_mulai: string; // Format: YYYY-MM-DD
    tanggal_selesai: string; // Format: YYYY-MM-DD
};

export async function addInspection(params: AddInspectionParams) {
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
    formData.append('inspeksi_title', params.inspeksi_title);
    formData.append('inspeksi_pic', params.inspeksi_pic);
    formData.append('keterangan', params.keterangan);
    formData.append('tanggal_mulai', params.tanggal_mulai);
    formData.append('tanggal_selesai', params.tanggal_selesai);

    const res = await fetch(`${API_BASE_URL}/inspection/add_inspection`, {
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
            let errorMsg = 'Data inspeksi tidak valid.';
            
            if (firstErrorKey === 'inspeksi_title') {
                errorMsg = 'Judul inspeksi tidak valid.';
            } else if (firstErrorKey === 'inspeksi_pic') {
                errorMsg = 'PIC inspeksi tidak valid.';
            } else if (firstErrorKey === 'keterangan') {
                errorMsg = 'Keterangan tidak valid.';
            } else if (firstErrorKey === 'tanggal_mulai') {
                errorMsg = 'Tanggal mulai tidak valid.';
            } else if (firstErrorKey === 'tanggal_selesai') {
                errorMsg = 'Tanggal selesai tidak valid.';
            }
            
            throw new Error(errorMsg);
        }
        
        console.log("res.body", res.body);
        throw new Error('Gagal menambahkan inspeksi.');
    }
    
    return res.json();
}

export type InspectionScheduleDetail = {
    id: number;
    no_jadwal: string;
    inspeksi_title: string;
    inspeksi_pic: string;
    inspeksi_no_hp_pic: string | null;
    jumlah_apar: string;
    status: string;
    tgl_mulai: string;
    tgl_selesai: string;
    tgl_mulai_sebenarnya: string | null;
    tgl_selesai_sebenarnya: string | null;
    kode_customer: string;
    kode_activity: string;
    keterangan: string;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    created_by: string;
    execute_by: string;
    inspection_name: string;
    created_name: string;
};

export type InspectionScheduleDetailApar = {
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

export type InspectionScheduleDetailResponse = {
    message: string;
    detail_agenda: InspectionScheduleDetail;
    list_apar: InspectionScheduleDetailApar[];
};

export async function getInspectionScheduleDetail(id_jadwal: string): Promise<InspectionScheduleDetailResponse> {
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
    formData.append('id_jadwal', id_jadwal);

    const res = await fetch(`${API_BASE_URL}/inspection/detail_inspection?id_jadwal=${id_jadwal}`, {
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

    const result: InspectionScheduleDetailResponse = await res.json();
    if (!result.detail_agenda || !Array.isArray(result.list_apar)) {
        throw new Error(result.message || 'Gagal mengambil detail inspeksi.');
    }
    return result;
}

export type InspectionDownloadLinkResponse = {
    message: string;
    download_url: string;
};

export async function getInspectionDownloadLink(id_jadwal: string): Promise<InspectionDownloadLinkResponse> {
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
    formData.append('id_jadwal', id_jadwal);

    const res = await fetch(`${API_BASE_URL}/inspection/download_report`, {
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
        throw new Error('Gagal mengambil link download laporan inspeksi.');
    }

    const result: InspectionDownloadLinkResponse = await res.json();
    if (!result.download_url) {
        throw new Error(result.message || 'Gagal mengambil link download laporan inspeksi.');
    }
    return result;
}

export type QuotationPriceResponse = {
    message: string;
    penawaran: string;
};

export async function getQuotationPrice(id_jadwal: string): Promise<QuotationPriceResponse> {
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

    const res = await fetch(`${API_BASE_URL}/penawaran?id_jadwal=${id_jadwal}`, {
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
        throw new Error('Gagal mengambil detail penawaran.');
    }

    const result: QuotationPriceResponse = await res.json();
    if (!result.penawaran) {
        throw new Error(result.message || 'Gagal mengambil detail penawaran.');
    }
    return result;
}

export type QuotationDownloadLinkResponse = {
    status: boolean;
    message: string;
    download_url: string;
};

export async function getQuotationDownloadLink(id_jadwal: string): Promise<QuotationDownloadLinkResponse> {
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

    const res = await fetch(`${API_BASE_URL}/penawaran/download_penawaran?id_jadwal=${id_jadwal}`, {
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
        throw new Error('Gagal mengambil link download penawaran.');
    }

    const result: QuotationDownloadLinkResponse = await res.json();
    if (!result.download_url) {
        throw new Error(result.message || 'Gagal mengambil link download penawaran.');
    }
    return result;
}