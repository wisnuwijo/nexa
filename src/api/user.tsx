import { API_BASE_URL } from "./config";

export type UserActivity = {
	id: number;
	aktivitas_by: string;
	aktivitas_name: string;
	tanggal: string;
	created_by: string;
	created_at: string;
	updated_by: string | null;
	update_at: string | null;
	deleted_by: string | null;
	deleted_at: string | null;
};

export type UserActivityListResponse = {
	message: string;
	data: UserActivity[];
};

export async function showUserActivity(): Promise<UserActivity[]> {
	// Get token from cookies
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('token='))
		?.split('=')[1];

	if (!token) {
		setTimeout(() => {
			// If you have a logout function, call it here
			window.location.reload();
		}, 2000);
		throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
	}

    const res = await fetch(`${API_BASE_URL}/aktivitas/show_aktivitas`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/json',
		},
	});

	if (!res.ok) {
		if (res.status === 401) {
			setTimeout(() => {
				// If you have a logout function, call it here
				window.location.reload();
			}, 2000);
			throw new Error('Sesi telah berakhir. Silakan login kembali.');
		}
		throw new Error('Gagal mengambil data aktivitas user.');
	}

	const data: UserActivityListResponse = await res.json();
	return data.data;
}
