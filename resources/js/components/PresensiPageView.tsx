import React, { useState } from 'react';
import {
  Filter,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  XCircle,
  Activity,
  X,
  ChevronRight,
} from 'lucide-react';

export interface PresensiItem {
  no: number;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  waktu: string;
  status: 'Hadir' | 'Terlambat' | 'Izin' | 'Tidak Hadir' | 'Sakit';
}

const INITIAL_PRESENSI_DATA: PresensiItem[] = [
  { no: 1, nis: '001234', nama: 'Isa', kelas: 'XI TKJ', jurusan: 'TKJ', waktu: '06:58:21 WIB', status: 'Hadir' },
  { no: 2, nis: '001235', nama: 'Bador', kelas: 'X AKL', jurusan: 'AKL', waktu: '07:12:08 WIB', status: 'Terlambat' },
  { no: 3, nis: '001236', nama: 'Citra', kelas: 'XI OTPK', jurusan: 'OTPK', waktu: '07:18:33 WIB', status: 'Hadir' },
  { no: 4, nis: '001237', nama: 'Dimas', kelas: 'X BDP', jurusan: 'BDP', waktu: '07:21:17 WIB', status: 'Izin' },
  { no: 5, nis: '001238', nama: 'Andi', kelas: 'XI TKJ', jurusan: 'TKJ', waktu: '07:05:17 WIB', status: 'Hadir' },
  { no: 6, nis: '001240', nama: 'Raka', kelas: 'X OTPK', jurusan: 'OTPK', waktu: '07:15:00 WIB', status: 'Sakit' },
  { no: 7, nis: '001239', nama: 'Siti', kelas: 'XI AKL', jurusan: 'AKL', waktu: '07:02:41 WIB', status: 'Hadir' },
  { no: 8, nis: '001241', nama: 'Nisa', kelas: 'XI BDP', jurusan: 'BDP', waktu: '07:10:22 WIB', status: 'Terlambat' },
];

