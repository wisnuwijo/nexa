import { logout } from './auth';
import { API_BASE_URL, SERVER_BASE_URL } from "./config";


// Upload letterhead
export type UploadLetterheadResponse = {
    message: string;
};

export async function uploadLetterhead(image: File, type: 'inspection' | 'inventory'): Promise<UploadLetterheadResponse> {
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
    formData.append('image', image);
    formData.append('type', type);

    const res = await fetch(`${API_BASE_URL}/kop_surat/insert_kop_surat`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 401) {
            setTimeout(() => { logout(); window.location.reload(); }, 2000);
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        const errorData = await res.json().catch(() => ({ message: 'Gagal mengunggah kop surat.' }));
        throw new Error(errorData.message || 'Gagal mengunggah kop surat.');
    }

    return res.json();
}

// Get letterhead settings
export type LetterheadSetting = {
    id: number;
    type: 'inspection' | 'inventory';
    image: string;
    aktif: 'aktif' | 'nonaktif';
    created_at: string;
    updated_at: string;
    image_url: string;
};

export type LetterheadListResponse = {
    message: string;
    data: LetterheadSetting[];
};

export async function getLetterheadSettings(type: 'inspection' | 'inventory' | 'null' = 'null'): Promise<LetterheadSetting[]> {
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

    const res = await fetch(`${API_BASE_URL}/kop_surat/list_kop_surat?type=${type}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            setTimeout(() => { logout(); window.location.reload(); }, 2000);
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        const errorData = await res.json().catch(() => ({ message: 'Gagal mengambil pengaturan kop surat.' }));
        throw new Error(errorData.message || 'Gagal mengambil pengaturan kop surat.');
    }

    const result: LetterheadListResponse = await res.json();

    if (!result.data || !Array.isArray(result.data)) {
        throw new Error(result.message || 'Format data kop surat tidak valid.');
    }

    // Prepend SERVER_BASE_URL to image_url
    return result.data.map(item => ({
        ...item,
        image_url: `${SERVER_BASE_URL}${item.image_url}`
    }));
}