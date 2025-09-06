'use client';

import { useEffect, useState } from 'react';
import { getExtinguisherCount, getBrokenExtinguisherParts } from '@/api/extinguisher';
import { showUserActivity } from '@/api/user';
import MainLayout from '../components/main_layout';
import { User } from '@/api/auth';

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

  const [userActivity, setUserActivity] = useState<import('@/api/user').UserActivity[]>([]);
  const [userActivityLoading, setUserActivityLoading] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);

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

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[430px] md:max-w-full mx-auto px-4 pb-24">
          {/* Header */}
          <div className="flex justify-between items-center py-6">
            <div>
              <h3 className="text-gray-500 text-sm mt-1">{salutation}</h3>
              <h1 className="text-gray-900 text-xl font-bold">{user?.name}</h1>
            </div>
          </div>

          <MetricCard
            title="Jumlah APAR"
            value={extinguisherCountLoading ? '...' : (extinguisherCount ?? '-')}
            icon="🧯"
          />

          <MetricCard
            title="APAR Selesai Inspeksi Bulan Ini"
            value={`2 (20%)`}
            icon="✅"
          />

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
                        style={{ width: `${defect.percentage}%` }}
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
            <div className="space-y-3">
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