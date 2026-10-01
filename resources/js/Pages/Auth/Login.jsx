import { useState, useEffect } from 'react';
import Checkbox from '../../components/Checkbox';
import InputError from '../../components/InputError';
import TextInput from '../../components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 relative font-sans md:justify-end md:pr-[100px]"
            style={{
                backgroundImage: "url('/images/sekola_pgri.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Head title="Login - Presensi SMK 11 PGRI" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>

            {/* Card Container */}
            <div className="relative z-10 w-full max-w-[420px] bg-white rounded-[24px] shadow-2xl p-8 text-[#1f2937]">
                
                {/* Logo & Header Section */}
                <div className="text-center mb-6">
                    <div className="w-[120px] h-[100px] mx-auto mb-3 flex items-center justify-center">
                        <img src="/images/logo.pgri.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-[18px] font-bold text-[#111827] m-0 mb-1">SMK PGRI 11 CILEDUG</h1>
                    <p className="text-[12px] text-[#4b5563] m-0 leading-tight font-medium">Sistem Presensi Digital</p>
                    <p className="text-[11px] text-[#6b7280] m-0 leading-tight">Berbasis RFID dan IoT</p>
                </div>

                {status && (
                    <div className="mb-4 text-xs font-medium text-green-600 text-center bg-green-50 p-2.5 rounded-lg border border-green-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Username / NIP</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <TextInput
                                id="email"
                                type="text"
                                name="email"
                                value={data.email}
                                className="w-full text-xs pl-9 rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 h-11"
                                placeholder="Masukkan NIP atau username"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="w-full text-xs pl-9 pr-10 rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 h-11"
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1 text-xs" />
                    </div>

                    <div className="flex justify-end pt-1">
                        <Link
                            href={route('password.request')}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline text-xs">
                            Lupa password?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center h-11"
                        >
                            Masuk
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6 text-[10px] text-gray-400 space-y-0.5">
                    <p className="font-semibold text-gray-500">© 2026 SMK PGRI 11 CILEDUG</p>
                </div>

            </div>
        </div>
    );
}