import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function AuthenticatedLayout({ children }) {
    const { url } = usePage();

    // 1. Ambil path murni tanpa query parameter (contoh: "/laporan?bulan=10" -> "/laporan")
    const currentPath = url.split('?')[0];

    // 2. Deteksi Tab Mana yang Sedang Aktif
    const getActiveTab = () => {
        if (currentPath.includes('/laporan')) return 'laporan';
        if (currentPath.includes('/presensi')) return 'presensi';
        if (currentPath.includes('/siswa') || currentPath.includes('/data-siswa')) return 'data-siswa';
        if (currentPath.includes('/pengaturan') || currentPath.includes('/profile')) return 'pengaturan';
        return 'dashboard';
    };

    // 3. Navigasi Rute Menggunakan Route Named / Fallback URL
    const handleSetActiveTab = (tab) => {
        const routeMap = {
            'dashboard': ['dashboard'],
            'presensi': ['presensi.index', 'presensi'],
            'data-siswa': ['data-siswa.index', 'siswa.index', 'data-siswa', 'siswa'],
            'laporan': ['laporan.index', 'laporan'],
            'pengaturan': ['pengaturan.index', 'pengaturan', 'profile.edit'],
        };

        // Jika Ziggy route() tersedia di Laravel
        if (typeof route === 'function') {
            const possibleRoutes = routeMap[tab] || [tab];
            for (const rName of possibleRoutes) {
                try {
                    if (route().has(rName)) {
                        router.get(route(rName));
                        return;
                    }
                } catch (e) {
                    // Coba rute alternatif berikutnya
                }
            }
        }

        // Fallback langsung ke URL manual
        const fallbackUrls = {
            'dashboard': '/dashboard',
            'presensi': '/presensi',
            'data-siswa': '/data-siswa',
            'laporan': '/laporan',
            'pengaturan': '/pengaturan',
        };
        
        router.get(fallbackUrls[tab] || `/${tab}`);
    };

    // 4. Fungsi Logout
    const handleLogout = () => {
        if (typeof route === 'function') {
            try {
                if (route().has('logout')) {
                    router.post(route('logout'));
                    return;
                }
            } catch (e) {}
        }
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Sidebar Kiri Fixed (w-72) */}
            <Sidebar
                activeTab={getActiveTab()}
                setActiveTab={handleSetActiveTab}
                isOpen={true}
                onCloseMobile={() => {}}
                onLogoutClick={handleLogout}
            />

            {/* Area Konten Utama (ml-72 pas sesuai lebar w-72 Sidebar) */}
            <div className="ml-72 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}