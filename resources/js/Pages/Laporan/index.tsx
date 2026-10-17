import React from 'react';
import { Head } from '@inertiajs/react';
import LaporanPageView from '../../components/LaporanPageView';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

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
    presensis: PresensiItem[];
    summary: Summary;
    kelases: KelasItem[];
    jurusans: string[];
    filters: Filters;
}

export default function Index({ presensis, summary, kelases, jurusans, filters }: Props) {
    return (
        // @ts-ignore
        <AuthenticatedLayout>
            <Head title="Laporan Presensi - Presensi Digital - SMK PGRI 11 CILEDUG" />
            <div className="p-6">
                <LaporanPageView
                    presensis={presensis}
                    summary={summary}
                    kelases={kelases}
                    jurusans={jurusans}
                    filters={filters}
                />
            </div>
        </AuthenticatedLayout>
    );
}