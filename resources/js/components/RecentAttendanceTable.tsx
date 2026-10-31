import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface AttendanceRecord {
  id: number | string;
  waktu?: string;
  waktu_masuk?: string;
  waktu_pulang?: string | null;
  nama?: string;
  kelas?: string;
  jurusan?: string;
  status?: string;
  siswa?: {
    nama_siswa?: string;
    kelas?: {
      nama_kelas?: string;
      jurusan?: string;
    };
  };
}

interface RecentAttendanceTableProps {
  records: AttendanceRecord[];
  onViewAllClick?: () => void;
  onSelectRecord?: (record: AttendanceRecord) => void;
}

export const RecentAttendanceTable: React.FC<RecentAttendanceTableProps> = ({
  records = [],
  onViewAllClick,
  onSelectRecord,
}) => {
  const displayRecords = records.slice(0, 5);

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="inline-block px-3.5 sm:px-5 py-1 sm:py-1.5 text-[11.5px] sm:text-[13px] font-medium rounded-full bg-[#dcfce7] text-[#16a34a] tracking-tight">
            Hadir
          </span>
        );
      case 'Terlambat':
        return (
          <span className="inline-block px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[11.5px] sm:text-[13px] font-medium rounded-full bg-[#fef3c7] text-[#d97706] tracking-tight">
            Terlambat
          </span>
        );
      case 'Izin':
        return (
          <span className="inline-block px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[11.5px] sm:text-[13px] font-medium rounded-full bg-[#e0f2fe] text-[#0284c7] tracking-tight">
            Izin
          </span>
        );
      case 'Sakit':
        return (
          <span className="inline-block px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[11.5px] sm:text-[13px] font-medium rounded-full bg-[#f3e8ff] text-[#9333ea] tracking-tight">
            Sakit
          </span>
        );
      case 'Tidak Hadir':
      default:
        return (
          <span className="inline-block px-3.5 sm:px-4.5 py-1 sm:py-1.5 text-[11.5px] sm:text-[13px] font-medium rounded-full bg-[#ffe4e6] text-[#e11d48] tracking-tight">
            Tidak Hadir
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-[24px] p-5 sm:p-8 shadow-xs border border-slate-100/90 flex flex-col justify-start">
      <div className="flex items-center justify-between pb-2 sm:pb-3">
        <div>
          <h2 className="text-[17px] sm:text-[22px] font-bold text-slate-800 leading-snug">
            Presensi Terbaru
          </h2>
        </div>

        {onViewAllClick && (
          <button
            type="button"
            onClick={onViewAllClick}
            className="text-[12.5px] sm:text-[14px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-0.5 sm:gap-1 cursor-pointer transition-colors group whitespace-nowrap ml-2"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto mt-2 sm:mt-4 pb-2 scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full">
          <thead>
            <tr className="border-b border-slate-100/80 text-[11px] sm:text-[12px] font-semibold text-slate-400 tracking-wider uppercase">
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-nowrap">MASUK</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-normal sm:whitespace-nowrap leading-tight">
                NAMA<br className="sm:hidden" /> SISWA
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-nowrap">KELAS</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-semibold whitespace-nowrap">JURUSAN</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-semibold text-right pr-4 sm:pr-6 whitespace-nowrap">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {displayRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
                  Belum ada presensi hari ini
                </td>
              </tr>
            ) : (
              displayRecords.map((record) => {
                const rawJam = record.waktu || record.waktu_masuk;
                const jamMasuk = rawJam ? (rawJam.includes('WIB') ? rawJam : `${rawJam} WIB`) : '-';

                const namaSiswa = record.siswa?.nama_siswa || record.nama || '-';
                const kelasSiswa = record.siswa?.kelas?.nama_kelas || record.kelas || '-';
                const jurusanSiswa = record.siswa?.kelas?.jurusan || record.jurusan || '-';

                return (
                  <tr
                    key={record.id}
                    onClick={() => onSelectRecord?.(record)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    title={`Detail presensi ${namaSiswa}`}
                  >
                    <td className="py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-[14px] text-slate-700 font-mono tracking-tight whitespace-nowrap font-semibold">
                      {jamMasuk}
                    </td>
                    
                    <td className="py-3.5 sm:py-5 px-3 sm:px-4 text-[13.5px] sm:text-[15px] font-bold text-slate-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                      {namaSiswa}
                    </td>

                    <td className="py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-[14.5px] text-slate-600 font-medium whitespace-nowrap">
                      {kelasSiswa}
                    </td>

                    <td className="py-3.5 sm:py-5 px-3 sm:px-4 text-[13px] sm:text-[14.5px] text-slate-600 font-medium whitespace-nowrap">
                      {jurusanSiswa}
                    </td>

                    <td className="py-3.5 sm:py-5 px-3 sm:px-4 text-right pr-4 sm:pr-6 whitespace-nowrap">
                      {renderStatusBadge(record.status)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};