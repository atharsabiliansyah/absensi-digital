import React from 'react';
import { Head } from '@inertiajs/react'; // 1. Import Head
import { DataSiswaPageView } from '../components/DataSiswaPageView';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function DataSiswa() {
    return (
        <AuthenticatedLayout>
            <Head title="Data Siswa - Presensi Digital - SMK PGRI 11 CILEDUG" />
            <DataSiswaPageView />
        </AuthenticatedLayout>
    );
}