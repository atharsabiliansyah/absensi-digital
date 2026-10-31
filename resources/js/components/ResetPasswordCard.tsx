import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
    KeyRound, 
    AlertCircle, 
    CheckCircle2, 
    Eye, 
    EyeOff, 
    Check, 
    ShieldCheck,
    Shield
} from 'lucide-react';

export default function ResetPasswordCard() {
    const { auth, resetStatus } = usePage<any>().props;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const hasMinLength = newPassword.length >= 8;
    const hasMatch = newPassword.length > 0 && newPassword === confirmPassword;

    const handleRequestReset = () => {
        router.post('/password-reset/request');
    };

    const handleSaveNewPassword = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/password-reset/save', {
            password: newPassword,
            password_confirmation: confirmPassword,
        }, {
            onSuccess: () => {
                setNewPassword('');
                setConfirmPassword('');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-5 text-left max-w-md w-full relative shadow-xs">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-[#1d6ee5] rounded-xl">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Reset Kata Sandi</h3>
                    <p className="text-xs text-slate-400">Akses pemulihan dan otorisasi Admin</p>
                </div>
            </div>

            {resetStatus === 'pending' && (
                <div className="p-4 bg-rose-50/90 border border-rose-200/80 rounded-2xl space-y-3">
                    <div className="flex items-start gap-3 text-rose-700">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                            <h5 className="font-bold">Permintaan sedang Ditinjau</h5>
                            <p className="text-rose-600 leading-relaxed text-[11.5px]">
                                Permintaan reset kata sandi akun Anda telah terkirim ke Admin, silahkan menunggu atau hubungi admin untuk disetujui.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {resetStatus === 'approved' && (
                <div className="space-y-4 pt-1">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                        <div>
                            <h5 className="font-bold">Permintaan Disetujui Admin</h5>
                            <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                                Permintaan reset kata sandi akun Anda telah diverifikasi dan disetujui. Silahkan perbarui kata sandi Anda di bawah ini.
                            </p>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">{auth?.user?.name ?? 'Untung Sudarto'}</h4>
                                
                            </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Terverifikasi
                        </span>
                    </div>

                    <form onSubmit={handleSaveNewPassword} className="space-y-3.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi baru"
                                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi kata sandi baru"
                                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-500 border border-slate-100">
                            <p className="font-bold text-slate-700">Ketentuan Kata Sandi:</p>
                            <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                                <span className={hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                    {hasMinLength ? '✓' : '•'} Minimal 8 karakter
                                </span>
                                <span className={hasMatch ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                    {hasMatch ? '✓' : '•'} Konfirmasi cocok
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!hasMinLength || !hasMatch}
                            className="w-full py-2.5 bg-[#1d6ee5] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                        >
                            Simpan & Aktifkan Password Baru
                        </button>
                    </form>
                </div>
            )}

            {(resetStatus === 'none' || resetStatus === 'completed' || resetStatus === 'rejected' || !resetStatus) && (
                <div className="space-y-4 pt-1">
                    {/* Card Otorisasi */}
                    <div className="p-4 bg-[#f0f9ff] border border-blue-100 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-[#1d6ee5] font-bold">
                            <span>Kebijakan Otorisasi Terpusat</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11.5px]">
                            Perubahan kata sandi terikat dengan otorisasi Admin demi mencegah akses tidak sah pada data presensi siswa dan modul IoT RFID.
                        </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/40">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                            <span className="font-semibold text-slate-700">Status Permintaan:</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                                Siap Diajukan
                            </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-slate-500">
                                <span>Target Akun</span>
                                <span className="font-medium text-slate-700">{auth?.user?.name ?? 'Untung Sudarto, S.Pd., M.Kom.'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-500">
                                <span> Verifikasi</span>
                                <span className="font-medium text-slate-700"> Admin SMK PGRI 11</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRequestReset}
                        className="w-full py-3 bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                        <span>Ajukan Reset Kata Sandi</span>
                    </button>
                </div>
            )}

            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 p-4 bg-white border border-slate-100 shadow-2xl rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-left">
                        <h5 className="font-bold text-slate-800 text-xs">Reset Kata Sandi Berhasil</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Kata sandi akun <span className="font-bold text-slate-700">{auth?.user?.name}</span> telah berhasil diperbarui!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}