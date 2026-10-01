import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Wifi,
  User,
  Clock,
  UserX,
  Users,
  Check,
  ArrowLeft,
  Radio,
  FileText,
  X,
} from 'lucide-react';
import { PgriLogo } from './PgriLogo';
import { AttendanceRecord } from '../data/mockData';
import { NavTab } from './Sidebar';
import { NotificationModal } from './NotificationModal';
import { UserProfileModal } from './UserProfileModal';
import { useProfilePhoto } from '../utils/profilePhotoState';

interface MobileDashboardViewProps {
  onViewAllClick?: () => void;
  onSelectRecord?: (record: AttendanceRecord) => void;
  onNavigate?: (tab: NavTab) => void;
  onLogoutClick?: () => void;
  currentTime: string;
  currentDate: string;
}

export const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({
  onSelectRecord,
  onNavigate,
  onLogoutClick,
  currentTime,
  currentDate,
}) => {
  const { photo: teacherPhoto } = useProfilePhoto();
  // Toggle to show all 10 students directly scrolled down inside the dashboard
  const [showAllStudents, setShowAllStudents] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // 5 preview students on dashboard
  const previewAttendance = [
    {
      initials: 'IS',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Isa',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Hadir',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      waktu: '07:34:12 WIB',
    },
    {
      initials: 'BA',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Bador',
      kelas: 'X AKL',
      jurusan: 'AKL',
      status: 'Terlambat',
      statusBg: 'bg-amber-50 text-amber-600 border-amber-200',
      waktu: '07:32:45 WIB',
    },
    {
      initials: 'CI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Citra',
      kelas: 'XI OTPK',
      jurusan: 'OTPK',
      status: 'Hadir',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      waktu: '07:28:01 WIB',
    },
    {
      initials: 'DI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Dimas',
      kelas: 'X BDP',
      jurusan: 'BDP',
      status: 'Hadir',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      waktu: '07:21:17 WIB',
    },
    {
      initials: 'AN',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Andi',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Terlambat',
      statusBg: 'bg-amber-50 text-amber-600 border-amber-200',
      waktu: '07:18:33 WIB',
    },
  ];

  // Full 10 students matching user's left screenshot exactly
  const fullAttendance = [
    {
      initials: 'IS',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Isa',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Hadir',
      waktu: '07:34:12 WIB',
    },
    {
      initials: 'BA',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Bador',
      kelas: 'X AKL',
      jurusan: 'AKL',
      status: 'Terlambat',
      waktu: '07:32:45 WIB',
    },
    {
      initials: 'CI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Citra',
      kelas: 'XI OTPK',
      jurusan: 'OTPK',
      status: 'Hadir',
      waktu: '07:28:01 WIB',
    },
    {
      initials: 'DI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Dimas',
      kelas: 'X BDP',
      jurusan: 'BDP',
      status: 'Hadir',
      waktu: '07:21:17 WIB',
    },
    {
      initials: 'AN',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Andi',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Terlambat',
      waktu: '07:18:33 WIB',
    },
    {
      initials: 'IS',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Isa',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Hadir',
      waktu: '07:34:12 WIB',
    },
    {
      initials: 'BA',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Bador',
      kelas: 'X AKL',
      jurusan: 'AKL',
      status: 'Terlambat',
      waktu: '07:32:45 WIB',
    },
    {
      initials: 'CI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Citra',
      kelas: 'XI OTPK',
      jurusan: 'OTPK',
      status: 'Hadir',
      waktu: '07:28:01 WIB',
    },
    {
      initials: 'DI',
      initialBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      nama: 'Dimas',
      kelas: 'X BDP',
      jurusan: 'BDP',
      status: 'Hadir',
      waktu: '07:21:17 WIB',
    },
    {
      initials: 'AN',
      initialBg: 'bg-amber-50 text-amber-600 border-amber-200',
      nama: 'Andi',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Terlambat',
      waktu: '07:18:33 WIB',
    },
  ];

  // Default mobile dashboard view
  return (
    <div className="md:hidden pb-20 space-y-4 px-1 animate-in fade-in duration-200">
      {/* 1. Mobile Top Header Bar */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0 p-0.5 border border-slate-100 overflow-hidden">
            <PgriLogo size={34} />
          </div>
          <div className="leading-tight">
            <h1 className="text-[13.5px] font-bold text-slate-900 tracking-tight">
              SMK PGRI 11 CILEDUG
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Sistem Presensi RFID &amp; IoT
            </p>
          </div>
        </div>

        {/* Right notification bell & Avatar with photo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            style={{ width: '36px', height: '36px' }}
            className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors cursor-pointer"
            aria-label="Buka Notifikasi Sistem"
          >
            <Bell className="w-4 h-4 text-slate-600" />
          </button>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            style={{ width: '36px', height: '36px' }}
            className="relative w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all cursor-pointer p-0.5 bg-white shadow-2xs overflow-hidden"
            aria-label="Buka Profil Guru"
          >
            <img
              src={teacherPhoto}
              alt="Foto Profil Bapak/Ibu Guru"
              width={34}
              height={34}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="w-full h-full object-cover rounded-full block"
            />
          </button>
        </div>
      </div>

      {/* 2. Hero Gradient Card */}
      <div className="bg-gradient-to-br from-[#0c3260] via-[#104a8e] to-[#1e60d5] text-white rounded-[24px] p-5 relative overflow-hidden shadow-md">
        {/* RFID Wireless Signal Concentric Waves Watermark */}
        <div className="absolute -right-4 -top-4 w-40 h-40 pointer-events-none opacity-15">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-white">
            <circle cx="90" cy="10" r="20" strokeWidth="2.5" />
            <circle cx="90" cy="10" r="38" strokeWidth="2.5" />
            <circle cx="90" cy="10" r="56" strokeWidth="2.5" />
            <circle cx="90" cy="10" r="74" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Top Clock Pill & Date */}
        <div className="flex items-center justify-between text-xs relative z-10">
          <div className="bg-black/25 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-mono font-medium flex items-center gap-2 border border-white/10">
            <span>{currentTime || '07:35:21'} WIB</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-medium">
            <Calendar className="w-3.5 h-3.5 text-white/80" />
            <span>{currentDate || 'Senin, 25 Sep 2026'}</span>
          </div>
        </div>

        {/* Greeting & Identity */}
        <div className="mt-4 relative z-10">
          <h2 className="text-[17px] font-bold text-white tracking-tight leading-snug">
            Selamat Datang, Bapak Untung Sudarto
          </h2>
          <p className="text-[12px] text-white/80 font-medium mt-0.5">
            NIP. 198705123456
          </p>
        </div>

        {/* Role Pill Badge */}
        <div className="mt-3.5 relative z-10">
          <div className="bg-white text-[#1e3a8a] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold inline-flex items-center gap-1.5 shadow-xs">
            <GraduationCap className="w-4 h-4 text-[#1e3a8a] shrink-0" />
            <span>Wali Kelas XII TKJ 1 • Produktif TKJ</span>
          </div>
        </div>
      </div>

      {/* 3. Card: Presensi Terbaru (Langsung scroll ke bawah / expand in-place) */}
      <div
        style={{ padding: '16px 16px 18px 16px' }}
        className="bg-white rounded-[22px] p-4 sm:p-5 shadow-xs border border-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/60">
          <h3 className="text-[12px] font-bold text-slate-800 tracking-wider uppercase font-sans">
            PRESENSI TERBARU
          </h3>

          <button
            type="button"
            onClick={() => setShowAllStudents(!showAllStudents)}
            className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showAllStudents ? 'Tampilkan Ringkas' : 'Lihat Semua'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showAllStudents ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Student List - Langsung scroll kebawah di dalam card dashboard */}
        <div
          className={`divide-y divide-slate-100/80 transition-all duration-300 pt-0.5 ${
            showAllStudents
              ? 'max-h-[480px] overflow-y-auto pr-1 scrollbar-thin'
              : ''
          }`}
        >
          {(showAllStudents ? fullAttendance : previewAttendance).map((item, idx) => {
            const isHadir = item.status === 'Hadir';

            return (
              <div
                key={idx}
                onClick={() =>
                  onSelectRecord?.({
                    id: String(idx + 1),
                    nama: item.nama,
                    nisn: '00123' + idx,
                    rfidUid: 'A8-3F-90-C' + idx,
                    kelas: item.kelas,
                    jurusan: item.jurusan,
                    waktu: item.waktu.replace(' WIB', ''),
                    status: item.status as 'Hadir' | 'Terlambat',
                    tanggal: '25 Sep 2026',
                  })
                }
                className="py-3 px-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 rounded-xl transition-colors"
              >
                {/* Left Initials Circle & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    style={{ width: '36px', height: '36px' }}
                    className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full flex items-center justify-center font-bold text-[12px] border shrink-0 ${item.initialBg}`}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-slate-900 leading-snug truncate">
                      {item.nama}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium truncate">
                      {item.kelas} • {item.jurusan}
                    </div>
                  </div>
                </div>

                {/* Right Status Badge & Time */}
                <div className="text-right flex flex-col items-end shrink-0 pl-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${
                      isHadir
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80'
                        : 'bg-amber-50 text-amber-600 border-amber-200/80'
                    }`}
                  >
                    {isHadir ? (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <Clock className="w-3 h-3 stroke-[2.2]" />
                    )}
                    <span>{item.status}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 font-mono">
                    {item.waktu}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 5 Summary Cards Grid matching user screenshot */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Hadir */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#10b981] shrink-0">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="text-[12.5px] text-slate-400 font-medium">Hadir</div>
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              1.250
            </div>
          </div>
        </div>

        {/* Card 2: Terlambat */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#f59e0b] shrink-0">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[12.5px] text-slate-400 font-medium">Terlambat</div>
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              120
            </div>
          </div>
        </div>

        {/* Card 3: Izin */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] shrink-0">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[12.5px] text-slate-400 font-medium">Izin</div>
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              35
            </div>
          </div>
        </div>

        {/* Card 4: Sakit */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#9333ea] shrink-0">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[12.5px] text-slate-400 font-medium">Sakit</div>
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              28
            </div>
          </div>
        </div>

        {/* Card 5: Tidak Hadir (col-span-2 di tengah / rentang penuh) */}
        <div className="col-span-2 bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444] shrink-0">
            <X className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="text-[12.5px] text-slate-400 font-medium">Tidak Hadir</div>
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              67
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onOpenPresensi={() => {
          setIsNotifOpen(false);
          onNavigate?.('presensi');
        }}
      />

      {/* Rich User Profile Modal with Photo & Singkatan Nama */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNavigateToSettings={() => {
          setIsProfileModalOpen(false);
          onNavigate?.('pengaturan');
        }}
        onLogout={() => {
          setIsProfileModalOpen(false);
          onLogoutClick?.();
        }}
      />
    </div>
  );
};
