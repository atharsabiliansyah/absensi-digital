import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function ForgotPassword() {
    const { props } = usePage<any>();

    const [formState, setFormState] = useState<{
        status: string | null;
        resetStatus: string | null;
        userId: number | null;
    }>({
        status: props.status || props.flash?.status || null,
        resetStatus: props.resetStatus || props.flash?.resetStatus || null,
        userId: props.resetUserId || props.flash?.resetUserId || null,
    });

    useEffect(() => {
        if (props.resetStatus || props.flash?.resetStatus) {
            setFormState({
                status: props.status || props.flash?.status || null,
                resetStatus: props.resetStatus || props.flash?.resetStatus || null,
                userId: props.resetUserId || props.flash?.resetUserId || null,
            });
        }
    }, [props]);

    const requestForm = useForm({
        email: '',
    });

    const resetForm = useForm({
        user_id: '',
        password: '',
        password_confirmation: '',
    });

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestForm.post('/password-reset/request-public', {
            onSuccess: (page) => {
                const flash = page.props.flash as any || page.props as any;
                setFormState({
                    status: flash.status || 'Permintaan terkirim ke Admin!',
                    resetStatus: flash.resetStatus || 'pending',
                    userId: flash.resetUserId || null,
                });
            },
        });
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetForm.setData('user_id', String(formState.userId));

        resetForm.post('/password-reset/save-public', {
            onSuccess: (page) => {
                const flash = page.props.flash as any || page.props as any;
                setFormState({
                    status: flash.status || 'Password baru berhasil disimpan! Silakan login.',
                    resetStatus: 'completed',
                    userId: null,
                });
            },
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center lg:justify-end relative bg-gray-100 overflow-hidden">
            <Head title="Lupa Password" />

            <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/sekola_pgri.png')" }}
            >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
            </div>

            <div className="relative z-10 w-full min-h-screen flex items-center justify-center lg:justify-end p-4 md:p-12 lg:pr-24">
                <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-8 md:p-10 text-center">
                    
                    <div className="flex justify-center mb-2">
                        <img 
                            src="/images/logo.pgri.png" 
                            alt="Logo SMK PGRI 11 Ciledug" 
                            className="h-20 w-auto object-contain"
                        />
                    </div>

                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        SMK PGRI 11 CILEDUG
                    </h1>
                    <p className="text-xs font-semibold text-gray-600 mt-1">
                        Sistem Presensi Digital
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 mb-5">
                        Berbasis RFID dan IoT
                    </p>

                    {/* Banner Status Notifikasi */}
                    {formState.status && (
                        <div className={`mb-4 text-xs font-medium p-3.5 rounded-2xl border text-left leading-relaxed ${
                            formState.resetStatus === 'approved' 
                                ? 'text-blue-700 bg-blue-50 border-blue-200'
                                : 'text-green-700 bg-green-50 border-green-200'
                        }`}>
                            {formState.status}
                        </div>
                    )}

                    {formState.resetStatus === 'approved' ? (
                        <form onSubmit={handleResetSubmit} className="text-left space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={resetForm.data.password}
                                    className="w-full px-4 py-3 bg-[#eef4ff] border-2 border-[#5c7cfa] rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                                    placeholder="Masukkan password baru (min. 8 karakter)"
                                    onChange={(e) => resetForm.setData('password', e.target.value)}
                                    required
                                />
                                {resetForm.errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{resetForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={resetForm.data.password_confirmation}
                                    className="w-full px-4 py-3 bg-[#eef4ff] border-2 border-[#5c7cfa] rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                                    placeholder="Ulangi password baru Anda"
                                    onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={resetForm.processing}
                                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-xs shadow-md transition duration-200 disabled:opacity-50 cursor-pointer"
                                >
                                    {resetForm.processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* KONDISI 2: FORM PENGAJUAN BIASA */
                        <form onSubmit={handleRequestSubmit} className="text-left space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="text"
                                        value={requestForm.data.email}
                                        className="w-full pl-10 pr-4 py-3 bg-[#eef4ff] border-2 border-[#5c7cfa] rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                                        placeholder="Masukkan username"
                                        onChange={(e) => requestForm.setData('email', e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                                {requestForm.errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5 pl-1">{requestForm.errors.email}</p>
                                )}
                            </div>

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    disabled={requestForm.processing}
                                    className="w-full py-3.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition duration-200 disabled:opacity-50 cursor-pointer"
                                >
                                    {requestForm.processing ? 'Memeriksa...' : 'Ajukan Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center pt-4">
                        <Link
                            href="/login"
                            className="text-xs font-semibold text-[#2563eb] hover:underline"
                        >
                            Kembali ke Login
                        </Link>
                    </div>

                    <div className="mt-8 text-[10px] font-medium text-gray-400">
                        <p className="font-semibold text-gray-500">© 2026 SMK PGRI 11 CILEDUG</p>
                    </div>
                </div>
            </div>
        </div>
    );
}