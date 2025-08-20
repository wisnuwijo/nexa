import { logout } from "./auth";
import { API_BASE_URL } from "./config";

export type LocationPoint = {
    id: number;
    gedung_id: number;
    nama_titik: string;
    created_at: string;
    updated_at: string;
};

export type Location = {
    id: number;
    kode_lokasi: string;
    nama_gedung: string;
    kode_customer: string;
    created_at: string;
    updated_at: string;
    location_point: LocationPoint[];
};

export type LocationListResponse = {
    message: string;
    data: Location[];
};

export async function getLocationList(): Promise<Location[]> {
    const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

    const res = await fetch(`${API_BASE_URL}/location/list_lokasi`, {
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
        throw new Error('Gagal mengambil lokasi.');
    }

    const result: LocationListResponse = await res.json();
    if (!result.data || !Array.isArray(result.data)) {
        throw new Error(result.message || 'Gagal mengambil detail lokasi.');
    }

    return result.data;
}