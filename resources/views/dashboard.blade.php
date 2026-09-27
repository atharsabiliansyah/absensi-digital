<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title> Dashboard - Presensi SMK PGRI 11</title>
    <meta name="description" content="Dashboard Sistem Presensi Digital Siswa Berbasis RFID dan IoT SMK PGRI 11 Ciledug">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Alpine.js for Interactivity -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="font-sans antialiased bg-[#f4f6fa] text-slate-800" 
      x-data="{ 
          sidebarOpen: false, 
          activeTab: 'dashboard', 
          showProfileMenu: false, 
          selectedStudent: null, 
          logoutModalOpen: false,
          currentTime: '',
          currentDate: '',
          initClock() {
              const update = () => {
                  const now = new Date();
                  this.currentTime = String(now.getHours()).padStart(2, '0') + ':' + 
                                     String(now.getMinutes()).padStart(2, '0') + ':' + 
                                     String(now.getSeconds()).padStart(2, '0');
                  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                  this.currentDate = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
              };
              update();
              setInterval(update, 1000);
          }
      }" 
      x-init="initClock()">

    <!-- Form Logout Tersembunyi untuk Laravel POST Request -->
    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden">
        @csrf
    </form>

    <!-- Mobile Backdrop -->
    <div x-show="sidebarOpen" 
         @click="sidebarOpen = false"
         class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity" 
         style="display: none;"></div>

    <div class="min-h-screen bg-[#f4f6fa] text-slate-800 flex">
        
        <!-- SIDEBAR -->
        <aside class="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d1d36] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out select-none shadow-2xl md:shadow-none"
               :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
            <div>
                <!-- Top Section: Logo & School Identity -->
                <div class="pt-8 pb-6 px-6 flex flex-col items-center text-center relative border-b border-white/5">
                    <button @click="sidebarOpen = false" class="md:hidden absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md" aria-label="Tutup menu">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <!-- Official PGRI Emblem SVG -->
                    <div class="mb-3 transition-transform hover:scale-105 duration-200">
                        <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="select-none">
                            <defs>
                                <linearGradient id="pgriGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#FDE047" />
                                    <stop offset="50%" stop-color="#EAB308" />
                                    <stop offset="100%" stop-color="#CA8A04" />
                                </linearGradient>
                                <linearGradient id="pgriRed" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#EF4444" />
                                    <stop offset="100%" stop-color="#B91C1C" />
                                </linearGradient>
                                <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stop-color="#DC2626" />
                                    <stop offset="40%" stop-color="#F97316" />
                                    <stop offset="85%" stop-color="#FACC15" />
                                    <stop offset="100%" stop-color="#FEF08A" />
                                </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="47" fill="#047857" stroke="url(#pgriGold)" stroke-width="3" />
                            <circle cx="50" cy="50" r="43" fill="#064E3B" />
                            <path d="M 17,66 C 14,50 18,34 30,22 C 26,30 26,45 32,56 C 24,56 19,62 17,66 Z" fill="url(#pgriGold)" />
                            <path d="M 23,38 C 21,30 28,26 31,24 C 29,32 35,36 34,42 C 28,42 24,40 23,38 Z" fill="#FEF08A" />
                            <path d="M 83,66 C 86,50 82,34 70,22 C 74,30 74,45 68,56 C 76,56 81,62 83,66 Z" fill="url(#pgriGold)" />
                            <path d="M 77,38 C 79,30 72,26 69,24 C 71,32 65,36 66,42 C 72,42 76,40 77,38 Z" fill="#FEF08A" />
                            <ellipse cx="50" cy="52" rx="28" ry="32" fill="#FFFFFF" />
                            <ellipse cx="50" cy="52" rx="26" ry="30" fill="#F8FAFC" stroke="#047857" stroke-width="1" />
                            <path d="M 50,14 C 47,20 46,26 50,34 C 54,26 53,20 50,14 Z" fill="url(#flameGrad)" />
                            <path d="M 45,19 C 41,24 41,29 46,36 C 47,30 46,24 45,19 Z" fill="url(#flameGrad)" />
                            <path d="M 39,26 C 36,30 38,36 43,40 C 42,34 41,29 39,26 Z" fill="url(#flameGrad)" />
                            <path d="M 55,19 C 59,24 59,29 54,36 C 53,30 54,24 55,19 Z" fill="url(#flameGrad)" />
                            <path d="M 61,26 C 64,30 62,36 57,40 C 58,34 59,29 61,26 Z" fill="url(#flameGrad)" />
                            <rect x="47.5" y="35" width="5" height="24" rx="1.5" fill="url(#pgriGold)" stroke="#B45309" stroke-width="0.8" />
                            <polygon points="43,36 57,36 54,41 46,41" fill="#DC2626" stroke="#991B1B" stroke-width="0.5" />
                            <ellipse cx="50" cy="36" rx="7" ry="2" fill="url(#pgriGold)" />
                            <path d="M 34,57 Q 42,54 50,56 Q 58,54 66,57 L 65,65 Q 58,62 50,64 Q 42,62 35,65 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.2" />
                            <line x1="50" y1="56" x2="50" y2="64" stroke="#1E293B" stroke-width="1.2" />
                            <path d="M 24,72 L 31,67 L 69,67 L 76,72 L 72,78 L 68,76 L 32,76 L 28,78 Z" fill="url(#pgriRed)" stroke="#7F1D1D" stroke-width="0.8" />
                            <path d="M 24,72 L 28,78 L 29,74 Z" fill="#991B1B" />
                            <path d="M 76,72 L 72,78 L 71,74 Z" fill="#991B1B" />
                            <text x="50" y="74.5" text-anchor="middle" font-size="7" font-weight="900" font-family="sans-serif" letter-spacing="1.2" fill="#FEF08A" stroke="#854D0E" stroke-width="0.3">PGRI</text>
                            <circle cx="50" cy="85" r="2.5" fill="url(#pgriGold)" />
                        </svg>
                    </div>
                    <h1 class="text-[13px] font-bold tracking-wider text-white uppercase">SMK PGRI 11 CILEDUG</h1>
                    <p class="text-[11px] text-slate-400 mt-1 font-medium">Sistem Presensi Digital</p>
                </div>

                <!-- Navigation Links -->
                <nav class="p-4 space-y-1.5 mt-2">
                    <button @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/40 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 cursor-pointer">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Dashboard</span>
                    </button>
                    <button @click="activeTab = 'presensi'" :class="activeTab === 'presensi' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/40 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 cursor-pointer">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        <span>Presensi</span>
                    </button>
                    <button @click="activeTab = 'data-siswa'" :class="activeTab === 'data-siswa' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/40 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 cursor-pointer">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>Data Siswa</span>
                    </button>
                    <button @click="activeTab = 'laporan'" :class="activeTab === 'laporan' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/40 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 cursor-pointer">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span>Laporan</span>
                    </button>
                    <button @click="activeTab = 'pengaturan'" :class="activeTab === 'pengaturan' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/40 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 cursor-pointer">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>Pengaturan</span>
                    </button>
                </nav>
            </div>

            <!-- Bottom Section: Keluar / Logout -->
            <div class="p-4 border-t border-white/5">
                <button @click="logoutModalOpen = true" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <svg class="w-5 h-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Keluar</span>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <div class="flex-1 flex flex-col min-w-0 md:pl-64 pl-0 transition-all duration-300">
            
            <!-- HEADER -->
            <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
                <div class="flex items-center">
                    <button @click="sidebarOpen = !sidebarOpen" class="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Toggle menu">
                        <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
                
                <div class="flex items-center gap-4 sm:gap-6 relative">
                    <!-- Profile Card Pill (Dinamis Auth Laravel) -->
                    <div @click="showProfileMenu = !showProfileMenu" class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2 rounded-xl transition-colors select-none">
                        <div class="w-9 h-9 rounded-full bg-[#e0edff] flex items-center justify-center text-[#2563eb] shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <div class="text-left leading-tight">
                            <div class="text-[13px] font-bold text-slate-900">{{ Auth::user()->name ?? 'Untung Sudarto' }}</div>
                            <div class="text-[11px] text-slate-400 font-medium">NIP. {{ Auth::user()->nip ?? '198705123456' }}</div>
                        </div>
                    </div>
                    
                    <div class="h-8 w-px bg-slate-200 shrink-0" aria-hidden="true"></div>
                    
                    <!-- Digital Clock -->
                    <div class="text-right leading-tight">
                        <div class="text-[14px] font-bold text-slate-900 font-mono tracking-tight flex items-baseline justify-end">
                            <span x-text="currentTime">07:35:00</span>
                            <span class="text-[10px] text-slate-400 font-sans font-semibold ml-1">WIB</span>
                        </div>
                        <div class="text-[11px] text-slate-400 font-medium" x-text="currentDate">Kamis, 26 September 2026</div>
                    </div>

                    <!-- Profile Dropdown Menu -->
                    <div x-show="showProfileMenu" @click.away="showProfileMenu = false" class="absolute right-0 top-12 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50" style="display: none;">
                        <p class="text-xs text-slate-400 font-medium">Profil Pendidik:</p>
                        <p class="text-sm font-bold text-slate-800">{{ Auth::user()->name ?? 'Untung Sudarto, S.Pd' }}</p>
                        <p class="text-xs text-slate-500 mt-0.5">Guru Piket & Koordinator Presensi</p>
                        <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">SMK PGRI 11 CILEDUG</div>
                    </div>
                </div>
            </header>

            <!-- DASHBOARD VIEW -->
            <main class="flex-1 px-5 sm:px-8 py-6 w-full">
                <div class="space-y-6">
                    <!-- Welcome Greeting -->
                    <div class="mb-6 text-left">
                        <h1 class="text-[25px] sm:text-[27px] font-bold text-[#1e293b] tracking-tight leading-tight">Selamat Datang, {{ Auth::user()->name ?? 'Bapak Untung Sudarto' }}</h1>
                        <p class="text-[13px] text-slate-400 mt-1 font-normal">Pantau presensi siswa secara real-time</p>
                    </div>

                    <!-- Main 2-Column Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        <!-- Left Column: Recent Attendance Table (8 cols) -->
                        <div class="lg:col-span-8 flex flex-col">
                            <div class="bg-white rounded-2xl p-6 shadow-xs border border-slate-100/90 flex flex-col justify-between h-full">
                                <div>
                                    <div class="flex items-center justify-between pb-2">
                                        <div>
                                            <h2 class="text-[16px] font-bold text-slate-800 leading-snug">Presensi Terbaru (Real-time)</h2>
                                            <p class="text-[12px] text-slate-400 font-normal mt-0.5">Pemindaian kartu RFID siswa terbaru</p>
                                        </div>
                                        <button class="text-[12.5px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-0.5 cursor-pointer transition-colors group">
                                            <span>Lihat Semua</span>
                                            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                        </button>
                                    </div>

                                    <div class="w-full overflow-x-auto mt-2">
                                        <table class="w-full text-left border-collapse">
                                            <thead>
                                                <tr class="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider">
                                                    <th class="py-3.5 px-3 font-semibold">WAKTU</th>
                                                    <th class="py-3.5 px-3 font-semibold">NAMA SISWA</th>
                                                    <th class="py-3.5 px-3 font-semibold">KELAS</th>
                                                    <th class="py-3.5 px-3 font-semibold">JURUSAN</th>
                                                    <th class="py-3.5 px-3 font-semibold text-right pr-4">STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-100/80">
                                                @forelse($recentAttendances ?? [] as $attendance)
                                                <tr @click="selectedStudent = {
                                                        nama: '{{ $attendance->student->name ?? 'Siswa' }}', 
                                                        kelas: '{{ $attendance->student->class_name ?? '-' }}', 
                                                        jurusan: '{{ $attendance->student->major ?? '-' }}', 
                                                        waktu: '{{ $attendance->time ?? '07:30' }}', 
                                                        status: '{{ $attendance->status ?? 'Hadir' }}', 
                                                        nisn: '{{ $attendance->student->nisn ?? '-' }}', 
                                                        rfidUid: '{{ $attendance->student->rfid_uid ?? '-' }}', 
                                                        hp: '{{ $attendance->student->guardian_phone ?? '-' }}', 
                                                        ket: '{{ $attendance->notes ?? 'Tap RFID Gerbang Utama' }}'
                                                    }" 
                                                    class="hover:bg-slate-50/70 transition-colors cursor-pointer group">
                                                    <td class="py-4 px-3 text-[13px] text-slate-500 font-mono tracking-tight whitespace-nowrap">{{ $attendance->time ?? '07:30:00' }}</td>
                                                    <td class="py-4 px-3 text-[13px] font-bold text-slate-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">{{ $attendance->student->name ?? 'Nama Siswa' }}</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">{{ $attendance->student->class_name ?? '-' }}</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">{{ $attendance->student->major ?? '-' }}</td>
                                                    <td class="py-4 px-3 text-right pr-4 whitespace-nowrap">
                                                        <span class="inline-block px-4 py-1 text-[11.5px] font-medium rounded-full 
                                                            {{ ($attendance->status ?? 'Hadir') == 'Hadir' ? 'bg-[#dcfce7] text-[#16a34a]' : (($attendance->status ?? '') == 'Terlambat' ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-[#ffe4e6] text-[#e11d48]') }}">
                                                            {{ $attendance->status ?? 'Hadir' }}
                                                        </span>
                                                    </td>
                                                </tr>
                                                @empty
                                                <!-- Fallback Mockup Data jika database kosong -->
                                                <tr @click="selectedStudent = {nama: 'Isa', kelas: 'XI TKJ', jurusan: 'TKJ', waktu: '07:34:12', status: 'Hadir', nisn: '0075849301', rfidUid: 'E2:00:41:2B', hp: '0812-8899-2311', ket: 'Tap RFID Gerbang Utama - Masuk Tepat Waktu'}" class="hover:bg-slate-50/70 transition-colors cursor-pointer group">
                                                    <td class="py-4 px-3 text-[13px] text-slate-500 font-mono tracking-tight whitespace-nowrap">07:34:12</td>
                                                    <td class="py-4 px-3 text-[13px] font-bold text-slate-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">Isa</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">XI TKJ</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">TKJ</td>
                                                    <td class="py-4 px-3 text-right pr-4 whitespace-nowrap"><span class="inline-block px-4 py-1 text-[11.5px] font-medium rounded-full bg-[#dcfce7] text-[#16a34a]">Hadir</span></td>
                                                </tr>
                                                <tr @click="selectedStudent = {nama: 'Bador', kelas: 'X AKL', jurusan: 'AKL', waktu: '07:32:45', status: 'Terlambat', nisn: '0081294821', rfidUid: '4A:7C:19:F3', hp: '0857-1234-9988', ket: 'Terlambat 17 menit'}" class="hover:bg-slate-50/70 transition-colors cursor-pointer group">
                                                    <td class="py-4 px-3 text-[13px] text-slate-500 font-mono tracking-tight whitespace-nowrap">07:32:45</td>
                                                    <td class="py-4 px-3 text-[13px] font-bold text-slate-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">Bador</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">X AKL</td>
                                                    <td class="py-4 px-3 text-[13px] text-slate-600 font-medium whitespace-nowrap">AKL</td>
                                                    <td class="py-4 px-3 text-right pr-4 whitespace-nowrap"><span class="inline-block px-3.5 py-1 text-[11.5px] font-medium rounded-full bg-[#fef3c7] text-[#d97706]">Terlambat</span></td>
                                                </tr>
                                                @endforelse
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="border-t border-slate-100/90 mt-5 pt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="relative flex h-2 w-2">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span class="font-medium text-slate-400">Sinkronisasi RFID Aktif</span>
                                    </div>
                                    <div class="text-slate-400 font-normal">Update otomatis setiap 5 detik</div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: 4 Stat Cards (4 cols) -->
                        <div class="lg:col-span-4 flex flex-col gap-4">
                            <!-- Hadir -->
                            <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-100/90 flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#dcfce7] text-[#16a34a]">
                                    <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <div>
                                    <span class="text-[13px] text-slate-400 font-medium leading-none">Hadir</span>
                                    <div class="flex items-baseline mt-2">
                                        <span class="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{{ $totalHadir ?? 128 }}</span>
                                        <span class="text-[13px] font-bold ml-2 leading-none text-[#16a34a]">72%</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Terlambat -->
                            <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-100/90 flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#fef3c7] text-[#d97706]">
                                    <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <span class="text-[13px] text-slate-400 font-medium leading-none">Terlambat</span>
                                    <div class="flex items-baseline mt-2">
                                        <span class="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{{ $totalTerlambat ?? 12 }}</span>
                                        <span class="text-[13px] font-bold ml-2 leading-none text-[#d97706]">7%</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Tidak Hadir -->
                            <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-100/90 flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#ffe4e6] text-[#e11d48]">
                                    <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <div>
                                    <span class="text-[13px] text-slate-400 font-medium leading-none">Tidak Hadir</span>
                                    <div class="flex items-baseline mt-2">
                                        <span class="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{{ $totalTidakHadir ?? 8 }}</span>
                                        <span class="text-[13px] font-bold ml-2 leading-none text-[#e11d48]">4%</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Total Siswa -->
                            <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-100/90 flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[#dbeafe] text-[#2563eb]">
                                    <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                </div>
                                <div>
                                    <span class="text-[13px] text-slate-400 font-medium leading-none">Total Siswa</span>
                                    <div class="flex items-baseline mt-2">
                                        <span class="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{{ $totalSiswa ?? 148 }}</span>
                                        <span class="text-[13px] font-bold ml-2 leading-none text-[#2563eb]">100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <!-- FOOTER -->
            <footer class="mt-auto py-5 px-6 border-t border-slate-200/60 text-center">
                <p class="text-[11.5px] text-slate-400 font-normal">&copy; 2026 SMK PGRI 11 CILEDUG &bull; Sistem Presensi Digital Berbasis RFID dan IoT</p>
            </footer>
        </div>
    </div>

    <!-- STUDENT DETAIL MODAL -->
    <div x-show="selectedStudent" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" style="display: none;">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button @click="selectedStudent = null" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold" x-text="selectedStudent ? selectedStudent.nama.charAt(0) : ''"></div>
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="text-lg font-bold text-slate-900" x-text="selectedStudent?.nama"></h3>
                        <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                              :class="{
                                  'bg-emerald-100 text-emerald-700': selectedStudent?.status === 'Hadir',
                                  'bg-amber-100 text-amber-700': selectedStudent?.status === 'Terlambat',
                                  'bg-rose-100 text-rose-700': selectedStudent?.status === 'Tidak Hadir'
                              }"
                              x-text="selectedStudent?.status"></span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Kelas <span x-text="selectedStudent?.kelas"></span> &bull; Jurusan <span x-text="selectedStudent?.jurusan"></span></p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 my-4">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-400">Waktu Tap RFID</span>
                    <p class="text-sm font-bold text-slate-800 font-mono mt-0.5" x-text="selectedStudent?.waktu + ' WIB'"></p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-400">UID Kartu RFID</span>
                    <p class="text-xs font-bold text-slate-800 font-mono mt-0.5" x-text="selectedStudent?.rfidUid"></p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-400">NISN</span>
                    <p class="text-xs font-bold text-slate-800 font-mono mt-0.5" x-text="selectedStudent?.nisn"></p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="text-[11px] text-slate-400">No. HP Wali Murid</span>
                    <p class="text-xs font-bold text-slate-800 font-mono mt-0.5" x-text="selectedStudent?.hp"></p>
                </div>
            </div>

            <template x-if="selectedStudent?.ket">
                <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 mb-4">
                    <span class="font-semibold text-slate-700">Catatan Sistem:</span> <span x-text="selectedStudent.ket"></span>
                </div>
            </template>

            <div class="flex gap-2">
                <button @click="selectedStudent = null" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">Tutup</button>
                <a :href="'https://wa.me/?text=' + encodeURIComponent('Pemberitahuan Presensi SMK PGRI 11 CILEDUG: Ananda ' + selectedStudent?.nama + ' (' + selectedStudent?.kelas + ') tercatat ' + selectedStudent?.status + ' pukul ' + selectedStudent?.waktu + ' WIB.')" target="_blank" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors text-center">Kirim Notif WA Wali</a>
            </div>
        </div>
    </div>

    <!-- LOGOUT MODAL -->
    <div x-show="logoutModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" style="display: none;">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <h3 class="text-base font-bold text-slate-900">Konfirmasi Keluar</h3>
            <p class="text-xs text-slate-500 mt-1">Apakah Anda yakin ingin keluar dari Sistem Presensi Digital SMK PGRI 11 Ciledug?</p>
            <div class="flex gap-2 mt-5">
                <button @click="logoutModalOpen = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer">Batal</button>
                <button @click="logoutModalOpen = false; document.getElementById('logout-form').submit();" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer">Keluar</button>
            </div>
        </div>
    </div>

</body>
</html>