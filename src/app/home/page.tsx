'use client';

import { useState } from 'react';
import MainLayout from '../components/main_layout';

export default function HomePage() {
  const [defects] = useState([
    { name: 'Low Pressure', percentage: 45 },
    { name: 'Broken Seal', percentage: 20 },
    { name: 'Obstructed', percentage: 10 },
  ]);

  const [recentActivity] = useState([
    { inspector: 'Mark', action: 'passed', id: 33, time: '2h ago' },
    { inspector: 'Ana', action: 'failed', id: 12, reason: 'Low pressure', time: '4h ago' },
  ]);

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[430px] mx-auto px-4 pb-24">
          {/* Header */}
          <div className="flex justify-between items-center py-6">
            <div>
              <h3 className="text-gray-500 text-sm mt-1">Selamat malam!</h3>
              <h1 className="text-gray-900 text-xl font-bold">Wisnu Wijokangko</h1>
            </div>
          </div>

          <MetricCard 
            title="Jumlah APAR" 
            value={10} 
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
              {defects.map((defect, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{defect.name}</span>
                    <span>{defect.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${defect.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">📝 Riwayat Aktivitas Terbaru</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Inspector {activity.inspector}</span> {activity.action} #{activity.id}{' '}
                    {activity.action === 'failed' && `- "${activity.reason}"`} <span className="text-gray-500">({activity.time})</span>
                  </div>
                </div>
              ))}
            </div>
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