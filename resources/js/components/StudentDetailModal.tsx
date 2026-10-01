import React from 'react';
import { X, User, Phone, CheckCircle, Clock, AlertTriangle, CreditCard, School } from 'lucide-react';
import { AttendanceRecord, ALL_STUDENTS } from '../data/mockData';

interface StudentDetailModalProps {
  record: AttendanceRecord | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const matchedStudent = ALL_STUDENTS.find(
    (s) => s.nama.toLowerCase() === record.nama.toLowerCase() || s.nisn === record.nisn
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            {record.nama.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{record.nama}</h3>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  record.status === 'Hadir'
                    ? 'bg-emerald-100 text-emerald-700'
                    : record.status === 'Terlambat'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {record.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelas {record.kelas} • Jurusan {record.jurusan}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Waktu Tap RFID
            </span>
            <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
              {record.waktu} WIB
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> UID Kartu RFID
            </span>
            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              {record.rfidUid}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> NISN
            </span>
            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              {record.nisn}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> No. HP Wali Murid
            </span>
            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              {matchedStudent?.noHpOrangTua || '0812-3456-7890'}
            </p>
          </div>
        </div>

        {record.keterangan && (
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 mb-4">
            <span className="font-semibold text-slate-700">Catatan Sistem:</span> {record.keterangan}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
          <a
            href={`https://wa.me/?text=Pemberitahuan%20Presensi%20SMK%20PGRI%2011%20CILEDUG:%20Ananda%20${encodeURIComponent(
              record.nama
            )}%20(${record.kelas})%20tercatat%20${record.status}%20pukul%20${record.waktu}%20WIB.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Kirim Notif WA Wali
          </a>
        </div>
      </div>
    </div>
  );
};
