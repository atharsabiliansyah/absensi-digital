import React, { useState } from 'react';
import {
  Check,
  Clock,
  FileText,
  User,
  X,
  ChevronDown,
  FileSpreadsheet,
  Download,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface LaporanRecord {
  no: number;
  tanggal: string;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  status: 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Tidak Hadir';
  waktu: string;
}

export const LaporanPageView: React.FC = () => {
  // Mode: default is 'tabel' (user sees data table first!), then clicks 'Export ke Excel' to open 'export' view!
  const [activeMode, setActiveMode] = useState<'tabel' | 'export'>('tabel');

  // Form states for Filter & Export
  const [jenisLaporan, setJenisLaporan] = useState<string>('Presensi Siswa');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua Jurusan');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua Kelas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Table records matching screenshot exactly
  const initialRecords: LaporanRecord[] = [
    {
      no: 1,
      tanggal: '01/09/2026',
      nis: '001234',
      nama: 'Isa',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Hadir',
      waktu: '06:58',
    },
    {
      no: 2,
      tanggal: '01/09/2026',
      nis: '001235',
      nama: 'Bador',
      kelas: 'X AKL',
      jurusan: 'AKL',
      status: 'Terlambat',
      waktu: '07:12',
    },
    {
      no: 3,
      tanggal: '01/09/2026',
      nis: '001236',
      nama: 'Citra',
      kelas: 'XI OTPK',
      jurusan: 'OTPK',
      status: 'Hadir',
      waktu: '06:57',
    },
    {
      no: 4,
      tanggal: '01/09/2026',
      nis: '001237',
      nama: 'Dimas',
      kelas: 'X BDP',
      jurusan: 'BDP',
      status: 'Tidak Hadir',
      waktu: '-',
    },
    {
      no: 5,
      tanggal: '01/09/2026',
      nis: '001238',
      nama: 'Eka Putri',
      kelas: 'XI TKJ',
      jurusan: 'TKJ',
      status: 'Izin',
      waktu: '-',
    },
    {
      no: 6,
      tanggal: '01/09/2026',
      nis: '001239',
      nama: 'Fani Rahma',
      kelas: 'X AKL',
      jurusan: 'AKL',
      status: 'Sakit',
      waktu: '-',
    },
  ];

  const [records, setRecords] = useState<LaporanRecord[]>(initialRecords);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const showToast = (title: string, description: string) => {
    setToastNotification({ title, description });
    setTimeout(() => {
      setToastNotification((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // Real Excel / CSV file download
  const handleDownloadFile = () => {
    const headers = ['NO', 'TANGGAL', 'NIS', 'NAMA SISWA', 'KELAS', 'JURUSAN', 'STATUS', 'WAKTU'];
    const rows = records.map((r, i) => [
      i + 1,
      r.tanggal,
      r.nis,
      `"${r.nama}"`,
      `"${r.kelas}"`,
      r.jurusan,
      r.status,
      r.waktu,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const sanitizedJenis = jenisLaporan.replace(/\s+/g, '_');
    link.setAttribute(
      'download',
      `Laporan_${sanitizedJenis}_${selectedMonth}_${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      'Export Excel Berhasil',
      `Berkas Laporan_${sanitizedJenis}_${selectedMonth}_${selectedYear}.xlsx berhasil diunduh.`
    );
  };

  const handleFilter = () => {
    let filtered = [...initialRecords];
    if (selectedJurusan !== 'Semua Jurusan') {
      filtered = filtered.filter((r) => r.jurusan === selectedJurusan);
    }
    if (selectedKelas !== 'Semua Kelas') {
      filtered = filtered.filter((r) => r.kelas === selectedKelas);
    }
    if (selectedStatus !== 'Semua Status') {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }
    setRecords(filtered);
    showToast(
      'Filter Laporan Berhasil Diterapkan',
      `Menampilkan presensi ${selectedMonth} ${selectedYear} (${selectedJurusan} • ${selectedKelas})`
    );
  };

  const getStatusBadge = (status: LaporanRecord['status']) => {
    switch (status) {
      case 'Hadir':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Terlambat':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Tidak Hadir':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'Izin':
        return 'bg-sky-50 text-sky-600 border border-sky-200';
      case 'Sakit':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const currentFileName = `Laporan_${jenisLaporan.replace(/\s+/g, '_')}_${selectedMonth}_${selectedYear}.xlsx`;

  return (
    <div className="space-y-6 relative pb-8">
      {/* Floating Toast Notification (Never covers the top header / Untung Sudarto) */}
      {toastNotification && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-l-4 border-l-emerald-500 border border-slate-100 p-3.5 sm:p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h5 className="text-[13px] sm:text-[13.5px] font-bold text-slate-900 leading-tight">
              {toastNotification.title}
            </h5>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
              {toastNotification.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: TABEL DATA LAPORAN (DEFAULT VIEW) */}
      {/* ======================================================== */}
      {activeMode === 'tabel' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. Header Title & Breadcrumb */}
          <div className="text-left">
            <h1 className="text-2xl sm:text-[32px] font-bold text-[#1e293b] tracking-tight">
              Laporan Presensi
            </h1>
          </div>

          {/* 2. Top Filter Card (Periode, Jurusan, Kelas, Status + Tampilkan) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Periode: Bulan & Tahun */}
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Periode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Jurusan */}
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Jurusan
                </label>
                <div className="relative">
                  <select
                    value={selectedJurusan}
                    onChange={(e) => setSelectedJurusan(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
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

              {/* Kelas */}
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Kelas
                </label>
                <div className="relative">
                  <select
                    value={selectedKelas}
                    onChange={(e) => setSelectedKelas(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="Semua Kelas">Semua Kelas</option>
                    <option value="X AKL">X AKL</option>
                    <option value="X BDP">X BDP</option>
                    <option value="XI TKJ">XI TKJ</option>
                    <option value="XI OTPK">XI OTPK</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Action Button: Tampilkan */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={handleFilter}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 px-5 rounded-xl text-xs sm:text-[13.5px] font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center"
                >
                  Tampilkan
                </button>
              </div>
            </div>
          </div>

          {/* 3. 5 Stat Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Hadir */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-emerald-600 stroke-[2.8]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Hadir</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  1.250
                </div>
              </div>
            </div>

            {/* Terlambat */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-amber-600 stroke-[2.4]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Terlambat</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  120
                </div>
              </div>
            </div>

            {/* Izin */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-sky-600 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Izin</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  35
                </div>
              </div>
            </div>

            {/* Sakit */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-purple-600 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Sakit</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  28
                </div>
              </div>
            </div>

            {/* Tidak Hadir */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <X className="w-6 h-6 text-rose-600 stroke-[2.8]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Tidak Hadir</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  67
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Data Table Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] sm:text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6 w-14 font-bold whitespace-nowrap">NO</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[120px]">TANGGAL</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[100px]">NIS</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[150px]">NAMA SISWA</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[100px]">KELAS</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[100px]">JURUSAN</th>
                    <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[110px]">STATUS</th>
                    <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[100px]">WAKTU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-[13px] sm:text-[13.5px]">
                  {records.map((row, idx) => (
                    <tr key={row.no} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                        {row.tanggal}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono whitespace-nowrap">
                        {row.nis}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                        {row.nama}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                        {row.kelas}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                        {row.jurusan}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3.5 py-1 text-xs font-semibold rounded-full shadow-2xs ${getStatusBadge(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center font-mono text-slate-600 whitespace-nowrap">
                        {row.waktu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Export ke Excel Button below table (Switches to Export Screen!) */}
          <div className="text-left pt-1">
            <button
              onClick={() => setActiveMode('export')}
              className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-[13.5px] flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
              <span>Export ke Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: EXPORT LAPORAN KE EXCEL (Opens after clicking button) */}
      {/* ======================================================== */}
      {activeMode === 'export' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-9 shadow-xs relative animate-in fade-in duration-200">
          {/* Card Header: Title & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7 pb-2 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Export Laporan ke Excel
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveMode('tabel')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Export Excel
                </button>
                <span>&gt;</span>
                <span className="text-slate-800 font-bold">Pilih Data</span>
              </p>
            </div>
          </div>

          {/* 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form: Filters & Export Button (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Field 1: Jenis Laporan */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Jenis Laporan
                </label>
                <div className="relative">
                  <select
                    value={jenisLaporan}
                    onChange={(e) => setJenisLaporan(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="Presensi Siswa">Presensi Siswa</option>
                    <option value="Rekap Bulanan">Rekap Bulanan</option>
                    <option value="Presensi Guru & Staf">Presensi Guru & Staf</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2 & 3: Periode Bulan & Periode Tahun */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Periode Bulan
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Periode Tahun
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field 4 & 5: Jurusan & Kelas */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Jurusan
                  </label>
                  <div className="relative">
                    <select
                      value={selectedJurusan}
                      onChange={(e) => setSelectedJurusan(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="Semua Jurusan">Semua Jurusan</option>
                      <option value="TKJ">TKJ</option>
                      <option value="AKL">AKL</option>
                      <option value="OTPK">OTPK</option>
                      <option value="BDP">BDP</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Kelas
                  </label>
                  <div className="relative">
                    <select
                      value={selectedKelas}
                      onChange={(e) => setSelectedKelas(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="Semua Kelas">Semua Kelas</option>
                      <option value="X AKL">X AKL</option>
                      <option value="X BDP">X BDP</option>
                      <option value="XI TKJ">XI TKJ</option>
                      <option value="XI OTPK">XI OTPK</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field 6: Status Kehadiran */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Status Kehadiran
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons: Export ke Excel & Back to Table */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-[13.5px] flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
                  <span>Export ke Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('tabel')}
                  className="text-slate-600 hover:text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Tabel Data</span>
                </button>
              </div>
            </div>

            {/* Right Column: HASIL FILE EXCEL Box (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <div className="bg-emerald-50/30 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-xs">
                {/* Section Header */}
                <h3 className="text-[11.5px] font-bold text-emerald-800 tracking-wider uppercase mb-5">
                  HASIL FILE EXCEL
                </h3>

                {/* Big Green Excel File Icon */}
                <div className="w-[78px] h-[78px] rounded-2xl bg-[#059669] text-white flex flex-col items-center justify-center shadow-md shadow-emerald-700/25 mb-4 select-none transition-transform hover:scale-105 duration-200">
                  <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center mb-1">
                    <span className="text-white text-base font-black tracking-tight leading-none">
                      X
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold text-white tracking-widest leading-none">
                    XLSX
                  </span>
                </div>

                {/* File Name */}
                <h4 className="text-[13px] sm:text-[13.5px] font-bold text-slate-800 max-w-[240px] leading-snug break-words mb-1">
                  {currentFileName}
                </h4>

                {/* File Size */}
                <p className="text-xs text-slate-400 font-normal mb-4">
                  Ukuran Berkas: <span className="font-semibold text-slate-600">42 KB</span>
                </p>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Berhasil diexport</span>
                </div>

                {/* Unduh Berkas Ulang Action */}
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-all cursor-pointer mt-1"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Unduh Berkas Ulang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
