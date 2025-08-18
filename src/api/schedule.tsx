import { logout } from "./auth";
import { API_BASE_URL } from "./config";

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