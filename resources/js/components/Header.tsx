import React, { useState, useEffect } from 'react';
import { User, Bell, ChevronRight, Settings, LogOut } from 'lucide-react';
import { PgriLogo } from './PgriLogo';
import { NavTab } from './Sidebar';
import { NotificationModal } from './NotificationModal';
import { UserProfileModal } from './UserProfileModal';
import { useProfilePhoto } from '../utils/profilePhotoState';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onNavigate?: (tab: NavTab) => void;
  onLogoutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onLogoutClick }) => {
  const { photo: teacherPhoto } = useProfilePhoto();
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
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime);
  const [currentDate, setCurrentDate] = useState<string>(getFormattedDate);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentDate(getFormattedDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-3.5 sm:px-8 lg:px-10 py-2.5 sm:py-3.5 flex items-center justify-between">
      {/* 1. MOBILE HEADER: PGRI Logo, Title, Notification Bell & Avatar Photo with BG Initial */}
      <div className="flex md:hidden items-center justify-between w-full">
        {/* Left: School Logo & Info */}
        <div className="flex items-center gap-2.5">
          <PgriLogo size={32} className="shrink-0" />
          <div className="text-left leading-tight">
            <h1 className="text-[12.5px] font-bold text-[#1e293b] font-sans tracking-tight">
              SMK PGRI 11 CILEDUG
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Sistem Presensi RFID &amp; IoT
            </p>
          </div>
        </div>

        {/* Right: Notification Bell + Photo Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            style={{ width: '36px', height: '36px' }}
            className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full bg-[#f0f4f9] hover:bg-slate-200 text-slate-600 flex items-center justify-center relative transition-colors cursor-pointer select-none"
            aria-label="Buka Notifikasi Sistem"
          >
            <Bell className="w-4 h-4 text-slate-600" />
          </button>

          {/* User Profile Avatar with Teacher Photo */}
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

      {/* 3. DESKTOP RIGHT: Notification Bell, Full User Profile & Digital Clock */}
      <div className="hidden md:flex items-center gap-4 relative ml-auto">
        {/* Desktop Notification Bell Button */}
        <button
          type="button"
          onClick={() => setIsNotifOpen(true)}
          style={{ width: '36px', height: '36px' }}
          className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center relative transition-colors cursor-pointer select-none"
          aria-label="Buka Notifikasi Sistem"
          title="Pemberitahuan Sistem"
        >
          <Bell className="w-4 h-4 text-slate-600" />
        </button>

        {/* Profile Card Pill with Photo */}
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2.5 rounded-2xl transition-colors select-none border border-transparent hover:border-slate-200"
          title="Klik untuk membuka detail profil"
        >
          <div
            style={{ width: '40px', height: '40px' }}
            className="relative w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full shrink-0 ring-2 ring-blue-500/20 bg-white p-0.5 shadow-2xs overflow-hidden"
          >
            <img
              src={teacherPhoto}
              alt="Foto Profil Bapak/Ibu Guru"
              width={38}
              height={38}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="w-full h-full object-cover rounded-full block"
            />
          </div>

          <div className="text-left leading-tight">
            <div className="text-[13.5px] font-bold text-slate-900 font-sans tracking-tight whitespace-nowrap">
              Untung Sudarto
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap font-mono">
              NIP. 198705123456
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-slate-200/90 shrink-0" aria-hidden="true" />

        {/* Digital Clock display */}
        <div className="text-right leading-tight select-none">
          <div className="text-[16px] font-bold text-slate-900 font-mono tracking-tight flex items-baseline justify-end whitespace-nowrap">
            <span>{currentTime}</span>
            <span className="text-[11px] text-slate-400 font-sans font-semibold ml-1">WIB</span>
          </div>
          <div className="text-[12px] text-slate-400 font-medium font-sans mt-0.5 whitespace-nowrap">
            {currentDate}
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

      {/* Rich User Profile Modal */}
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
    </header>
  );
};
