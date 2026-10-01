import React, { useState } from 'react';
import {
  Clock,
  User,
  Shield,
  Lock,
  ChevronRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Save,
  Camera,
  RefreshCw,
  X,
  FileCheck2,
} from 'lucide-react';
import { useProfilePhoto } from '../utils/profilePhotoState';
import { ChangePhotoModal } from './ChangePhotoModal';

interface ScheduleDay {
  id: string;
  hari: string;
  isUpacara?: boolean;
  status: 'Aktif Belajar' | 'Hari Libur';
  jamMasukPagi: string;
  batasToleransi: string;
  jamMasukSiang: string;
  sesi: string;
  active: boolean;
}

const INITIAL_SCHEDULE: ScheduleDay[] = [
  {
    id: 'senin',
    hari: 'Senin (Upacara)',
    isUpacara: true,
    status: 'Aktif Belajar',
    jamMasukPagi: '07:10 AM',
    batasToleransi: '07:30 AM',
    jamMasukSiang: '03:30 PM',
    sesi: 'Pagi & Sore',
    active: true,
  },
  {
    id: 'selasa',
    hari: 'Selasa',
    status: 'Aktif Belajar',
    jamMasukPagi: '07:00 AM',
    batasToleransi: '07:15 AM',
    jamMasukSiang: '03:30 PM',
    sesi: 'Pagi & Sore',
    active: true,
  },
  {
    id: 'rabu',
    hari: 'Rabu',
    status: 'Aktif Belajar',
    jamMasukPagi: '07:00 AM',
    batasToleransi: '07:15 AM',
    jamMasukSiang: '03:30 PM',
    sesi: 'Pagi & Sore',
    active: true,
  },
  {
    id: 'kamis',
    hari: 'Kamis',
    status: 'Aktif Belajar',
    jamMasukPagi: '07:00 AM',
    batasToleransi: '07:15 AM',
    jamMasukSiang: '03:30 PM',
    sesi: 'Pagi & Sore',
    active: true,
  },
  {
    id: 'jumat',
    hari: 'Jumat',
    status: 'Aktif Belajar',
    jamMasukPagi: '06:45 AM',
    batasToleransi: '07:05 AM',
    jamMasukSiang: '11:45 AM',
    sesi: 'Pagi & Siang',
    active: true,
  },
  {
    id: 'sabtu',
    hari: 'Sabtu',
    status: 'Aktif Belajar',
    jamMasukPagi: '07:30 AM',
    batasToleransi: '08:00 AM',
    jamMasukSiang: '12:00 PM',
    sesi: 'Presensi 1x',
    active: true,
  },
  {
    id: 'minggu',
    hari: 'Minggu',
    status: 'Hari Libur',
    jamMasukPagi: '-',
    batasToleransi: '-',
    jamMasukSiang: '-',
    sesi: 'Sistem Dinonaktifkan',
    active: false,
  },
];

