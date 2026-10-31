import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Bell,
  Calendar,
  GraduationCap,
  ChevronDown,
  User,
  Clock,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { PgriLogo } from './PgriLogo';
import { NavTab } from './Sidebar';
import { NotificationModal } from './NotificationModal';
import { UserProfileModal } from './UserProfileModal';
import { useProfilePhoto } from '../utils/profilePhotoState';

interface AttendanceItem {
  id?: string;
  nama: string;
  kelas?: string;
  jurusan?: string;
  waktu: string;
  status: 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Tidak Hadir' | string;
}

interface StatsData {
  hadir: number;
  terlambat: number;
  izin?: number;
  sakit?: number;
  tidakHadir: number;
}

interface UserAuth {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  nip?: string;
  role?: string;
}

interface MobileDashboardViewProps {
  user?: UserAuth;
  onViewAllClick?: () => void;
  onSelectRecord?: (record: any) => void;
  onNavigate?: (tab: NavTab) => void;
  onLogoutClick?: () => void;
  currentTime?: string;
  currentDate?: string;
  recentAttendance?: AttendanceItem[];
  stats?: StatsData;
  userName?: string;
}

export const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({
  user: propUser,
  onSelectRecord,
  onNavigate,
  onLogoutClick,
  currentTime = '08:10:51',
  currentDate = 'Selasa, 20 Okt 2026',
  recentAttendance = [], 
  stats = { hadir: 0, terlambat: 0, izin: 0, sakit: 0, tidakHadir: 0 },
  userName: propUserName,
}) => {
  // Ambil data user aktif secara dinamis dari props atau Inertia global pageProps
  const pageProps = usePage().props as any;
  const activeUser: UserAuth | undefined = propUser || pageProps.auth?.user || pageProps.user;

  // Nama & NIP Dinamis
  const displayName = activeUser?.name || propUserName || 'Pengguna';
  const displayNip = activeUser?.nip ? `NIP. ${activeUser.nip}` : '-';

  const { photo: teacherPhoto } = useProfilePhoto();
  const [showAllStudents, setShowAllStudents] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const displayAttendance = showAllStudents
    ? recentAttendance
    : recentAttendance.slice(0, 5);

  return (
    <div className="w-full max-w-full pb-20 space-y-4 px-3 sm:px-4 animate-in fade-in duration-200 box-border">
      <div className="bg-gradient-to-br from-[#0c3260] via-[#104a8e] to-[#1e60d5] text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
        <div className="flex items-center justify-between text-xs relative z-10">
          <div className="bg-black/25 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10.5px] font-mono font-medium flex items-center gap-1.5 border border-white/10">
            <span>{currentTime} WIB</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-medium">
            <Calendar className="w-3.5 h-3.5 text-white/80" />
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="mt-3 relative z-10">
          <h2 className="text-[16px] font-bold text-white tracking-tight leading-snug">
            Selamat Datang, {displayName}
          </h2>
          <p className="text-[11.5px] text-white/80 font-medium mt-0.5">
            {displayNip}
          </p>
        </div>

        <div className="mt-3 relative z-10">
      </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 w-full">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-[12px] font-bold text-slate-800 tracking-wider uppercase font-sans">
            PRESENSI TERBARU
          </h3>

          {recentAttendance.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllStudents(!showAllStudents)}
              className="text-[11.5px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{showAllStudents ? 'Ringkas' : 'Lihat Semua'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAllStudents ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 pt-1">
          {displayAttendance.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-[12.5px] font-medium">
              Belum ada presensi hari ini
            </div>
          ) : (
            displayAttendance.map((item, idx) => {
              const isHadir = item.status === 'Hadir';

              return (
                <div
                  key={idx}
                  onClick={() => onSelectRecord?.(item)}
                  className="py-2.5 px-1 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[11px] border border-blue-100 shrink-0">
                      {item.nama.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold text-slate-900 leading-tight truncate">
                        {item.nama}
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-medium truncate">
                        {item.kelas} {item.jurusan}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                        isHadir
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {item.waktu}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Hadir</div>
            <div className="text-[18px] font-bold text-slate-900 leading-tight">
              {stats.hadir}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Terlambat</div>
            <div className="text-[18px] font-bold text-slate-900 leading-tight">
              {stats.terlambat}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Izin</div>
            <div className="text-[18px] font-bold text-slate-900 leading-tight">
              {stats.izin || 0}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <User className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Sakit</div>
            <div className="text-[18px] font-bold text-slate-900 leading-tight">
              {stats.sakit || 0}
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <X className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Tidak Hadir</div>
            <div className="text-[18px] font-bold text-slate-900 leading-tight">
              {stats.tidakHadir}
            </div>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onOpenPresensi={() => {
          setIsNotifOpen(false);
          onNavigate?.('presensi');
        }}
      />

      <UserProfileModal
        user={activeUser}
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