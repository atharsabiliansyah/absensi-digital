import React from 'react';
import { Head } from '@inertiajs/react';
import { PresensiPageView } from '../components/PresensiPageView';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function Presensi() {
    return (
        <AuthenticatedLayout>
            <Head title="Presensi " />
            <PresensiPageView />
        </AuthenticatedLayout>
    );
}