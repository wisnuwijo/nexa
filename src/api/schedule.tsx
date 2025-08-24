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