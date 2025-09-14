'use client';

import { useEffect, useState } from 'react';
import { getExtinguisherCount, getBrokenExtinguisherParts } from '@/api/extinguisher';
import { showUserActivity, UserActivity } from '@/api/user';
import MainLayout from '../components/main_layout';
import { User, generateOtp, verifyOtp } from '@/api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage() {
  const [extinguisherCount, setExtinguisherCount] = useState<number | null>(null);
  const [extinguisherCountLoading, setExtinguisherCountLoading] = useState(true);
  const [defects, setDefects] = useState<{ name: string; percentage: number }[]>([]);

  // Map for translation and icon
  const defectNameMap: Record<string, { label: string; icon: string }> = {
    expired: { label: 'Kedaluwarsa', icon: '⏰' },
    korosi: { label: 'Korosi', icon: '🦠' },
    pressure: { label: 'Tekanan', icon: '💨' },
    selang: { label: 'Selang', icon: '🧵' },
    head_valve: { label: 'Head Valve', icon: '🔩' },
  };
  const [defectsLoading, setDefectsLoading] = useState(true);

  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [userActivityLoading, setUserActivityLoading] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // State for email verification modal
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const salutation = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Selamat pagi!';
    if (hour >= 12 && hour < 15) return 'Selamat siang!';
    if (hour >= 15 && hour < 18) return 'Selamat sore!';
    return 'Selamat malam!';
  })();

  useEffect(() => {
    // Fetch user activity
    setUserActivityLoading(true);
    showUserActivity()
      .then(data => setUserActivity(data))
      .catch(() => setUserActivity([]))
      .finally(() => setUserActivityLoading(false));
    // Check if user is logged in
    const usr = localStorage.getItem('user');
    if (!usr) {
      window.location.href = '/login?redirect=/home';
      return;
    } else if (user == null) {
      const parsedUser = JSON.parse(usr) as User;
      setUser(parsedUser);
    }

    // Fetch extinguisher count
    setExtinguisherCountLoading(true);
    getExtinguisherCount()
      .then(count => setExtinguisherCount(count))
      .catch(() => setExtinguisherCount(null))
      .finally(() => setExtinguisherCountLoading(false));

    // Fetch broken extinguisher parts
    setDefectsLoading(true);
    getBrokenExtinguisherParts()
      .then(parts => setDefects(parts.map(part => ({ name: part.nama_detail_activity, percentage: part.persentase_rusak }))))
      .catch(() => setDefects([]))
      .finally(() => setDefectsLoading(false));
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isVerifyModalOpen) {
      setTimer(60);
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval!);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVerifyModalOpen]);

  const handleSendVerification = async () => {
    if (!user?.email) return;
    const toastId = toast.loading("Mengirim email verifikasi...");
    try {
      await generateOtp(user.email);
      toast.update(toastId, { render: "Email verifikasi telah dikirim!", type: "success", isLoading: false, autoClose: 3000 });
      setIsVerifyModalOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengirim email.";
      toast.update(toastId, { render: message, type: "error", isLoading: false, autoClose: 5000 });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Kode OTP harus 6 digit.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!user?.email) {
        throw new Error("Email pengguna tidak ditemukan.");
      }
      const response = await verifyOtp(user.email, otp);
      toast.success(response.message);
      setUser(response.user); // Update user state to re-render UI
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsVerifyModalOpen(false);
      setOtp('');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verifikasi gagal.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    const toastId = toast.loading("Mengirim ulang email verifikasi...");
    try {
      await generateOtp(user.email);
      toast.update(toastId, { render: "Email verifikasi telah dikirim ulang!", type: "success", isLoading: false, autoClose: 3000 });
      setTimer(60); // Reset timer
      setCanResend(false); // Hide resend button and show timer
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengirim ulang email.";
      toast.update(toastId, { render: message, type: "error", isLoading: false, autoClose: 5000 });
    }
  };

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-center" />
        <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
          {/* Header */}
          <div className="flex justify-between items-center py-6">
            <div>
              <h3 className="text-gray-500 text-sm mt-1">{salutation}</h3>
              <h1 className="text-gray-900 text-xl font-bold">{user?.name}</h1>
            </div>
          </div>

          {/* Email Verification CTA */}
          {user && user.akun_aktif === 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-lg shadow-sm">
              <p className="font-bold">Verifikasi Email Anda</p>
              <p className="text-sm mt-1">
                Akun Anda belum aktif. Verifikasi email untuk dapat mereset kata sandi dan menggunakan semua fitur.
              </p>
              <button
                onClick={handleSendVerification}
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1.5 px-4 rounded text-sm transition-colors"
              >
                Verifikasi Sekarang
              </button>
            </div>
          )}

          <MetricCard
            title="Jumlah APAR"
            value={extinguisherCountLoading ? '...' : (extinguisherCount ?? '-')}
            icon="🧯"
          />

          {/* <MetricCard
            title="APAR Selesai Inspeksi Bulan Ini"
            value={`2 (20%)`}
            icon="✅"
          /> */}

          {/* Defect Breakdown */}
          <div className="bg-white mb-4 p-6 rounded-lg shadow">
            <h2 className="text-xl text-gray-500 font-semibold mb-4">📊 Analisis Kerusakan</h2>
            <div className="space-y-3 text-gray-500">
              {defectsLoading ? (
                <div>Memuat data kerusakan...</div>
              ) : defects.length === 0 ? (
                <div>Tidak ada data kerusakan part APAR.</div>
              ) : (
                defects.map((defect, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 mt-5">
                      <span>
                        {defectNameMap[defect.name]?.icon || '❓'}{' '}
                        {defectNameMap[defect.name]?.label || defect.name}
                      </span>
                      <span>{defect.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${defect.percentage <= 100 ? defect.percentage : 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">📝 Riwayat Aktivitas Terbaru</h2>
            <div className="space-y-3 text-gray-500">
              {userActivityLoading ? (
                <div>Memuat aktivitas...</div>
              ) : userActivity.length === 0 ? (
                <div>Tidak ada aktivitas ditemukan.</div>
              ) : (
                (showAllActivity ? userActivity : userActivity.slice(0, 5)).map((activity) => (
                  <div key={activity.id} className="border-b pb-2 last:border-0">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{activity.aktivitas_name}</span>
                      <span className="ml-2">({new Date(activity.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {userActivity.length > 5 && (
              <button
                className="mt-4 w-full text-purple-600 hover:underline text-sm font-medium"
                onClick={() => setShowAllActivity(v => !v)}
              >
                {showAllActivity ? 'Tampilkan lebih sedikit' : 'Tampilkan semua'}
              </button>
            )}
          </div>

          {/* Email Verification Modal */}
          {isVerifyModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsVerifyModalOpen(false)}>
              <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Verifikasi Email</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Masukkan 6 digit kode verifikasi yang kami kirimkan ke email <span className="font-medium">{user?.email}</span>.
                </p>
                <p className="text-xs text-gray-500 mb-4 -mt-2">
                  Kode berlaku selama 1 menit.
                </p>
                <form onSubmit={handleVerifyOtp}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    className="w-full text-center tracking-[1em] text-2xl text-gray-500 font-mono bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="------"
                    required
                  />
                  <div className="text-center mt-4 text-sm text-gray-500">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="text-purple-600 hover:underline font-medium"
                      >
                        Kirim ulang kode
                      </button>
                    ) : (
                      <p>Kirim ulang kode dalam {timer} detik</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsVerifyModalOpen(false)}
                      className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-1/2 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                      {isSubmitting ? 'Memverifikasi...' : 'Verifikasi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

function MetricCard({ title, value, icon, isGood = false, isWarning = false }: {
  title: string;
  value: string | number;
  icon: string;
  isGood?: boolean;
  isWarning?: boolean
}) {
  let bgColor = 'bg-white';
  let textColor = 'text-gray-800';

  if (isGood) {
    bgColor = 'bg-green-50';
    textColor = 'text-green-600';
  } else if (isWarning) {
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-600';
  }

  return (
    <div className={`${bgColor} p-4 mb-3 rounded-lg shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`mt-1 text-2xl font-semibold ${textColor}`}>{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}