export const PresensiPageView: React.FC = () => {
  const [data, setData] = useState<PresensiItem[]>(INITIAL_PRESENSI_DATA);
  const [tanggal, setTanggal] = useState<string>('25/09/2026');
  const [jurusan, setJurusan] = useState<string>('Semua Jurusan');
  const [kelas, setKelas] = useState<string>('Semua Kelas');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Notification Toast State (Matches Screen 2 in user's image)
  const [notification, setNotification] = useState<{
    visible: boolean;
    studentName: string;
  } | null>(null);

  const handleStatusChange = (no: number, newStatus: PresensiItem['status']) => {
    let studentName = '';
    setData((prev) =>
      prev.map((item) => {
        if (item.no === no) {
          studentName = item.nama;
          const waktu =
            newStatus === 'Tidak Hadir'
              ? 'Menunggu Konfirmasi'
              : newStatus === 'Izin' || newStatus === 'Sakit'
              ? '07:15:00 WIB'
              : item.waktu === 'Menunggu Konfirmasi' || item.waktu === '-'
              ? '07:08:15 WIB'
              : item.waktu;
          return { ...item, status: newStatus, waktu };
        }
        return item;
      })
    );

    // Trigger Notification Toast
    setNotification({
      visible: true,
      studentName: studentName || 'Siswa',
    });

    setTimeout(() => {
      setNotification((curr) => (curr ? { ...curr, visible: false } : null));
    }, 4000);
  };

  // Avatar initial color theme mapping
  const getAvatarTheme = (name: string) => {
    const initial = (name[0] || '').toUpperCase();
    switch (initial) {
      case 'I':
        return { bg: 'bg-[#e0e7ff]', text: 'text-[#4338ca]' };
      case 'B':
        return { bg: 'bg-[#ffedd5]', text: 'text-[#c2410c]' };
      case 'C':
        return { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' };
      case 'D':
        return { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]' };
      case 'A':
        return { bg: 'bg-[#e0e7ff]', text: 'text-[#3730a3]' };
      case 'R':
        return { bg: 'bg-[#ffe4e6]', text: 'text-[#be123c]' };
      case 'S':
        return { bg: 'bg-[#ccfbf1]', text: 'text-[#0f766e]' };
      case 'N':
        return { bg: 'bg-[#fef3c7]', text: 'text-[#b45309]' };
      default:
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
    }
  };

  // Status badge styling matching user's Image 2 exactly (pill with label + downward triangle)
  const getStatusBadgeStyle = (status: PresensiItem['status']) => {
    switch (status) {
      case 'Tidak Hadir':
        return 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3] hover:bg-[#ffe4e6]';
      case 'Izin':
        return 'bg-[#f0f9ff] text-[#0284c7] border-[#38bdf8] hover:bg-[#e0f2fe]';
      case 'Sakit':
        return 'bg-[#faf5ff] text-[#9333ea] border-[#c084fc] hover:bg-[#f3e8ff]';
      case 'Hadir':
        return 'bg-[#f0fdf4] text-[#16a34a] border-[#86efac] hover:bg-[#dcfce7]';
      case 'Terlambat':
        return 'bg-[#fffbeb] text-[#d97706] border-[#fcd34d] hover:bg-[#fef3c7]';
    }
  };

  const renderStatusBadge = (item: PresensiItem) => {
    const isOpen = openDropdownId === item.no;
    const badgeStyle = getStatusBadgeStyle(item.status);

    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownId(isOpen ? null : item.no);
          }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11.5px] font-semibold transition-all cursor-pointer select-none shadow-2xs ${badgeStyle}`}
          title="Klik untuk memilih opsi status"
        >
          <span>{item.status}</span>
          <span className="text-[8px] leading-none opacity-85">▼</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(null);
              }}
            />
            <div
              className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {(['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Tidak Hadir'] as const).map((option) => {
                const isCurrent = item.status === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(item.no, option);
                      setOpenDropdownId(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const filteredData = data.filter((item) => {
    const matchJurusan = jurusan === 'Semua Jurusan' || item.jurusan === jurusan;
    const matchKelas = kelas === 'Semua Kelas' || item.kelas === kelas;
    return matchJurusan && matchKelas;
  });

  return (
    <div className="space-y-4 sm:space-y-6 relative pb-28 md:pb-10 max-w-full">
      {/* 1. TOAST NOTIFICATION (Screen 2 matching screenshot exactly) */}
      {notification && notification.visible && (
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-center animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100/90 flex items-center gap-3.5 pl-4 pr-5 py-3 w-full max-w-md relative overflow-hidden">
            {/* Left green accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981]" />

            {/* Green Circular Badge */}
            <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Notification Text */}
            <div className="flex-1 text-[13px] font-medium text-slate-800 leading-snug">
              Status Presensi {notification.studentName} Berhasil Diubah
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW (Persis Seperti Screenshot Pengguna)       */}
      {/* ========================================================= */}
      <div className="block md:hidden space-y-4">
        {/* Card: Parameter Presensi */}
        <div className="bg-white rounded-[22px] shadow-xs border border-slate-100 p-4 space-y-3.5">
          {/* Card Header: Parameter Presensi & Real-time Sinkronisasi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#1d4ed8]" />
              <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">
                Parameter Presensi
              </h2>
            </div>
          </div>

          {/* Input: Tanggal Presensi */}
          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1.5">
              Tanggal Presensi
            </label>
            <div className="relative">
              <div className="w-full bg-[#f1f5f9] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
                <input
                  type="text"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="bg-transparent border-none text-[13px] font-semibold text-slate-800 focus:outline-hidden w-full"
                />
              </div>
            </div>
          </div>

          {/* Dropdown: Jurusan & Kelas */}
          <div className="grid grid-cols-2 gap-3">
            {/* Jurusan */}
            <div>
              <label className="block text-[11.5px] font-medium text-slate-600 mb-1.5">
                Jurusan
              </label>
              <div className="relative">
                <select
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="w-full appearance-none bg-[#f1f5f9] border-none rounded-xl px-3.5 py-2.5 pr-8 text-[12px] font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="Semua Jurusan">Semua Jurusan</option>
                  <option value="TKJ">TKJ</option>
                  <option value="AKL">AKL</option>
                  <option value="OTPK">OTPK</option>
                  <option value="BDP">BDP</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-[11.5px] font-medium text-slate-600 mb-1.5">
                Kelas
              </label>
              <div className="relative">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full appearance-none bg-[#f1f5f9] border-none rounded-xl px-3.5 py-2.5 pr-8 text-[12px] font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="Semua Kelas">Semua Kelas</option>
                  <option value="XII TKJ 2">XII TKJ 2</option>
                  <option value="XI TKJ">XI TKJ</option>
                  <option value="X AKL">X AKL</option>
                  <option value="XI OTPK">XI OTPK</option>
                  <option value="X BDP">X BDP</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tombol Tampilkan */}
          <button
            type="button"
            className="w-full mt-1 py-2.5 bg-[#0b2b68] hover:bg-[#081e4c] active:scale-[0.99] text-white text-[12.5px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tampilkan</span>
          </button>
        </div>

        {/* Student Attendance List Cards */}
        <div className="space-y-2.5">
          {filteredData.map((item) => {
            const avatar = getAvatarTheme(item.nama);
            return (
              <div
                key={item.no}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
              >
                {/* Left: Avatar Initial & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Initial Avatar Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] shrink-0 select-none ${avatar.bg} ${avatar.text}`}
                  >
                    {item.nama[0]}
                  </div>

                  {/* Student Name, NIS & Time */}
                  <div className="min-w-0 leading-tight">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate">
                      {item.nama}{' '}
                      <span className="font-normal text-slate-500 text-[11.5px]">
                        • NIS {item.nis}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal truncate">
                      {item.kelas} • {item.waktu}
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill Badge (Clickable to change status) */}
                <div className="shrink-0">
                  {renderStatusBadge(item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DESKTOP VIEW (Table view preserved for large screens)  */}
      {/* ========================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header & Breadcrumb */}
        <div className="text-left">
          <h1 className="text-[27px] font-bold text-[#1e293b] tracking-tight leading-tight">
            Presensi Hari Ini
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
            <span>Presensi</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Data Presensi</span>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-slate-600 font-medium">Tanggal</label>
              <div className="relative">
                <input
                  type="text"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-36 px-3 py-2 pr-9 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 focus:outline-hidden"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[13px] text-slate-600 font-medium">Jurusan</label>
              <div className="relative">
                <select
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <option value="Semua Jurusan">Semua Jurusan</option>
                  <option value="TKJ">TKJ</option>
                  <option value="AKL">AKL</option>
                  <option value="OTPK">OTPK</option>
                  <option value="BDP">BDP</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[13px] text-slate-600 font-medium">Kelas</label>
              <div className="relative">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <option value="Semua Kelas">Semua Kelas</option>
                  <option value="XII TKJ 2">XII TKJ 2</option>
                  <option value="XI TKJ">XI TKJ</option>
                  <option value="X AKL">X AKL</option>
                  <option value="XI OTPK">XI OTPK</option>
                  <option value="X BDP">X BDP</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-2 bg-[#1d6ee5] hover:bg-[#1a5fca] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Tampilkan
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white text-[12px] font-bold text-slate-700">
                <th className="py-4 px-5 w-14">No</th>
                <th className="py-4 px-5">NIS</th>
                <th className="py-4 px-5">Nama Siswa</th>
                <th className="py-4 px-5">Kelas</th>
                <th className="py-4 px-5">Jurusan</th>
                <th className="py-4 px-5">Waktu</th>
                <th className="py-4 pr-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-[13px]">
              {filteredData.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 text-slate-500 font-mono text-xs">{row.no}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-xs">{row.nis}</td>
                  <td className="py-4 px-5 font-bold text-slate-900">{row.nama}</td>
                  <td className="py-4 px-5 text-slate-700 font-medium">{row.kelas}</td>
                  <td className="py-4 px-5 text-slate-700 font-medium">{row.jurusan}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-xs">{row.waktu}</td>
                  <td className="py-4 pr-8 text-right">
                    {renderStatusBadge(row)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop Pagination */}
          <div className="py-3.5 px-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-semibold text-slate-700">1 - {filteredData.length}</span> dari{' '}
              <span className="font-semibold text-slate-700">148</span> siswa
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50/50"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold ${
                  currentPage === 1 ? 'bg-[#1d6ee5] text-white' : 'border border-slate-200 text-slate-600'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium ${
                  currentPage === 2 ? 'bg-[#1d6ee5] text-white' : 'border border-slate-200 text-slate-600'
                }`}
              >
                2
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
