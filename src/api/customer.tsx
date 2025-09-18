import { logout } from './auth';
import { API_BASE_URL } from "./config";

export type Customer = {
    id_customer: number;
    kode_customer: string;
    jenis_customer: "COMPANY" | "PERSONAL";
    nama_customer: string;
    alamat: string;
    telp: string;
    email: string;
    created_by: string | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type CustomerListResponse = {
    message: string;
    data: Customer[];
};

export async function getCustomerList(): Promise<Customer[]> {
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

    const res = await fetch(`${API_BASE_URL}/customer/kode_customer_list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) { setTimeout(() => { logout(); window.location.reload(); }, 2000); throw new Error('Sesi telah berakhir. Silakan login kembali.'); }
        throw new Error('Gagal mengambil daftar customer.');
    }

    const data: CustomerListResponse = await res.json();
    return data.data;
}