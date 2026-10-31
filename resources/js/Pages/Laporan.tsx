import React from 'react';
import { Head } from '@inertiajs/react';
import LaporanPageView from '../components/LaporanPageView';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

interface Siswa {
    id: number;
    nisn: string;
    nama_siswa: string;
    kelas?: {
        id: number;
        nama_kelas: string;
        jurusan?: string;
        tipe_kelas?: number | string;
    };
}

interface PresensiItem {
    id: number;
    tanggal: string;
    waktu: string | null;
    status: string;
    siswa?: Siswa;
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
    tipe_kelas?: string;
    status?: string;
}

interface Props {
    presensis: PresensiItem[];
    summary: Summary;
    kelases: string[];
    jurusans: string[];
    tipeKelases?: (string | number)[];
    filters: Filters;
}

export default function Index({
    presensis,
    summary,
    kelases,
    jurusans,
    tipeKelases = [],
    filters,
}: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Laporan" />

            <div className="p-6">
                <LaporanPageView
                    presensis={presensis}
                    summary={summary}
                    kelases={kelases}
                    jurusans={jurusans}
                    tipeKelases={tipeKelases}
                    filters={filters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
