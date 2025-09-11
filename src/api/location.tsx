import { logout } from "./auth";
import { API_BASE_URL } from "./config";

// Create location point (titik penempatan)
export type CreateLocationPointResponse = {
    message: string;
};

export async function createLocationPoint(gedung_id: string | number, nama_titik: string): Promise<CreateLocationPointResponse> {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const formData = new FormData();
    formData.append('gedung_id', String(gedung_id));
    formData.append('nama_titik', nama_titik);

    const res = await fetch(`${API_BASE_URL}/location/create_location_point`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        throw new Error('Gagal menyimpan titik penempatan.');
    }

    return res.json();
}

// Create building (gedung)
export type CreateBuildingResponse = {
    message: string;
};

export async function createBuilding(gedung: string): Promise<CreateBuildingResponse> {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const formData = new FormData();
    formData.append('gedung', gedung);

    const res = await fetch(`${API_BASE_URL}/location/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        throw new Error('Gagal menyimpan gedung.');
    }

    return res.json();
}

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

export type LocationPointListResponse = {
    message: string;
    data: LocationPoint[];
};

export async function getLocationPointList(gedung_id: string | number): Promise<LocationPoint[]> {
    // Get token from cookies
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const res = await fetch(`${API_BASE_URL}/location/list_location_point?gedung_id=${gedung_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        throw new Error('Gagal mengambil daftar titik lokasi.');
    }

    const result: LocationPointListResponse = await res.json();
    return result.data;
}