export const PengaturanPageView: React.FC = () => {
  const { photo: teacherPhoto } = useProfilePhoto();
  const [subTab, setSubTab] = useState<'jadwal' | 'keamanan'>('jadwal');
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>(INITIAL_SCHEDULE);
  const [isChangePhotoOpen, setIsChangePhotoOpen] = useState<boolean>(false);

  // Profile form state
  const [namaLengkap, setNamaLengkap] = useState<string>('Bapak/Ibu Guru, S.Pd., M.Kom.');
  const [nip] = useState<string>('198705123456');
  const [username, setUsername] = useState<string>('@ guru');
  const [email, setEmail] = useState<string>('guru@smkpgri11ciledug.sch.id');
  const [role] = useState<string>('Administrator Presensi & Wali Kelas');

  // Feedback Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleToggleDay = (id: string) => {
    setScheduleData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextActive = !item.active;
          return {
            ...item,
            active: nextActive,
            status: nextActive ? 'Aktif Belajar' : 'Hari Libur',
          };
        }
        return item;
      })
    );
  };

  const handleScheduleChange = (id: string, field: keyof ScheduleDay, value: string) => {
    setScheduleData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleResetSchedule = () => {
    setScheduleData(INITIAL_SCHEDULE);
    showToast('Jadwal presensi berhasil dikembalikan ke pengaturan default.');
  };

  const handleSaveSchedule = () => {
    showToast('Perubahan jadwal presensi berhasil disimpan dan disinkronkan ke RFID.');
  };

  const handleSaveProfile = () => {
    showToast('Profil pengguna berhasil diperbarui.');
  };

  const handleRequestPasswordReset = () => {
    showToast('Permohonan reset kata sandi telah dikirim ke WhatsApp dan Super Admin.');
  };

  return (
    <div className="space-y-6 relative pb-12 max-w-full font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 pl-5 pr-4 py-3 min-w-[320px] max-w-[420px] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1d6ee5]" />
            <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center shrink-0 text-[#1d6ee5]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 text-[13px] font-medium text-slate-700">
              {toastMsg}
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header & Breadcrumb (Matches Screenshot) */}
      <div className="text-left">
        <h1 className="text-[25px] sm:text-[27px] font-bold text-[#1e293b] tracking-tight leading-tight">
          Pengaturan Sistem
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
          <span className="hover:text-slate-600 transition-colors cursor-pointer">Pengaturan</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-600">Konfigurasi Parameter &amp; Jadwal</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs Card (Responsive width matching buttons) */}
      <div className="flex">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 px-3 sm:px-5 pt-3 pb-0 flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-around sm:justify-start">
          <button
            type="button"
            onClick={() => setSubTab('jadwal')}
            className={`pb-3 text-[13.5px] font-bold transition-all relative cursor-pointer whitespace-nowrap text-center ${
              subTab === 'jadwal'
                ? 'text-[#1d6ee5] border-b-2 border-[#1d6ee5]'
                : 'text-slate-400 hover:text-slate-700 font-semibold'
            }`}
          >
            Jadwal Presensi
          </button>
          <button
            type="button"
            onClick={() => setSubTab('keamanan')}
            className={`pb-3 text-[13.5px] font-bold transition-all relative cursor-pointer whitespace-nowrap text-center ${
              subTab === 'keamanan'
                ? 'text-[#1d6ee5] border-b-2 border-[#1d6ee5]'
                : 'text-slate-400 hover:text-slate-700 font-semibold'
            }`}
          >
            Akun &amp; Keamanan
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: JADWAL PRESENSI VIEW (Matches Screenshot 1 Exactly) */}
      {/* ========================================================= */}
      {subTab === 'jadwal' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Blue Info Alert Box */}
          <div className="bg-[#eff6ff] rounded-2xl p-4 sm:p-4.5 border border-blue-100/90 relative overflow-hidden flex items-start sm:items-center gap-3.5">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1d6ee5]" />
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[#1d6ee5] shrink-0 pl-0.5">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[13.5px] font-bold text-slate-800">
                Konfigurasi Jam Presensi Masuk &amp; Toleransi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Siswa yang melakukan scan RFID setelah jam masuk hingga batas toleransi akan tercatat{' '}
                <span className="font-bold text-slate-700">Terlambat</span>. Tap lewat batas akhir tidak
                diakui sebagai kehadiran masuk.
              </p>
            </div>
          </div>

          {/* Schedule Table Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-white text-[11.5px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-4 px-5">HARI OPERASIONAL</th>
                    <th className="py-4 px-4">STATUS HARI</th>
                    <th className="py-4 px-4">JAM MASUK PAGI</th>
                    <th className="py-4 px-4">BATAS TOLERANSI</th>
                    <th className="py-4 px-4">JAM MASUK SIANG</th>
                    <th className="py-4 px-4">SESI / TOLERANSI</th>
                    <th className="py-4 pr-6 text-right">AKSI CEPAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {scheduleData.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !item.active ? 'opacity-70 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* 1. Hari Operasional */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.active ? 'bg-[#1d6ee5]' : 'bg-slate-300'
                            }`}
                          />
                          <span
                            className={`font-bold ${
                              item.active ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {item.hari}
                          </span>
                        </div>
                      </td>

                      {/* 2. Status Hari */}
                      <td className="py-4 px-4">
                        {item.status === 'Aktif Belajar' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#dcfce7] text-[#16a34a]">
                            Aktif Belajar
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#fee2e2] text-[#ef4444]">
                            Hari Libur
                          </span>
                        )}
                      </td>

                      {/* 3. Jam Masuk Pagi */}
                      <td className="py-4 px-4">
                        {item.jamMasukPagi === '-' ? (
                          <span className="text-slate-400 font-mono text-sm pl-4">-</span>
                        ) : (
                          <input
                            type="text"
                            value={item.jamMasukPagi}
                            onChange={(e) =>
                              handleScheduleChange(item.id, 'jamMasukPagi', e.target.value)
                            }
                            className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        )}
                      </td>

                      {/* 4. Batas Toleransi */}
                      <td className="py-4 px-4">
                        {item.batasToleransi === '-' ? (
                          <span className="text-slate-400 font-mono text-sm pl-4">-</span>
                        ) : (
                          <input
                            type="text"
                            value={item.batasToleransi}
                            onChange={(e) =>
                              handleScheduleChange(item.id, 'batasToleransi', e.target.value)
                            }
                            className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        )}
                      </td>

                      {/* 5. Jam Masuk Siang */}
                      <td className="py-4 px-4">
                        {item.jamMasukSiang === '-' ? (
                          <span className="text-slate-400 font-mono text-sm pl-4">-</span>
                        ) : (
                          <input
                            type="text"
                            value={item.jamMasukSiang}
                            onChange={(e) =>
                              handleScheduleChange(item.id, 'jamMasukSiang', e.target.value)
                            }
                            className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        )}
                      </td>

                      {/* 6. Sesi / Toleransi */}
                      <td className="py-4 px-4">
                        {item.sesi === 'Sistem Dinonaktifkan' ? (
                          <span className="text-xs text-slate-400 font-medium">
                            Sistem Dinonaktifkan
                          </span>
                        ) : (
                          <span className="inline-block bg-slate-100 text-slate-600 text-[11.5px] font-medium px-2.5 py-1 rounded-lg">
                            {item.sesi}
                          </span>
                        )}
                      </td>

                      {/* 7. Aksi Cepat: Toggle switch */}
                      <td className="py-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(item.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            item.active ? 'bg-[#1d6ee5]' : 'bg-slate-200'
                          }`}
                          aria-label={`Toggle status ${item.hari}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              item.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Perubahan jadwal akan langsung berlaku pada mesin sensor RFID siswa.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetSchedule}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Reset ke Default
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-5 py-2 bg-[#1d6ee5] hover:bg-[#1a5fca] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Jadwal Presensi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: AKUN & KEAMANAN VIEW (Matches Screenshot 2 Exactly) */}
      {/* ========================================================= */}
      {subTab === 'keamanan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          {/* LEFT COLUMN: Profil Saya (~60% / 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-100 p-5 sm:p-6 space-y-6">
            {/* Header: Profil Saya */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1d6ee5] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Profil Saya
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Informasi identitas pribadi dan hak akses sistem
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Avatar & Identity Card */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Teacher Avatar */}
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <div
                  onClick={() => setIsChangePhotoOpen(true)}
                  style={{ width: '72px', height: '72px' }}
                  className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px] rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-0.5 shadow-xs cursor-pointer group shrink-0 overflow-hidden"
                  title="Klik untuk ganti foto profil"
                >
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src={teacherPhoto}
                      alt="Foto Guru"
                      width={68}
                      height={68}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="w-full h-full object-cover rounded-full block group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePhotoOpen(true)}
                  className="text-[11px] font-semibold text-[#1d6ee5] hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Ubah Foto
                </button>
              </div>

              {/* Identity Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Bapak/Ibu Guru
                  </h3>
                  <span className="bg-blue-100 text-[#1d4ed8] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    Wali Kelas XII TKJ 1
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  SMK PGRI 11 CILEDUG • NIP Terdaftar Kementerian
                </p>

                {/* Sub-badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NIP. 198705123456</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                    <span>ID Guru: #G-104</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* NIP */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      NIP (Nomor Induk Pegawai)
                    </label>
                    <span className="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Terverifikasi
                    </span>
                  </div>
                  <input
                    type="text"
                    value={nip}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email Institusi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Institusi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Peran / Jabatan Sistem */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Peran / Jabatan Sistem
                </label>
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-[#1d6ee5] hover:bg-[#1a5fca] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Reset Kata Sandi (~40% / 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-100 p-5 sm:p-6 space-y-5">
            {/* Header: Reset Kata Sandi */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                  Reset Kata Sandi
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Akses pemulihan dan reset akun guru
                </p>
              </div>
            </div>

            {/* Blue Kebijakan Keamanan Box */}
            <div className="bg-[#f0f7ff] border border-blue-100/90 rounded-2xl p-4 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                <Shield className="w-4 h-4 text-[#1d6ee5]" />
                <span>Kebijakan Keamanan Akun</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11.5px]">
                Perubahan kata sandi terikat dengan otorisasi Super Admin demi mencegah akses tidak sah
                pada data presensi siswa dan modul RFID.
              </p>
            </div>

            {/* Status Permintaan Reset Box */}
            <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/40">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Status Permintaan Reset:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Disetujui Super Admin</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Permintaan Terakhir</span>
                  <span className="font-medium text-slate-700">18 Ags 2026, 09:15 WIB</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Verifikator</span>
                  <span className="font-medium text-slate-700">Super Admin (Kepala Lab)</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Metode Verifikasi</span>
                  <span className="font-medium text-slate-700">OTP WhatsApp &amp; Konfirmasi IT</span>
                </div>
              </div>
            </div>

            {/* Yellow / Amber Warning Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11.5px]">
                Menekan tombol di bawah akan mengirimkan permohonan tautan reset langsung ke nomor WhatsApp
                institusi terdaftar dan dashboard persetujuan Super Admin.
              </p>
            </div>

            {/* Reset Action Button */}
            <button
              type="button"
              onClick={handleRequestPasswordReset}
              className="w-full py-3 bg-[#1d6ee5] hover:bg-[#1a5fca] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Ajukan Reset Kata Sandi</span>
            </button>

            {/* Subtext info */}
            <p className="text-[11px] text-slate-400 text-center font-medium">
              Butuh bantuan mendesak? Hubungi Tim IT Presensi SMK PGRI 11
            </p>
          </div>
        </div>
      )}

      {/* Footer Branding text matching screenshot */}
      <footer className="pt-8 pb-4 text-center text-xs text-slate-400 font-medium">
        © 2026 SMK PGRI 11 CILEDUG - Sistem Presensi Digital Berbasis RFID dan IoT. Hak Cipta Dilindungi.
      </footer>

      {/* Change Photo Modal */}
      <ChangePhotoModal
        isOpen={isChangePhotoOpen}
        onClose={() => setIsChangePhotoOpen(false)}
      />
    </div>
  );
};
