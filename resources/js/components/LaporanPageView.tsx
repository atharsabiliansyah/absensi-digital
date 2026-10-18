import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Siswa {
    id: number;
    nisn: string;
    nama_siswa: string;
    kelas?: {
        id: number;
        nama_kelas: string;
        jurusan?: string;
    };
}

interface PresensiItem {
    id: number;
    tanggal: string;
    waktu: string | null;
    waktu_pulang: string | null;
    status: string;
    siswa?: Siswa;
}

interface KelasItem {
    id: number;
    nama_kelas: string;
    jurusan?: string;
}

interface Summary {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    tidak_hadir: number;
}

interface Filters {
    bulan?: string;
    tahun?: string;
    jurusan?: string;
    kelas_id?: string;
    status?: string;
}

interface Props {
    presensis?: PresensiItem[];
    summary?: Summary;
    kelases?: KelasItem[];
    jurusans?: string[];
    filters?: Filters;
}

export const LaporanPageView: React.FC<Props> = ({
    presensis = [],
    summary = { hadir: 0, terlambat: 0, izin: 0, sakit: 0, tidak_hadir: 0 },
    kelases = [],
    jurusans = [],
    filters = {}
}) => {
    const [bulan, setBulan] = useState(filters.bulan || '10');
    const [tahun, setTahun] = useState(filters.tahun || '2026');
    const [jurusan, setJurusan] = useState(filters.jurusan || 'Semua');
    const [kelasId, setKelasId] = useState(filters.kelas_id || 'Semua');
    const [status, setStatus] = useState(filters.status || 'Semua');

    // Sinkronkan state dropdown dengan data filter dari server
    useEffect(() => {
        if (filters.bulan) setBulan(filters.bulan);
        if (filters.tahun) setTahun(filters.tahun);
        if (filters.jurusan) setJurusan(filters.jurusan);
        if (filters.kelas_id) setKelasId(filters.kelas_id);
        if (filters.status) setStatus(filters.status);
    }, [filters]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/laporan', {
            bulan,
            tahun,
            jurusan,
            kelas_id: kelasId,
            status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Fungsi Download Langsung / Export ke Excel
    const handleExportExcel = () => {
        const params = new URLSearchParams({
            bulan,
            tahun,
            jurusan,
            kelas_id: kelasId,
            status,
        }).toString();

        window.location.href = `/laporan/export?${params}`;
    };

    return (
        <div className="space-y-6">
            {/* Box Header Filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3">
                    {/* Periode */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Periode</label>
                        <div className="flex gap-2">
                            <select
                                value={bulan}
                                onChange={(e) => setBulan(e.target.value)}
                                className="w-36 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="01">Januari</option>
                                <option value="02">Februari</option>
                                <option value="03">Maret</option>
                                <option value="04">April</option>
                                <option value="05">Mei</option>
                                <option value="06">Juni</option>
                                <option value="07">Juli</option>
                                <option value="08">Agustus</option>
                                <option value="09">September</option>
                                <option value="10">Oktober</option>
                                <option value="11">November</option>
                                <option value="12">Desember</option>
                            </select>

                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                className="w-28 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
                        </div>
                    </div>

                    {/* Jurusan */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-bold text-slate-700">Jurusan</label>
                        <select
                            value={jurusan}
                            onChange={(e) => setJurusan(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Semua">Semua Jurusan</option>
                            {jurusans.map((j, idx) => (
                                <option key={idx} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kelas */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-bold text-slate-700">Kelas</label>
                        <select
                            value={kelasId}
                            onChange={(e) => setKelasId(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Semua">Semua Kelas</option>
                            {kelases.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-bold text-slate-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Hadir">Hadir</option>
                            <option value="Terlambat">Terlambat</option>
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                            <option value="Alpha">Tidak Hadir</option>
                        </select>
                    </div>

                    {/* Tombol Tampilkan */}
                    <div>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
                        >
                            Tampilkan
                        </button>
                    </div>
                </form>
            </div>

            {/* Cards Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Hadir</p>
                        <p className="text-xl font-extrabold text-slate-800">{summary.hadir}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">🕒</div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Terlambat</p>
                        <p className="text-xl font-extrabold text-slate-800">{summary.terlambat}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">📄</div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Izin</p>
                        <p className="text-xl font-extrabold text-slate-800">{summary.izin}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">👤</div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Sakit</p>
                        <p className="text-xl font-extrabold text-slate-800">{summary.sakit}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">✕</div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Tidak Hadir</p>
                        <p className="text-xl font-extrabold text-slate-800">{summary.tidak_hadir}</p>
                    </div>
                </div>
            </div>

            {/* Tabel Data Presensi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="p-4">NO</th>
                            <th className="p-4">TANGGAL</th>
                            <th className="p-4">NIS</th>
                            <th className="p-4">NAMA SISWA</th>
                            <th className="p-4">KELAS</th>
                            <th className="p-4">JURUSAN</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4">WAKTU</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                        {presensis.length > 0 ? (
                            presensis.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                    <td className="p-4 text-slate-400">{idx + 1}</td>
                                    <td className="p-4 font-medium">{item.tanggal}</td>
                                    <td className="p-4 text-slate-500">{item.siswa?.nisn ?? '-'}</td>
                                    <td className="p-4 font-semibold text-slate-900">{item.siswa?.nama_siswa ?? 'Siswa Tidak Ditemukan'}</td>
                                    <td className="p-4">{item.siswa?.kelas?.nama_kelas ?? '-'}</td>
                                    <td className="p-4">{item.siswa?.kelas?.jurusan ?? '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            item.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600' :
                                            item.status === 'Terlambat' ? 'bg-amber-50 text-amber-600' :
                                            item.status === 'Sakit' ? 'bg-purple-50 text-purple-600' :
                                            'bg-rose-50 text-rose-600'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{item.waktu ?? '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                                    Tidak ada data presensi pada periode ini
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tombol Export ke Excel */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={handleExportExcel}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm10.5-8l-2.1 3.5 2.1 3.5h-1.8l-1.2-2.2-1.2 2.2h-1.8l2.1-3.5-2.1-3.5h1.8l1.2 2.2 1.2-2.2h1.8z"/>
                    </svg>
                    Export Excel
                </button>
            </div>
        </div>
    );
};

export default LaporanPageView;