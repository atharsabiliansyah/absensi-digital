import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function ResetPassword() {
    const { props } = usePage();
    const userId = props.resetUserId || props.flash?.resetUserId;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        user_id: userId || '',
        password: '',
        password_confirmation: '',
    });

    const isMinLength = data.password.length >= 8;
    const isMatched = data.password.length > 0 && data.password === data.password_confirmation;

    const submit = (e) => {
        e.preventDefault();
        post('/password-reset/save-public');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center lg:justify-end relative bg-gray-100 overflow-hidden">
            <Head title="Reset Password" />

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
                        Buat Kata Sandi Baru
                    </p>
                    
                    <form onSubmit={submit} className="text-left space-y-4">
                        <input type="hidden" name="user_id" value={data.user_id} />

                        {/* Input Password Baru */}
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1.5">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full pl-4 pr-11 py-3 bg-[#eef4ff] border-2 border-[#5c7cfa] rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                                    placeholder="Masukkan kata sandi baru"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Input Konfirmasi Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1.5">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full pl-4 pr-11 py-3 bg-[#eef4ff] border-2 border-[#5c7cfa] rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                                    placeholder="Ulangi kata sandi baru"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Kotak Ketentuan Password */}
                        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 mt-3">
                            <p className="text-[11px] font-bold text-gray-800">Ketentuan Kata Sandi:</p>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className={isMinLength ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                     Minimal 8 karakter
                                </span>
                                <span className={isMatched ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                     Konfirmasi cocok
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing || !isMinLength || !isMatched}
                                className="w-full py-3.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition duration-200 disabled:opacity-50 cursor-pointer"

                            >
                                {processing ? 'Menyimpan...' : 'Simpan Password'}
                            </button>
                        </div>
                    </form>

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