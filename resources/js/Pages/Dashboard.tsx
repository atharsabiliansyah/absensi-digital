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
import {
  INITIAL_RECENT_ATTENDANCE,
  INITIAL_STATS,
  AttendanceRecord,
} from '../data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [records] = useState<AttendanceRecord[]>(INITIAL_RECENT_ATTENDANCE);
  const [stats] = useState(INITIAL_STATS);

  // Time & Date format for real-time sync
  const getFormattedTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
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
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<AttendanceRecord | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [attendanceNotif, setAttendanceNotif] = useState<{ nama: string; waktu: string } | null>(null);

  // Auto-hide attendance notification after 6 seconds
  useEffect(() => {
    if (attendanceNotif) {
      const timer = setTimeout(() => {
        setAttendanceNotif(null);
      }, 6000);
      return () => clearTimeout(timer);
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
      {/* 1. Left Sidebar Navigation (Desktop only) */}
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
        {/* Top Header Bar (Desktop always; Mobile only on non-dashboard tabs) */}
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
              {/* MOBILE DASHBOARD (Screens < 768px matching mobile screenshot) */}
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

              {/* DESKTOP DASHBOARD (Screens >= 768px matching desktop screenshot) */}
              <div className="hidden md:block space-y-7">
                {/* Welcome Greeting */}
                <div className="mb-7 text-left">
                  <h1 className="text-[34px] lg:text-[36px] font-bold text-[#1e293b] tracking-tight leading-tight">
                    Selamat Datang, Admin Sekolah
                  </h1>
                  <p className="text-[15.5px] text-slate-400 mt-1.5 font-normal">
                    Pantau presensi siswa secara real-time
                  </p>
                </div>

                {/* Main 2-Column Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                  {/* Left Column: Recent Attendance Table (~67% width) */}
                  <div className="lg:col-span-8 flex flex-col">
                    <RecentAttendanceTable
                      records={records}
                      onViewAllClick={() => setActiveTab('presensi')}
                      onSelectRecord={(rec) => setSelectedStudentDetail(rec)}
                    />
                  </div>

                  {/* Right Column: 4 Vertical Stacked Summary Cards (~33% width) */}
                  <div className="lg:col-span-4 flex flex-col gap-5">
                    {/* 1. Hadir Card */}
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

                    {/* 2. Terlambat Card */}
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

                    {/* 3. Tidak Hadir Card */}
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

                    {/* 4. Total Siswa Card */}
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

        {/* Global Footer (Desktop only) */}
        <footer className="hidden md:block mt-auto py-6 px-8 border-t border-slate-200/60 text-center">
          <p className="text-[12.5px] text-slate-400 font-normal">
            © 2026 SMK PGRI 11 CILEDUG • Sistem Presensi Digital Berbasis RFID dan IoT
          </p>
        </footer>

        {/* Mobile Bottom Navigation Bar (Screens < 768px matching curved UI/UX design) */}
        <CurvedMobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        record={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
      />

      {/* Logout Confirmation Modal */}
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

      {/* Real-time Presensi Toast Notification (Matches user image exactly) */}
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
