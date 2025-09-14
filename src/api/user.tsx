import { API_BASE_URL } from "./config";
import { getCurrentUser, logout } from './auth';

// Update user profile picture
export type UpdateUserProfilePictureResponse = {
	message: string;
	data: {
		id: number;
		name: string;
		username: string;
		email: string;
		email_verified_at: string | null;
		code_verifikasi: string | null;
		akun_aktif: number;
		id_level: number;
		gender: string;
		kode_customer: string;
		image: string | null;
		created_by: string | null;
		created_at: string;
		updated_by: string | null;
		updated_at: string;
		deleted_at: string | null;
	};
};

export async function updateUserProfilePicture(id: number | string, file: File): Promise<UpdateUserProfilePictureResponse> {
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
	formData.append('id', String(id));
	formData.append('foto_profile', file);

	const res = await fetch(`${API_BASE_URL}/customer/update_foto_profile`, {
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
		throw new Error('Gagal memperbarui foto profil.');
	}

	const data: UpdateUserProfilePictureResponse = await res.json();
	return data;
}

export type UpdateUserProfileParams = {
	id: number | string;
	name: string;
	username: string;
	email: string;
	password?: string;
};

export type UpdateUserProfileResponse = {
	message: string;
	data: {
		id: number;
		name: string;
		username: string;
		email: string;
		email_verified_at: string | null;
		code_verifikasi: number | string | null;
		akun_aktif: number;
		id_level: number | string;
		gender: string;
		kode_customer: string;
		image: string | null;
		created_by: string | null;
		created_at: string;
		updated_by: number | string | null;
		updated_at: string;
		deleted_at: string | null;
	};
};

export async function updateUserProfile(params: UpdateUserProfileParams): Promise<UpdateUserProfileResponse> {
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
	formData.append('id', String(params.id));
	formData.append('name', params.name);
	formData.append('username', params.username);
	formData.append('email', params.email);

	if (params.password) {
		formData.append('password', params.password);
	}

	const user = getCurrentUser();
	if (user != null) {
		formData.append('level', user.id_level.toString());
	}

	const res = await fetch(`${API_BASE_URL}/customer/update`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/json',
		},
		body: formData,
	});

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({ message: 'Gagal memperbarui profil.' }));
		throw new Error(errorData.message || 'Gagal memperbarui profil.');
	}

	return res.json();
}

// Create user
export type CreateUserParams = {
	name: string;
	username: string;
	email: string;
	password: string;
	level: string | number;
	gender: string | number;
};

export type CreateUserSuccessResponse = {
	message: string;
	data: {
		name: string;
		username: string;
		email: string;
		kode_customer: string;
		id_level: string;
		akun_aktif: number;
		gender: string;
		created_by: number;
		updated_at: string;
		created_at: string;
		id: number;
	};
};

export type CreateUserErrorResponse = {
	success: false;
	message: string;
	errors: Record<string, string[]>;
};

export async function createUser(params: CreateUserParams): Promise<CreateUserSuccessResponse> {
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
	formData.append('name', params.name);
	formData.append('username', params.username);
	formData.append('email', params.email);
	formData.append('password', params.password);
	formData.append('level', String(params.level));
	formData.append('gender', String(params.gender));

	const res = await fetch(`${API_BASE_URL}/customer/add_customer`, {
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
		} else if (res.status === 422) {
			const errorData: CreateUserErrorResponse = await res.json();
			// Return the first error message found
			const firstKey = Object.keys(errorData.errors)[0];
			throw new Error(errorData.errors[firstKey][0] || 'Validasi gagal');
		}
		throw new Error('Gagal menambahkan user.');
	}

	const data: CreateUserSuccessResponse = await res.json();
	return data;
}

// User level/role types
export type UserLevel = {
	id: number;
	nama_level: string;
	created_at: string | null;
	updated_at: string | null;
};

export type UserLevelListResponse = {
	message: string;
	data: UserLevel[];
};

export async function getLevelList(): Promise<UserLevel[]> {
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

	const res = await fetch(`${API_BASE_URL}/customer/list_level`, {
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
		throw new Error('Gagal mengambil daftar level/role.');
	}

	const data: UserLevelListResponse = await res.json();
	return data.data;
}

// Delete user
export type DeleteUserResponse = {
	message: string;
};

export async function deleteUser(id: number | string): Promise<DeleteUserResponse> {
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

	const res = await fetch(`${API_BASE_URL}/customer/delete_user?id=${id}`, {
		method: 'DELETE',
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
		throw new Error('Gagal menghapus user.');
	}

	const data: DeleteUserResponse = await res.json();
	return data;
}

export type UserDetail = {
	id: number;
	name: string;
	username: string;
	email: string;
	email_verified_at: string | null;
	code_verifikasi: string | null;
	akun_aktif: number;
	id_level: number;
	gender: string;
	kode_customer: string;
	password: string;
	remember_token: string | null;
	image: string | null;
	created_by: string;
	created_at: string;
	updated_by: string | null;
	updated_at: string;
	deleted_at: string | null;
	nama_customer: string;
	nama_level: string;
};

export type UserDetailResponse = {
	message: string;
	data: UserDetail;
};

export async function getUserDetail(id: number | string): Promise<UserDetail> {
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

	const res = await fetch(`${API_BASE_URL}/customer/detail_user?id=${id}`, {
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
		throw new Error('Gagal mengambil detail user.');
	}

	const data: UserDetailResponse = await res.json();
	return data.data;
}

// User list types
export type User = {
	id: number;
	name: string;
	username: string;
	email: string;
	email_verified_at: string | null;
	code_verifikasi: string | null;
	akun_aktif: number;
	id_level: number;
	gender: string;
	kode_customer: string;
	image: string | null;
	created_by: string;
	created_at: string;
	updated_by: string | null;
	updated_at: string;
	deleted_at: string | null;
	nama_level: string;
};

export type UserListResponse = {
	message: string;
	data: User[];
};

export async function getUserList(): Promise<User[]> {
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

	const res = await fetch(`${API_BASE_URL}/customer/list_user`, {
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
		throw new Error('Gagal mengambil daftar user.');
	}

	const data: UserListResponse = await res.json();
	return data.data;
}

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