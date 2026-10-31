import React from 'react';
import { Head } from '@inertiajs/react';
import { PengaturanPageView } from '../components/PengaturanPageView';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function Pengaturan() {
    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan " />
            <PengaturanPageView />
        </AuthenticatedLayout>
    );
}