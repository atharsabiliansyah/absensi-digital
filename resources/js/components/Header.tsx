import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { PgriLogo } from "./PgriLogo";
import { NavTab } from "./Sidebar";
import { NotificationModal } from "./NotificationModal";
import { UserProfileModal } from "./UserProfileModal";
import { useProfilePhoto } from "../utils/profilePhotoState";

interface UserAuth {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    nip?: string;
}

interface HeaderProps {
    user?: UserAuth; 
    onToggleSidebar?: () => void;
    onNavigate?: (tab: NavTab) => void;
    onLogoutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    user: propUser, 
    onNavigate,
    onLogoutClick,
}) => {
    const pageProps = usePage().props as any;
    const activeUser: UserAuth | undefined = 
        propUser || pageProps.auth?.user || pageProps.user;

    const displayUsername = activeUser?.username
        ? (activeUser.username.startsWith('@') ? activeUser.username : `@${activeUser.username}`)
        : activeUser?.nip ? `NIP. ${activeUser.nip}` : '-';

    const { photo } = useProfilePhoto();
    
    const getFormattedTime = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    };

    const getFormattedDate = () => {
        const now = new Date();
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
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
            {/* Tampilan Mobile */}
            <div className="flex md:hidden items-center justify-between w-full">
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

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsNotifOpen(true)}
                        className="w-9 h-9 shrink-0 rounded-full bg-[#f0f4f9] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <Bell className="w-4 h-4 text-slate-600" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsProfileModalOpen(true)}
                        className="relative w-9 h-9 shrink-0 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all cursor-pointer p-0.5 bg-white shadow-2xs overflow-hidden"
                    >
                        <img src={photo} alt="Foto Profil" className="w-full h-full object-cover rounded-full block" />
                    </button>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4 relative ml-auto">
                <button
                    type="button"
                    onClick={() => setIsNotifOpen(true)}
                    className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <Bell className="w-4 h-4 text-slate-600" />
                </button>

                <div
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2.5 rounded-2xl transition-colors select-none border border-transparent hover:border-slate-200"
                >
                    <div className="relative w-10 h-10 rounded-full shrink-0 ring-2 ring-blue-500/20 bg-white p-0.5 shadow-2xs overflow-hidden">
                        <img src={photo} alt="Foto Profil" className="w-full h-full object-cover rounded-full block" />
                    </div>

                    <div className="text-left leading-tight">
                        <div className="text-[13.5px] font-bold text-slate-900 font-sans tracking-tight whitespace-nowrap">
                            {activeUser?.name || "Pengguna"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap font-mono">
                            {displayUsername}
                        </div>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200/90 shrink-0" aria-hidden="true" />

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

            <NotificationModal
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                onOpenPresensi={() => {
                    setIsNotifOpen(false);
                    onNavigate?.("presensi");
                }}
            />

            <UserProfileModal
                user={activeUser}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onNavigateToSettings={() => {
                    setIsProfileModalOpen(false);
                    onNavigate?.("pengaturan");
                }}
                onLogout={() => {
                    setIsProfileModalOpen(false);
                    onLogoutClick?.();
                }}
            />
        </header>
    );
};