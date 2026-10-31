import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { CurvedMobileBottomNav } from "../components/CurvedMobileBottomNav";
import { PgriLogo } from "../components/PgriLogo";
import { NotificationModal } from "../components/NotificationModal";
import { UserProfileModal } from "../components/UserProfileModal";
import { useProfilePhoto } from "../utils/profilePhotoState";
import { Bell } from "lucide-react";

declare function route(name?: string, params?: any): any;

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const { url, props } = usePage<any>();
    const currentPath = url.split("?")[0];
    
    // Ambil data user aktif dari Inertia
    const user = props.auth?.user;
    
    const { photo: teacherPhoto } = useProfilePhoto();

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const getActiveTab = () => {
        if (currentPath.includes("/laporan")) return "laporan";
        if (currentPath.includes("/presensi")) return "presensi";
        if (
            currentPath.includes("/siswa") ||
            currentPath.includes("/data-siswa")
        )
            return "data-siswa";
        if (
            currentPath.includes("/pengaturan") ||
            currentPath.includes("/profile")
        )
            return "pengaturan";
        return "dashboard";
    };

    const handleSetActiveTab = (tab: string) => {
        const routeMap: Record<string, string[]> = {
            dashboard: ["dashboard"],
            presensi: ["presensi.index", "presensi"],
            "data-siswa": [
                "data-siswa.index",
                "siswa.index",
                "data-siswa",
                "siswa",
            ],
            laporan: ["laporan.index", "laporan"],
            pengaturan: ["pengaturan.index", "pengaturan", "profile.edit"],
        };

        if (typeof route === "function") {
            const possibleRoutes = routeMap[tab] || [tab];
            for (const rName of possibleRoutes) {
                try {
                    if (route().has(rName)) {
                        router.get(route(rName));
                        return;
                    }
                } catch (e) {}
            }
        }

        const fallbackUrls: Record<string, string> = {
            dashboard: "/dashboard",
            presensi: "/presensi",
            "data-siswa": "/data-siswa",
            laporan: "/laporan",
            pengaturan: "/pengaturan",
        };

        router.get(fallbackUrls[tab] || `/${tab}`);
    };

    const handleLogout = () => {
        if (typeof route === "function") {
            try {
                if (route().has("logout")) {
                    router.post(route("logout"));
                    return;
                }
            } catch (e) {}
        }
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans relative">
            <div className="hidden md:block">
                <Sidebar
                    activeTab={getActiveTab()}
                    setActiveTab={handleSetActiveTab}
                    isOpen={true}
                    onCloseMobile={() => {}}
                    onLogoutClick={handleLogout}
                />
            </div>

            <div className="ml-0 md:ml-72 flex flex-col min-h-screen min-w-0 transition-all pb-24 md:pb-0">
                <div className="hidden md:block">

                    <Header user={user} onLogoutClick={handleLogout} />
                </div>

                <div className="block md:hidden px-4 pt-4 pb-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0 p-0.5 border border-slate-200 overflow-hidden">
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

                        <div className="flex items-center gap-2.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsNotifOpen(true)}
                                style={{ width: "36px", height: "36px" }}
                                className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative transition-colors cursor-pointer shadow-2xs"
                                aria-label="Buka Notifikasi Sistem"
                            >
                                <Bell className="w-4 h-4 text-slate-600" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(true)}
                                style={{ width: "36px", height: "36px" }}
                                className="relative w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] shrink-0 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all cursor-pointer p-0.5 bg-white shadow-2xs overflow-hidden"
                                aria-label="Buka Profil Guru"
                            >
                                <img
                                    src={teacherPhoto}
                                    alt="Foto Profil Guru"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    className="w-full h-full object-cover rounded-full block"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <main className="flex-1 p-3 md:p-6 min-w-0">{children}</main>
            </div>

            <div className="block md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
                <CurvedMobileBottomNav
                    activeTab={getActiveTab()}
                    onSelectTab={handleSetActiveTab}
                />
            </div>

            <NotificationModal
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                onOpenPresensi={() => {
                    setIsNotifOpen(false);
                    handleSetActiveTab("presensi");
                }}
            />

           <UserProfileModal
            user={user}
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onNavigateToSettings={() => {
                setIsProfileModalOpen(false);
                handleSetActiveTab("pengaturan");
            }}
            onLogout={() => {
                setIsProfileModalOpen(false);
                handleLogout();
            }}
        />
        </div>
    );
}