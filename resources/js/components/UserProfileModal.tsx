import { router, usePage } from '@inertiajs/react';
import React from 'react';
import { LogOut, X, ChevronRight } from 'lucide-react';
import { useProfilePhoto } from '../utils/profilePhotoState';

interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
}

interface UserProfileModalProps {
  user?: User; // <--- TAMBAHKAN INI
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user: propUser, // <--- TERIMA PROP USER
  isOpen,
  onClose,
  onNavigateToSettings,
  onLogout,
}) => {
  const pageProps = usePage().props as any;
  const user = propUser || pageProps.auth?.user || pageProps.user;

  const { photo } = useProfilePhoto();

  if (!isOpen) return null;

  const teacherData = {
    fullName: user?.name || 'Pengguna',
    username: user?.username ? `${user.username}` : '-',
    school: 'SMK PGRI 11 CILEDUG',
    email: user?.email || '-',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="h-24 relative px-5 pt-4 flex justify-end items-start bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('/images/sekola_pgri.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-0 pb-6 relative -mt-12 space-y-4">
          <div className="flex items-end justify-between">
            <div
              style={{ width: '84px', height: '84px' }}
              className="w-[84px] h-[84px] min-w-[84px] min-h-[84px] max-w-[84px] max-h-[84px] rounded-full ring-4 ring-white shadow-md bg-white overflow-hidden shrink-0 select-none"
            >
              <img
                src={photo}
                alt={teacherData.fullName}
                width={84}
                height={84}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {teacherData.fullName}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {teacherData.username}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {teacherData.school}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2.5 border border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Email Institusi</span>
              <span className="font-mono text-slate-700 text-[11.5px]">
                {teacherData.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Status Akun</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                Terverifikasi
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else {
                  router.post('/logout');
                }
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};