import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  X,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'presensi' | 'jadwal' | 'hardware' | 'laporan';
  read: boolean;
  priority?: 'normal' | 'high';
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Presensi Siswa Pagi Berjalan',
    message: '524 siswa dari 580 total siswa telah berhasil melakukan tap kartu RFID di gerbang masuk.',
    time: '5 menit yang lalu',
    category: 'presensi',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-2',
    title: 'Batas Waktu Toleransi Keterlambatan',
    message: 'Batas toleransi kehadiran upacara Senin berakhir pukul 07:30 WIB. Scan setelah waktu ini dihitung terlambat.',
    time: '25 menit yang lalu',
    category: 'jadwal',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Mesin RFID Gerbang Terhubung',
    message: 'Sensor RFID modul #01 terhubung ke server cloud IoT dengan latensi stabil (18ms).',
    time: '1 jam yang lalu',
    category: 'hardware',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Rekap Kehadiran Mingguan Tersedia',
    message: 'Laporan absensi kelas XII TKJ 1 periode pekan lalu telah siap untuk diekspor ke Excel.',
    time: 'Kemarin, 15:40 WIB',
    category: 'laporan',
    read: true,
  },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPresensi?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onOpenPresensi,
}) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const displayedNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const getCategoryIcon = (category: SystemNotification['category']) => {
    switch (category) {
      case 'presensi':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'jadwal':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'hardware':
        return <Radio className="w-4 h-4 text-sky-600" />;
      case 'laporan':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBadgeClass = (category: SystemNotification['category']) => {
    switch (category) {
      case 'presensi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'jadwal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hardware':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'laporan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1d6ee5] flex items-center justify-center relative">
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Pemberitahuan Sistem
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#1e40af]">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                SMK PGRI 11 CILEDUG • Log Real-time IoT
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[#1d6ee5] hover:text-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-1">
          {displayedNotifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">Tidak ada notifikasi</p>
              <p className="text-xs text-slate-400 mt-1">
                Semua notifikasi penting telah ditinjau.
              </p>
            </div>
          ) : (
            displayedNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markItemAsRead(item.id)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer relative ${
                  !item.read
                    ? 'bg-blue-50/40 hover:bg-blue-50/80 border border-blue-100/80'
                    : 'bg-white hover:bg-slate-50/80 border border-transparent'
                }`}
              >
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#1d6ee5] absolute top-4 right-4" />
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[13px] font-bold text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="text-[11px] text-slate-400 font-medium mt-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {onOpenPresensi && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPresensi();
              }}
              className="px-4 py-2 bg-[#1d6ee5] hover:bg-[#1a5fca] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pantau Presensi Sekarang</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
