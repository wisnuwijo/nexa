import { API_BASE_URL } from "./config";

export function logout() {
    // Clear only the 'token' cookie
    if (typeof document !== "undefined") {
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    localStorage.clear();
}

export async function login(email: string, password: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            // Do NOT set Content-Type when using FormData; browser will set it with boundary
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Email atau password tidak valid.');
        }
        
        console.log("res.body", res.body);
        throw new Error('Login gagal.');
    }
    return res.json();
}

export async function resetPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/forget_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: email
        }),
    });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Email tidak ditemukan.');
        } else if (res.status === 422) {
            throw new Error('Email tidak valid.');
        }
        
        console.log("res.body", res.body);
        throw new Error('Reset password gagal.');
    }
    return res.json();
}

export async function register(params: RegisterParams) {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('username', params.username);
    formData.append('gender', params.gender);
    formData.append('email', params.email);
    formData.append('password', params.password);
    formData.append('nama_organisasi', params.jenis_customer == "PERSONAL" ? params.name : params.nama_organisasi);
    formData.append('email_organisasi', params.jenis_customer == "PERSONAL" ? params.email : params.email_organisasi);
    formData.append('jenis_customer', params.jenis_customer);
    formData.append('alamat', params.alamat);
    formData.append('telpon', params.telpon);

    const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            // Do NOT set Content-Type when using FormData; browser will set it with boundary
        },
        body: formData,
    });

    if (!res.ok) {
        if (res.status === 422) {
            const errorData = await res.json();
            // Throw only the first error message from the errors object, in Indonesian
            const firstErrorKey = Object.keys(errorData.errors)[0];
            let errorMsg = 'Registrasi gagal: data tidak valid.';
            if (firstErrorKey === 'username') {
                if (errorData.errors.username.includes("The username has already been taken.")) {
                    errorMsg = 'Username sudah digunakan.';
                } else {
                    errorMsg = 'Username tidak valid.';
                }
            } else if (firstErrorKey === 'email') {
                if (errorData.errors.email.includes("The email has already been taken.")) {
                    errorMsg = 'Email sudah digunakan.';
                } else {
                    errorMsg = 'Email tidak valid.';
                }
            } else if (firstErrorKey === 'name') {
                errorMsg = 'Nama tidak valid.';
            } else if (firstErrorKey === 'password') {
                errorMsg = 'Password tidak valid.';
            } else if (firstErrorKey === 'nama_organisasi') {
                errorMsg = 'Nama organisasi tidak valid.';
            } else if (firstErrorKey === 'jenis_customer') {
                errorMsg = 'Jenis customer tidak valid.';
            } else if (firstErrorKey === 'alamat') {
                errorMsg = 'Alamat tidak valid.';
            } else if (firstErrorKey === 'telpon') {
                errorMsg = 'Nomor telepon tidak valid.';
            } else if (firstErrorKey === 'email_organisasi') {
                errorMsg = 'Email organisasi tidak valid atau sudah digunakan.';
            }
            
            throw new Error(errorMsg);
        }

        console.log("res.body", res.body);
        throw new Error('Registrasi gagal.');
    }
    return res.json();
}

export function getCurrentUser(): User | null {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return null;
    }
    
    try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            return null;
        }
        
        const userData = JSON.parse(userJson);
        return userData as User;
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
    }
}

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
    created_by: string | null;
    created_at: string;
    updated_by: string | null;
    updated_at: string;
    deleted_at: string | null;
};

export type RegisterParams = {
    name: string;
    username: string;
    gender: string;
    email: string;
    password: string;
    konfirmasi_password: string;
    nama_organisasi: string;
    jenis_customer: string;
    alamat: string;
    telpon: string;
    email_organisasi: string;
};