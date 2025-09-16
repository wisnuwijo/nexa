import { logout } from "./auth";
import { API_BASE_URL } from "./config";

// Get list of broken extinguishers
export type BrokenExtinguisher = {
    id: number;
    barcode: string;
    kode_barang: string;
    deskripsi: string | null;
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
    kode_mitra: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    titik_penempatan_id: string | number | null;
};

export type BrokenExtinguisherListResponse = {
    message: string;
    data: {
        apar_broken: BrokenExtinguisher[];
    };
};

export async function getBrokenExtinguisherList(): Promise<BrokenExtinguisher[]> {
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

    const res = await fetch(`${API_BASE_URL}/product/list_apar_broken`, {
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
        throw new Error('Gagal mengambil daftar APAR rusak.');
    }

    const data: BrokenExtinguisherListResponse = await res.json();
    return data.data.apar_broken;
}

// Get count of broken extinguishers
export type BrokenExtinguisherCountResponse = {
    message: string;
    data: {
        apar_broken: number;
    };
};

export async function getBrokenExtinguisherCount(): Promise<number> {
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

    const res = await fetch(`${API_BASE_URL}/product/count_apar_broken`, {
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
        throw new Error('Gagal mengambil jumlah APAR rusak.');
    }

    const data: BrokenExtinguisherCountResponse = await res.json();
    return data.data.apar_broken;
}

export type BrokenPart = {
    id: number;
    kode_customer: string;
    nama_detail_activity: string;
    total_rusak: number;
    last_user_id: number;
    created_at: string;
    updated_at: string;
    persentase_rusak: number;
};

export type BrokenPartListResponse = {
    message: string;
    data: BrokenPart[];
};

export async function getBrokenExtinguisherParts(): Promise<BrokenPart[]> {
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

    const res = await fetch(`${API_BASE_URL}/inspection/part_broken_list`, {
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
        throw new Error('Gagal mengambil data part APAR yang rusak.');
    }

    const data: BrokenPartListResponse = await res.json();
    return data.data;
}

export type ExtinguisherCountResponse = {
    message: string;
    data: number;
};

export async function getExtinguisherCount(): Promise<number> {
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

    const res = await fetch(`${API_BASE_URL}/product/count_apar`, {
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
        throw new Error('Gagal mengambil jumlah APAR.');
    }

    const data: ExtinguisherCountResponse = await res.json();
    return data.data;
}

export type InspectedExtinguisherCountResponse = {
    message: string;
    data: {
        totalAparInspection: number;
    };
};

export async function getInspectedExtinguisherCount(): Promise<number> {
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

    const res = await fetch(`${API_BASE_URL}/product/count_apar_inspection`, {
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
        throw new Error('Gagal mengambil jumlah APAR yang telah diinspeksi.');
    }

    const data: InspectedExtinguisherCountResponse = await res.json();
    return data.data.totalAparInspection;
}

export type InspectedExtinguisherPercentage = {
    persentase: string;
    count_apar: number;
};

export type InspectedExtinguisherPercentageResponse = {
    message: string;
    data: InspectedExtinguisherPercentage;
};

export async function getInspectedExtinguisherPercentage(): Promise<InspectedExtinguisherPercentage> {
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

    const res = await fetch(`${API_BASE_URL}/product/apar_done_permount`, {
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
        throw new Error('Gagal mengambil persentase APAR yang telah diinspeksi.');
    }

    const data: InspectedExtinguisherPercentageResponse = await res.json();
    return data.data;
}

export type InspectionStats = {
    totalInspection: number;
    totalNotRusak: number;
    totalRusak: number;
    percentageNotRusak: number;
    percentageRusak: number;
};

export type InspectionStatsResponse = {
    message: string;
    data: InspectionStats;
};

export async function getInspectionStats(): Promise<InspectionStats> {
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

    const res = await fetch(`${API_BASE_URL}/product/count_apar_inspection_done`, {
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
        throw new Error('Gagal mengambil statistik inspeksi.');
    }

    const data: InspectionStatsResponse = await res.json();
    return data.data;
}

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
    building_name: string | null;
    placement_point_name: string | null;
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

export async function getExtinguisherList(params?: { lokasi?: string; search?: string }): Promise<Extinguisher[]> {
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

    // Build query string if params are provided
    let url = `${API_BASE_URL}/product/list_apar`;
    if (params && (params.lokasi || params.search)) {
        const query = new URLSearchParams();
        if (params.lokasi) query.append('lokasi', params.lokasi);
        if (params.search) query.append('search', params.search);
        url += `?${query.toString()}`;
    }

    const res = await fetch(url, {
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

export type ExtinguisherInventoryPdfResponse = {
    message: string;
    download_url: string;
};

export async function getExtinguisherInventoryPdfUrl(): Promise<ExtinguisherInventoryPdfResponse> {
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

    const res = await fetch(`${API_BASE_URL}/product/apar_pdf`, {
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
        throw new Error('Gagal mengambil link download laporan inventaris APAR.');
    }

    return res.json();
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

export type ExtinguisherDetail = Extinguisher & {
    detail_pressure: string | null;
    detail_hose: string | null;
    detail_head_valve: string | null;
    detail_korosi: string | null;
    detail_expired: string | null;
};

// temporary as response provide no example
type ExtinguisherHistoryItem = Record<string, unknown>;

export type ExtinguisherDetailResponse = {
    success: boolean;
    message: string;
    data: ExtinguisherDetail;
    history: ExtinguisherHistoryItem[];
};

export async function getExtinguisherDetail(id_barang: string): Promise<ExtinguisherDetailResponse> {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const res = await fetch(`${API_BASE_URL}/product/detail_apar?id_barang=${id_barang}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error('Gagal mengambil detail APAR.');
    }

    const result: ExtinguisherDetailResponse = await res.json();
    if (!result.success) {
        throw new Error(result.message || 'Gagal mengambil detail APAR.');
    }
    return result;
}
    // Update extinguisher request
    export type UpdateExtinguisherParams = {
        id: string;
        deskripsi: string;
        brand: string;
        type: string;
        media: string;
        kapasitas: string;
        tanggal_produksi: string; // Format: YYYY-MM-DD
        tanggal_kadaluarsa: string; // Format: YYYY-MM-DD
        lokasi: string;
        titik_penempatan_id: string;
    };

    export type UpdateExtinguisherResponse = {
        success: boolean;
        message: string;
    };

    export async function updateExtinguisher(params: UpdateExtinguisherParams): Promise<UpdateExtinguisherResponse> {
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
        formData.append('id', params.id);
        if (params.deskripsi) formData.append('deskripsi', params.deskripsi);
        if (params.brand) formData.append('brand', params.brand);
        if (params.type) formData.append('type', params.type);
        if (params.media) formData.append('media', params.media);
        if (params.kapasitas) formData.append('kapasitas', params.kapasitas);
        if (params.tanggal_produksi) formData.append('tanggal_produksi', params.tanggal_produksi);
        if (params.tanggal_kadaluarsa) formData.append('tanggal_kadaluarsa', params.tanggal_kadaluarsa);
        if (params.lokasi) formData.append('lokasi', params.lokasi);
        if (params.titik_penempatan_id) formData.append('titik_penempatan_id', params.titik_penempatan_id);

        const res = await fetch(`${API_BASE_URL}/product/update_apar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // Do NOT set Content-Type when using FormData
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
            throw new Error('Gagal memperbarui produk.');
        }

        const result: UpdateExtinguisherResponse = await res.json();
        if (!result.success) {
            throw new Error(result.message || 'Gagal memperbarui produk.');
        }
        return result;
    }