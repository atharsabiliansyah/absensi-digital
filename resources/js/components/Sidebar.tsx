import React from 'react';
import { House, ClipboardCheck, Users, FileChartColumn, Settings, LogOut } from 'lucide-react';
import { PgriLogo } from './PgriLogo';

export type NavTab = 'dashboard' | 'presensi' | 'data-siswa' | 'laporan' | 'pengaturan';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onLogoutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  onLogoutClick,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'presensi', label: 'Presensi', icon: ClipboardCheck },
    { id: 'data-siswa', label: 'Data Siswa', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: FileChartColumn },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    /* Main Sidebar - Desktop only (Width 72 / 288px) */
    <aside
      className="hidden md:flex fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0b192c] text-white flex-col justify-between select-none shadow-none"
    >
      {/* Top Section: Logo & School Identity */}
      <div>
        <div className="pt-9 pb-7 px-6 flex flex-col items-center text-center relative border-b border-white/5">
          {/* School Emblem inside white circle badge directly from /images/logo.pgri.png */}
          <div className="w-[82px] h-[82px] rounded-full bg-white flex items-center justify-center shadow-lg mb-3.5 overflow-hidden p-1.5">
            <PgriLogo size={62} />
          </div>

          {/* School Name & Tagline */}
          <h1 className="text-[14px] font-bold tracking-wider text-white uppercase font-sans">
            SMK PGRI 11 CILEDUG
          </h1>
          <p className="text-[12px] text-slate-400 mt-1 font-medium">
            Sistem Presensi Digital
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-700/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Keluar / Logout */}
      <div className="p-5 border-t border-white/5">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
