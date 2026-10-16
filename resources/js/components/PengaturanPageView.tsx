import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  Shield,
  ShieldCheck,
  Lock,
  ChevronRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  X,
  GraduationCap,
  Mail,
  KeyRound,
  LogOut,
  Info,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useProfilePhoto } from '../utils/profilePhotoState';
import { ChangePhotoModal } from './ChangePhotoModal';
import { PgriLogo } from './PgriLogo';
import { NavTab } from './Sidebar';

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

interface PengaturanPageViewProps {
  onNavigate?: (tab: NavTab) => void;
  onLogoutClick?: () => void;
}

export const PengaturanPageView: React.FC<PengaturanPageViewProps> = ({
  onNavigate,
  onLogoutClick,
}) => {
  const { photo } = useProfilePhoto();
  const [subTab, setSubTab] = useState<'jadwal' | 'keamanan'>('keamanan');
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>(INITIAL_SCHEDULE);
  const [isChangePhotoOpen, setIsChangePhotoOpen] = useState<boolean>(false);

  // Mobile multi-step flow:
  // Starts directly on 'request' (Akun & Keamanan) with NO top switcher bar!
  // Only when user clicks "Ajukan Permohonan Reset Password", it transitions to 'reviewing'
  // Then smoothly proceeds to 'approved' (Atur Sandi Baru)
  const [mobileStep, setMobileStep] = useState<'request' | 'reviewing' | 'approved'>('request');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false);

  // Password reset form state
  const [newPassword, setNewPassword] = useState<string>('GuruPintar#2026');
  const [confirmPassword, setConfirmPassword] = useState<string>('GuruPintar#2026');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Profile data
  const [namaLengkap, setNamaLengkap] = useState<string>('Untung Sudarto, S.Pd., M.Kom.');
  const [nip] = useState<string>('198705123456');
  const [username, setUsername] = useState<string>('@untung_sudarto');
  const [email, setEmail] = useState<string>('untung.sudarto@smkpgri11cld.sch.id');
  const [role] = useState<string>('Wali Kelas XII TKJ 1 & Guru Produktif');

  // Feedback Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // Auto-advance from 'reviewing' to 'approved' after 2.5 seconds
  useEffect(() => {
    if (mobileStep === 'reviewing') {
      const timer = setTimeout(() => {
        setMobileStep('approved');
        showToast('Permintaan telah disetujui Super Admin! Silakan atur kata sandi baru.');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [mobileStep]);

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

  // User clicks "Ajukan Permohonan Reset Password"
  const handleRequestPasswordReset = () => {
    setMobileStep('reviewing');
    showToast('Permohonan reset kata sandi telah dikirim ke Super Admin.');
  };

  // User submits new password
  const handleSaveNewPassword = () => {
    if (newPassword.length < 8) {
      showToast('Kata sandi harus minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setPasswordResetSuccess(true);
    showToast('Kata sandi baru berhasil disimpan dan diaktifkan!');
    setMobileStep('request');
  };

  // Password criteria verification
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@#$%^&*!_]/.test(newPassword);
  const isStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  return (
    <div className="relative pb-12 max-w-full font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-4 sm:right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 pl-4 sm:pl-5 pr-4 py-3 min-w-[300px] max-w-[420px] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1d4ed8]" />
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-[#1d4ed8]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 text-[12.5px] sm:text-[13px] font-medium text-slate-700">
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

      <div className="block md:hidden max-w-sm mx-auto">
        
        {mobileStep === 'request' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left pt-1">
            {/* Header: Title & Shield Icon */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[22px] font-extrabold text-[#000000] tracking-tight leading-tight">
                  Akun &amp; Keamanan
                </h1>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
              {/* Avatar + Name + Tags */}
              <div className="flex items-center gap-3.5">
                {/* Avatar with Green Checkmark Badge */}
                <div className="relative shrink-0">
                  <div
                    onClick={() => setIsChangePhotoOpen(true)}
                    className="w-[62px] h-[62px] rounded-full overflow-hidden border-2 border-white shadow-xs cursor-pointer group"
                    title="Klik untuk ubah foto"
                  >
                    <img
                      src={photo }
                      alt={namaLengkap}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-600 rounded-full ring-2 ring-white flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                {/* Identity info */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                    {namaLengkap}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    NIP . {nip}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 bg-[#e0e7ff] text-[#3730a3] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      <GraduationCap className="w-3 h-3" />
                      <span>Wali Kelas XII TKJ 1</span>
                    </span>
                    <span className="inline-block bg-[#d1fae5] text-[#065f46] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Guru Produktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Info Rows */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                {/* Username */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <User className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                    <span>Username</span>
                  </div>
                  <span className="bg-slate-100 text-slate-700 font-mono font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                    {username}
                  </span>
                </div>

                {/* Email Institusi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Mail className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                    <span>Email</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 truncate max-w-[170px]">
                    {email}
                  </span>
                </div>

                {/* Status Akun */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                    <span>Status</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <span>Terverifikasi</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Kata Sandi Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
                      Reset Kata Sandi
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                      Akses pemulihan &amp; proteksi akun guru
                    </p>
                  </div>
                </div>
              </div>

              {/* Kebijakan Otorisasi Terpusat Box */}
              <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[#1e40af] font-bold text-[11.5px]">
                  <span>Kebijakan Otorisasi Terpusat</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                  Perubahan kata sandi terikat dengan otorisasi Super Admin demi mencegah akses tidak sah pada data presensi siswa dan modul IoT RFID.
                </p>
              </div>

              {/* Status Permintaan Terakhir row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11.5px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.2]" />
                  <span>Status Permintaan Terakhir:</span>
                </div>
              </div>

              {/* Explanatory text */}
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Menekan tombol di bawah akan mengirimkan notifikasi permohonan ke dashboard Super Admin sekolah untuk diverifikasi
              </p>

              {/* Primary Action Button -> Triggers the review and set new password flow */}
              <button
                type="button"
                onClick={handleRequestPasswordReset}
                className="w-full py-3 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Ajukan Permohonan Reset Password</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* SCREEN 2: Permintaan Sedang Ditinjau! */}
        {/* ----------------------------------------------------------- */}
        {mobileStep === 'reviewing' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-center">
            {/* School Header Logo & Title */}
            <div className="flex flex-col items-center pt-2">
              <PgriLogo size={52} className="mx-auto drop-shadow-xs" />
              <h2 className="text-[16px] font-extrabold text-[#1d4ed8] tracking-tight mt-2">
                SMK PGRI 11 CILEDUG
              </h2>
              <p className="text-[9.5px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                SISTEM PRESENSI DIGITAL TERPADU
              </p>
            </div>

            {/* Pink Alert Box: Permintaan Sedang Ditinjau! */}
            <div className="bg-[#ffe4e6] border border-rose-100 rounded-2xl p-4.5 text-left relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#f43f5e] text-white flex items-center justify-center shrink-0 mb-2">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
                Permintaan Sedang Ditinjau!
              </h3>
              <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                Permintaan reset kata sandi akun Anda sedang ditinjau oleh Administrator. Mohon Menunggu
              </p>
            </div>

            {/* Teacher Mini Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-xs flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#3730a3] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-slate-900 leading-tight">
                    {namaLengkap}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    NIP : {nip}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] text-[10.5px] font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Terverifikasi</span>
              </span>
            </div>

            {/* Review Progress Indicator & Action to proceed */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-center gap-2 py-2 px-3 text-[11px] font-semibold text-rose-700 bg-rose-50/90 rounded-xl border border-rose-200/60">
                <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Menunggu respon Admin</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileStep('approved');
                  showToast('Permintaan telah disetujui oleh Super Admin!');
                }}
                className="w-full py-3 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Disetujui &bull; Buka Form Atur Sandi</span>
              </button>
            </div>

            {/* Return / Cancel Button */}
            <button
              type="button"
              onClick={() => {
                setMobileStep('request');
                if (onNavigate) {
                  onNavigate('dashboard');
                }
              }}
              className="w-full py-3 bg-[#e2e8f0] hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
              <span>Batal</span>
            </button>

            {/* Help Note Footnote */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
              <Info className="w-3.5 h-3.5 text-[#1d4ed8]" />
              <span>Perlu bantuan IT? Hubungi Ruang TU Lantai 1</span>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* SCREEN 3: Permintaan Disetujui Super Admin! & Atur Sandi Baru */}
        {/* ----------------------------------------------------------- */}
        {mobileStep === 'approved' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            {/* School Header Logo & Title */}
            <div className="flex flex-col items-center pt-2 text-center">
              <PgriLogo size={52} className="mx-auto drop-shadow-xs" />
              <h2 className="text-[16px] font-extrabold text-[#000000] tracking-tight mt-2">
                SMK PGRI 11 CILEDUG
              </h2>
              <p className="text-[9.5px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                SISTEM PRESENSI DIGITAL TERPADU
              </p>
            </div>

            {/* Green Alert Box: Permintaan Disetujui Super Admin! */}
            <div className="bg-[#dcfce7] border border-emerald-200 rounded-2xl p-5 text-left relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mb-3 shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
                Permintaan Disetujui Super Admin!
              </h3>
              <p className="text-[11.5px] text-slate-600 mt-1.5 leading-relaxed">
                Permintaan reset kata sandi akun Anda telah diverifikasi oleh Administrator Pusat. Silakan perbarui kata sandi Anda di bawah ini.
              </p>
            </div>

            {/* Teacher Mini Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-xs flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#3730a3] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-slate-900 leading-tight">
                    {namaLengkap}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    NIP : {nip}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] text-[10.5px] font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Terverifikasi</span>
              </span>
            </div>

            {/* Form Section: Atur Sandi Baru */}
            <div className="space-y-3.5 pt-1">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                  Atur Sandi Baru
                </h3>
                <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                  Pastikan kredensial baru Anda kuat dan rahasia.
                </p>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 stroke-[2]" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Masukkan kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Tingkat Keamanan:</span>
                  <span
                    className={`font-bold inline-flex items-center gap-1 ${
                      isStrong
                        ? 'text-emerald-600'
                        : hasMinLength
                        ? 'text-amber-600'
                        : 'text-rose-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isStrong
                          ? 'bg-emerald-500'
                          : hasMinLength
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>
                      {isStrong
                        ? 'Kuat'
                        : hasMinLength
                        ? 'Sedang'
                        : 'Lemah'}
                    </span>
                  </span>
                </div>
                {/* 3 Green Indicator Bars */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      hasMinLength ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      hasUppercase && hasNumber ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      isStrong ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4 stroke-[2]" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Ulangi kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Ketentuan Kata Sandi (2x2 Checklist Grid) */}
              <div className="pt-1">
                <span className="text-[10.5px] font-bold text-slate-500 tracking-wider uppercase block mb-2">
                  KETENTUAN KATA SANDI
                </span>
                <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-[11px] text-slate-700 font-medium">
                  {/* Min 8 Karakter */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        hasMinLength
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Min. 8 karakter</span>
                  </div>

                  {/* Huruf kapital (A-Z) */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        hasUppercase
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Huruf kapital (A-Z)</span>
                  </div>

                  {/* Angka (0-9) */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        hasNumber
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Angka (0-9)</span>
                  </div>

                  {/* Simbol unik (@,#,$) */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        hasSpecial
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Simbol unik (@,#,$)</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleSaveNewPassword}
                className="w-full py-3 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99] mt-2"
              >
                <span>Simpan</span>
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileStep('request');
                  if (onNavigate) {
                    onNavigate('dashboard');
                  }
                }}
                className="w-full py-3 bg-[#e2e8f0] hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
              
                <span>Kembali ke Dashboard</span>
              </button>

              {/* Help Footnote */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
                <Info className="w-3.5 h-3.5 text-[#1d4ed8]" />
                <span>Perlu bantuan IT? Hubungi Ruang TU Lantai 1</span>
              </div>

              {/* Footer Copyright */}
              <div className="pt-4 text-center text-[10.5px] text-slate-400 leading-relaxed font-normal">
                <p>© 2026 SMK PGRI 11 CILEDUG</p>
                <p>Sistem Presensi Digital Terintegrasi Berbasis RFID &amp; IoT</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP VIEW: Full Configuration & Parameter Controls (Screens >= 768px) */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header & Breadcrumb */}
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

        {/* Sub-Navigation Tabs Card */}
        <div className="flex">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 px-5 pt-3 pb-0 flex items-center gap-8">
            <button
              type="button"
              onClick={() => setSubTab('keamanan')}
              className={`pb-3 text-[13.5px] font-bold transition-all relative cursor-pointer whitespace-nowrap text-center ${
                subTab === 'keamanan'
                  ? 'text-[#1d4ed8] border-b-2 border-[#1d4ed8]'
                  : 'text-slate-400 hover:text-slate-700 font-semibold'
              }`}
            >
              Akun &amp; Keamanan
            </button>
            <button
              type="button"
              onClick={() => setSubTab('jadwal')}
              className={`pb-3 text-[13.5px] font-bold transition-all relative cursor-pointer whitespace-nowrap text-center ${
                subTab === 'jadwal'
                  ? 'text-[#1d4ed8] border-b-2 border-[#1d4ed8]'
                  : 'text-slate-400 hover:text-slate-700 font-semibold'
              }`}
            >
              Jadwal Presensi
            </button>
          </div>
        </div>

        {/* TAB 1: AKUN & KEAMANAN (Desktop) */}
        {subTab === 'keamanan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200 text-left">
            {/* LEFT COLUMN: Profil Saya (~60% / 7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-100 p-5 sm:p-6 space-y-6">
              {/* Header: Profil Saya */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                      Profil Pendidik &amp; Tenaga Kependidikan
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Informasi identitas pribadi dan hak akses sistem presensi
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Avatar & Identity Card */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <div
                    onClick={() => setIsChangePhotoOpen(true)}
                    style={{ width: '72px', height: '72px' }}
                    className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px] rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-0.5 shadow-xs cursor-pointer group shrink-0 overflow-hidden"
                    title="Klik untuk ganti foto profil"
                  >
                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                      <img
                        src={photo}
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
                    className="text-[11px] font-semibold text-[#1d4ed8] hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Ubah Foto
                  </button>
                </div>

                {/* Identity Info */}
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                      {namaLengkap}
                    </h3>
                    </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    SMK PGRI 11 CILEDUG
                  </p>

                  {/* Sub-badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NIP. {nip}</span>
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
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
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
                  onClick={handleSaveProfile}
                  className="px-5 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Simpan </span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Reset Kata Sandi (~40% / 5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-100 p-5 sm:p-6 space-y-5">
              {/* Header: Reset Kata Sandi */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Reset Kata Sandi
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Akses pemulihan dan otorisasi Super Admin
                  </p>
                </div>
              </div>

              {/* Blue Kebijakan Keamanan Box */}
              <div className="bg-[#f0f9ff] border border-blue-100 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 text-[#1e40af] font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  <span>Kebijakan Otorisasi Terpusat</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  Perubahan kata sandi terikat dengan otorisasi Super Admin demi mencegah akses tidak sah pada data presensi siswa dan modul IoT RFID.
                </p>
              </div>

              {/* Status Permintaan Reset Box */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">Status Permintaan:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{passwordResetSuccess ? 'Disetujui & Diperbarui' : 'Siap Diajukan'}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Target Akun</span>
                    <span className="font-medium text-slate-700">Untung Sudarto, S.Pd., M.Kom.</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Otoritas Verifikasi</span>
                    <span className="font-medium text-slate-700">Super Admin SMK PGRI 11</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRequestPasswordReset}
                className="w-full py-3 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ajukan Reset Kata Sandi</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: JADWAL PRESENSI (Desktop) */}
        {subTab === 'jadwal' && (
          <div className="space-y-5 animate-in fade-in duration-200 text-left">
            {/* Blue Info Alert Box */}
            <div className="bg-[#eff6ff] rounded-2xl p-4 sm:p-4.5 border border-blue-100/90 relative overflow-hidden flex items-start sm:items-center gap-3.5">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1d4ed8]" />
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[#1d4ed8] shrink-0 pl-0.5">
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
                                item.active ? 'bg-[#1d4ed8]' : 'bg-slate-300'
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
                              item.active ? 'bg-[#1d4ed8]' : 'bg-slate-200'
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
                  className="px-5 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Jadwal Presensi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Branding text */}
        <footer className="pt-8 pb-4 text-center text-xs text-slate-400 font-medium">
          © 2026 SMK PGRI 11 CILEDUG - Sistem Presensi Digital Berbasis RFID dan IoT. Hak Cipta Dilindungi.
        </footer>
      </div>

      {/* Change Photo Modal */}
      <ChangePhotoModal
        isOpen={isChangePhotoOpen}
        onClose={() => setIsChangePhotoOpen(false)}
      />
    </div>
  );
};
