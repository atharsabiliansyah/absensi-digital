import { usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
  User,
  Clock,
  AlertTriangle,
  Globe,
  LogOut,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';
import { Sidebar, NavTab } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { RecentAttendanceTable } from '../components/RecentAttendanceTable';
import { StudentDetailModal } from '../components/StudentDetailModal';
import { PresensiPageView } from '../components/PresensiPageView';
import { DataSiswaPageView } from '../components/DataSiswaPageView';
import { LaporanPageView } from '../components/LaporanPageView';
import { PengaturanPageView } from '../components/PengaturanPageView';
import { MobileDashboardView } from '../components/MobileDashboardView';
import { CurvedMobileBottomNav } from '../components/CurvedMobileBottomNav';

// Helper untuk memastikan properti nama siswa terbaca di semua format komponen tabel
const formatRecord = (item: any) => {
  const studentName = item.siswa?.nama_siswa || item.namaSiswa || item.nama || item.nama_siswa || '-';
  return {
    id: item.id,
    waktu: item.waktu,
    waktu_pulang: item.waktu_pulang,
    nama: studentName,
    namaSiswa: studentName,
    nama_siswa: studentName,
    kelas: item.siswa?.kelas?.nama_kelas || item.kelas || '-',
    jurusan: item.siswa?.kelas?.jurusan || item.jurusan || '-',
    status: item.status,
  };
};

export default function App() {
  // 1. Ambil data dari Backend Laravel
  const { auth, presensi = [], stats: backendStats } = usePage<any>().props;

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Hitung persentase untuk StatCard
  const totalAwal = backendStats?.total_siswa || 1;
  const hadirPercentNum = Math.round(((backendStats?.hadir || 0) / totalAwal) * 100);
  const terlambatPercentNum = Math.round(((backendStats?.terlambat || 0) / totalAwal) * 100);
  const tidakHadirPercentNum = Math.round(((backendStats?.tidak_hadir || 0) / totalAwal) * 100);

  // 2. State dinamis terformat
  const [records, setRecords] = useState<any[]>(() => presensi.map(formatRecord));
  const [stats, setStats] = useState({
    hadir: backendStats?.hadir || 0,
    terlambat: backendStats?.terlambat || 0,
    tidakHadir: backendStats?.tidak_hadir || 0,
    totalSiswa: backendStats?.total_siswa || 0,
    hadirPercent: hadirPercentNum,
    terlambatPercent: terlambatPercentNum,
    tidakHadirPercent: tidakHadirPercentNum,
    totalPercent: 100,
  });

  // Time & Date format
  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime);
  const [currentDate, setCurrentDate] = useState<string>(getFormattedDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentDate(getFormattedDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals & Popups
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [attendanceNotif, setAttendanceNotif] = useState<{ nama: string; waktu: string } | null>(null);

  // 3. Polling Real-time: Cek data baru ke Laravel setiap 2.5 detik
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch('/api/dashboard-data');
        if (response.ok) {
          const data = await response.json();

          // Pemicu Notifikasi jika ada data tap baru
          if (data.presensi && data.presensi.length > records.length) {
            const newest = data.presensi[0];
            if (newest) {
              const nameToShow = newest.siswa?.nama_siswa || newest.namaSiswa || newest.nama || 'Siswa';
              setAttendanceNotif({
                nama: nameToShow,
                waktu: newest.waktu,
              });
            }
          }

          // Format ulang record agar sesuai tabel
          const formattedRecords = data.presensi.map(formatRecord);
          setRecords(formattedRecords);

          // Update Angka Statistik
          const total = data.stats.total_siswa || 1;
          setStats({
            hadir: data.stats.hadir,
            terlambat: data.stats.terlambat,
            tidakHadir: data.stats.tidak_hadir,
            totalSiswa: data.stats.total_siswa,
            hadirPercent: Math.round((data.stats.hadir / total) * 100),
            terlambatPercent: Math.round((data.stats.terlambat / total) * 100),
            tidakHadirPercent: Math.round((data.stats.tidak_hadir / total) * 100),
            totalPercent: 100,
          });
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data presensi:", error);
      }
    };

    const interval = setInterval(fetchLatestData, 2500);
    return () => clearInterval(interval);
  }, [records.length]);

  // Auto-hide notification
  useEffect(() => {
    if (attendanceNotif) {
      const timer = setTimeout(() => {
        setAttendanceNotif(null);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [attendanceNotif]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 pl-0 transition-all duration-300">
        <div className={activeTab === 'dashboard' ? 'hidden md:block' : 'block'}>
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onLogoutClick={() => setIsLogoutModalOpen(true)}
          />
        </div>

        {/* Dynamic Main View */}
        <main className="flex-1 px-3 sm:px-10 py-4 sm:py-8 w-full pb-28 md:pb-8 max-w-full overflow-x-hidden">
          {activeTab === 'presensi' && <PresensiPageView />}
          {activeTab === 'data-siswa' && <DataSiswaPageView />}
          {activeTab === 'laporan' && <LaporanPageView />}
          {activeTab === 'pengaturan' && <PengaturanPageView />}

          {activeTab === 'dashboard' && (
            <>
              {/* MOBILE DASHBOARD */}
              <div className="block md:hidden">
                <MobileDashboardView
                  onSelectRecord={(rec) => setSelectedStudentDetail(rec)}
                  currentTime={currentTime}
                  currentDate={currentDate}
                  onNavigate={(tab) => {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  onLogoutClick={() => setIsLogoutModalOpen(true)}
                />
              </div>

              {/* DESKTOP DASHBOARD */}
              <div className="hidden md:block space-y-7">
                <div className="mb-7 text-left">
                  <h1 className="text-2xl font-bold">Selamat Datang, {auth?.user?.name ?? 'Untung Sudarto'}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                  {/* Tabel Presensi Terbaru */}
                  <div className="lg:col-span-8 flex flex-col">
                    <RecentAttendanceTable
                      records={records}
                      onViewAllClick={() => setActiveTab('presensi')}
                      onSelectRecord={(rec) => setSelectedStudentDetail(rec)}
                    />
                  </div>

                  {/* Ringkasan Kartu Statistik */}
                  <div className="lg:col-span-4 flex flex-col gap-5">
                    <StatCard
                      label="Hadir"
                      count={stats.hadir}
                      percentage={stats.hadirPercent}
                      icon={User}
                      bgColor="bg-[#dcfce7]"
                      iconColor="text-[#16a34a]"
                      percentageColor="text-[#16a34a]"
                      onClick={() => setActiveTab('presensi')}
                    />

                    <StatCard
                      label="Terlambat"
                      count={stats.terlambat}
                      percentage={stats.terlambatPercent}
                      icon={Clock}
                      bgColor="bg-[#fef3c7]"
                      iconColor="text-[#d97706]"
                      percentageColor="text-[#d97706]"
                      onClick={() => setActiveTab('presensi')}
                    />

                    <StatCard
                      label="Tidak Hadir"
                      count={stats.tidakHadir}
                      percentage={stats.tidakHadirPercent}
                      icon={AlertTriangle}
                      bgColor="bg-[#ffe4e6]"
                      iconColor="text-[#e11d48]"
                      percentageColor="text-[#e11d48]"
                      onClick={() => setActiveTab('presensi')}
                    />

                    <StatCard
                      label="Total Siswa"
                      count={stats.totalSiswa}
                      percentage={stats.totalPercent}
                      icon={Globe}
                      bgColor="bg-[#dbeafe]"
                      iconColor="text-[#2563eb]"
                      percentageColor="text-[#2563eb]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="hidden md:block mt-auto py-6 px-8 border-t border-slate-200/60 text-center">
          <p className="text-[12.5px] text-slate-400 font-normal">
            © 2026 SMK PGRI 11 CILEDUG • Sistem Presensi Digital Berbasis RFID dan IoT
          </p>
        </footer>

        <CurvedMobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      </div>

      <StudentDetailModal
        record={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
      />

      {/* Modal Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3.5">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Keluar</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Apakah Anda yakin ingin keluar dari Sistem Presensi Digital SMK PGRI 11 Ciledug?
            </p>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  triggerToast('Sesi Admin Sekolah tetap aman.');
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Presensi Toast Notification */}
      {attendanceNotif && (
        <div className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-l-4 border-l-emerald-500 border border-slate-100 p-3.5 sm:p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h5 className="text-[13px] sm:text-[13.5px] font-bold text-slate-900 leading-tight">
              Presensi Berhasil
            </h5>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
              Siswa atas nama <span className="font-bold text-slate-800">{attendanceNotif.nama}</span> berhasil dicatat pada pukul{' '}
              <span className="font-mono text-emerald-600 font-semibold">{attendanceNotif.waktu}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAttendanceNotif(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}