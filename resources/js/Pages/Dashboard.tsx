import { usePage, Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
  User,
  Clock,
  AlertTriangle,
  Globe,
  LogOut,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';

import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { StatCard } from '../components/StatCard';
import { RecentAttendanceTable } from '../components/RecentAttendanceTable';
import { StudentDetailModal } from '../components/StudentDetailModal';
import { MobileDashboardView } from '../components/MobileDashboardView';

const formatRecord = (item: any) => {
  const studentName = item.siswa?.nama_siswa || item.namaSiswa || item.nama || item.nama_siswa || '-';
  return {
    id: item.id,
    waktu: item.waktu,
    waktu_pulang: item.waktu_pulang,
    nama: studentName,
    namaSiswa: studentName,
    nama_siswa: studentName,
    kelas: item.siswa?.kelas?.nama_kelas || item.kelas || '-',
    jurusan: item.siswa?.kelas?.jurusan || item.jurusan || '-',
    status: item.status,
  };
};

export default function Dashboard() {
  const { auth, presensi = [], stats: backendStats } = usePage<any>().props;

  const totalAwal = backendStats?.total_siswa || 1;
  const hadirPercentNum = Math.round(((backendStats?.hadir || 0) / totalAwal) * 100);
  const terlambatPercentNum = Math.round(((backendStats?.terlambat || 0) / totalAwal) * 100);
  const tidakHadirPercentNum = Math.round(((backendStats?.tidak_hadir || 0) / totalAwal) * 100);

  const [records, setRecords] = useState<any[]>(() => presensi.map(formatRecord));
  const [stats, setStats] = useState({
    hadir: backendStats?.hadir || 0,
    terlambat: backendStats?.terlambat || 0,
    tidakHadir: backendStats?.tidak_hadir || 0,
    totalSiswa: backendStats?.total_siswa || 0,
    hadirPercent: hadirPercentNum,
    terlambatPercent: terlambatPercentNum,
    tidakHadirPercent: tidakHadirPercentNum,
    totalPercent: 100,
  });

  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime);
  const [currentDate, setCurrentDate] = useState<string>(getFormattedDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentDate(getFormattedDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);
  const [attendanceNotif, setAttendanceNotif] = useState<{ nama: string; waktu: string } | null>(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch('/api/dashboard-data');
        if (response.ok) {
          const data = await response.json();

          if (data.presensi && data.presensi.length > records.length) {
            const newest = data.presensi[0];
            if (newest) {
              const nameToShow = newest.siswa?.nama_siswa || newest.namaSiswa || newest.nama || 'Siswa';
              setAttendanceNotif({
                nama: nameToShow,
                waktu: newest.waktu,
              });
            }
          }

          const formattedRecords = data.presensi.map(formatRecord);
          setRecords(formattedRecords);

          const total = data.stats.total_siswa || 1;
          setStats({
            hadir: data.stats.hadir,
            terlambat: data.stats.terlambat,
            tidakHadir: data.stats.tidak_hadir,
            totalSiswa: data.stats.total_siswa,
            hadirPercent: Math.round((data.stats.hadir / total) * 100),
            terlambatPercent: Math.round((data.stats.terlambat / total) * 100),
            tidakHadirPercent: Math.round((data.stats.tidak_hadir / total) * 100),
            totalPercent: 100,
          });
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data presensi:", error);
      }
    };

    const interval = setInterval(fetchLatestData, 2500);
    return () => clearInterval(interval);
  }, [records.length]);

  useEffect(() => {
    if (attendanceNotif) {
      const timer = setTimeout(() => {
        setAttendanceNotif(null);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [attendanceNotif]);

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard - Presensi Digital - SMK PGRI 11 CILEDUG" />

      <div className="block md:hidden">
        <MobileDashboardView
          onSelectRecord={(rec) => setSelectedStudentDetail(rec)}
          currentTime={currentTime}
          currentDate={currentDate}
          onNavigate={(tab) => router.get(`/${tab}`)}
          onLogoutClick={() => router.post('/logout')}
        />
      </div>

      <div className="hidden md:block space-y-7">
        <div className="mb-7 text-left">
          <h1 className="text-2xl font-bold text-slate-800">
            Selamat Datang, {auth?.user?.name ?? 'Untung Sudarto'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          <div className="lg:col-span-8 flex flex-col">
            <RecentAttendanceTable
              records={records}
              onViewAllClick={() => router.get('/presensi')}
              onSelectRecord={(rec) => setSelectedStudentDetail(rec)}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <StatCard
              label="Hadir"
              count={stats.hadir}
              percentage={stats.hadirPercent}
              icon={User}
              bgColor="bg-[#dcfce7]"
              iconColor="text-[#16a34a]"
              percentageColor="text-[#16a34a]"
              onClick={() => router.get('/presensi')}
            />

            <StatCard
              label="Terlambat"
              count={stats.terlambat}
              percentage={stats.terlambatPercent}
              icon={Clock}
              bgColor="bg-[#fef3c7]"
              iconColor="text-[#d97706]"
              percentageColor="text-[#d97706]"
              onClick={() => router.get('/presensi')}
            />

            <StatCard
              label="Tidak Hadir"
              count={stats.tidakHadir}
              percentage={stats.tidakHadirPercent}
              icon={AlertTriangle}
              bgColor="bg-[#ffe4e6]"
              iconColor="text-[#e11d48]"
              percentageColor="text-[#e11d48]"
              onClick={() => router.get('/presensi')}
            />

            <StatCard
              label="Total Siswa"
              count={stats.totalSiswa}
              percentage={stats.totalPercent}
              icon={Globe}
              bgColor="bg-[#dbeafe]"
              iconColor="text-[#2563eb]"
              percentageColor="text-[#2563eb]"
            />
          </div>
        </div>
      </div>

      <StudentDetailModal
        record={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
      />

      {attendanceNotif && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-l-4 border-l-emerald-500 border border-slate-100 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h5 className="text-[13.5px] font-bold text-slate-900 leading-tight">
              Presensi Berhasil
            </h5>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Siswa atas nama <span className="font-bold text-slate-800">{attendanceNotif.nama}</span> berhasil dicatat pada pukul{' '}
              <span className="font-mono text-emerald-600 font-semibold">{attendanceNotif.waktu}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAttendanceNotif(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </AuthenticatedLayout>
  );
}