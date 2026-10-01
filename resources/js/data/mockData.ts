export interface AttendanceRecord {
  id: string;
  waktu: string;
  nama: string;
  kelas: string;
  jurusan: string;
  status: 'Hadir' | 'Terlambat' | 'Tidak Hadir' | 'Izin' | 'Sakit';
  nisn: string;
  rfidUid: string;
  foto?: string;
  keterangan?: string;
  tanggal?: string;
}

export interface Student {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
  jenisKelamin: 'L' | 'P';
  rfidUid: string;
  statusHariIni: 'Hadir' | 'Terlambat' | 'Tidak Hadir' | 'Izin' | 'Sakit';
  noHpOrangTua: string;
  foto: string;
}

export const INITIAL_RECENT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    waktu: '07:34:12',
    nama: 'Isa',
    kelas: 'XI TKJ',
    jurusan: 'TKJ',
    status: 'Hadir',
    nisn: '0075849301',
    rfidUid: 'E2:00:41:2B',
    tanggal: '2026-09-25',
    keterangan: 'Tap RFID Gerbang Utama - Masuk Tepat Waktu',
  },
  {
    id: 'att-2',
    waktu: '07:32:45',
    nama: 'Bador',
    kelas: 'X AKL',
    jurusan: 'AKL',
    status: 'Terlambat',
    nisn: '0081294821',
    rfidUid: '4A:7C:19:F3',
    tanggal: '2026-09-25',
    keterangan: 'Terlambat 17 menit (Batas toleransi: 07:15 WIB)',
  },
  {
    id: 'att-3',
    waktu: '07:28:01',
    nama: 'Citra',
    kelas: 'XI OTPK',
    jurusan: 'OTPK',
    status: 'Hadir',
    nisn: '0073950182',
    rfidUid: '9B:5E:82:11',
    tanggal: '2026-09-25',
    keterangan: 'Tap RFID Gerbang Utama - Masuk Tepat Waktu',
  },
  {
    id: 'att-4',
    waktu: '07:21:17',
    nama: 'Dimas',
    kelas: 'X BDP',
    jurusan: 'BDP',
    status: 'Hadir',
    nisn: '0089201948',
    rfidUid: '3F:22:90:8C',
    tanggal: '2026-09-25',
    keterangan: 'Tap RFID Gerbang Utama - Masuk Tepat Waktu',
  },
  {
    id: 'att-5',
    waktu: '07:18:33',
    nama: 'Andi',
    kelas: 'XI TKJ',
    jurusan: 'TKJ',
    status: 'Terlambat',
    nisn: '0071982741',
    rfidUid: '8D:14:6B:04',
    tanggal: '2026-09-25',
    keterangan: 'Terlambat 3 menit (Batas toleransi: 07:15 WIB)',
  },
];

export const ALL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0075849301',
    nama: 'Isa',
    kelas: 'XI TKJ',
    jurusan: 'TKJ',
    jenisKelamin: 'L',
    rfidUid: 'E2:00:41:2B',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0812-8899-2311',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-2',
    nisn: '0081294821',
    nama: 'Bador',
    kelas: 'X AKL',
    jurusan: 'AKL',
    jenisKelamin: 'L',
    rfidUid: '4A:7C:19:F3',
    statusHariIni: 'Terlambat',
    noHpOrangTua: '0857-1234-9988',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-3',
    nisn: '0073950182',
    nama: 'Citra',
    kelas: 'XI OTPK',
    jurusan: 'OTPK',
    jenisKelamin: 'P',
    rfidUid: '9B:5E:82:11',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0813-4455-6677',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-4',
    nisn: '0089201948',
    nama: 'Dimas',
    kelas: 'X BDP',
    jurusan: 'BDP',
    jenisKelamin: 'L',
    rfidUid: '3F:22:90:8C',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0878-9900-1122',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-5',
    nisn: '0071982741',
    nama: 'Andi',
    kelas: 'XI TKJ',
    jurusan: 'TKJ',
    jenisKelamin: 'L',
    rfidUid: '8D:14:6B:04',
    statusHariIni: 'Terlambat',
    noHpOrangTua: '0821-3322-1144',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-6',
    nisn: '0074491023',
    nama: 'Farhan Maulana',
    kelas: 'XI TKJ',
    jurusan: 'TKJ',
    jenisKelamin: 'L',
    rfidUid: 'A1:C9:83:5F',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0813-9090-8811',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-7',
    nisn: '0083319024',
    nama: 'Nabila Putri',
    kelas: 'X AKL',
    jurusan: 'AKL',
    jenisKelamin: 'P',
    rfidUid: '7C:12:F4:99',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0812-7788-3344',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-8',
    nisn: '0076628190',
    nama: 'Rian Pratama',
    kelas: 'XI OTPK',
    jurusan: 'OTPK',
    jenisKelamin: 'L',
    rfidUid: '5D:3A:08:7E',
    statusHariIni: 'Tidak Hadir',
    noHpOrangTua: '0856-4321-7788',
    foto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-9',
    nisn: '0085542199',
    nama: 'Siti Rahma',
    kelas: 'X BDP',
    jurusan: 'BDP',
    jenisKelamin: 'P',
    rfidUid: 'B8:41:2E:30',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0877-2233-4455',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-10',
    nisn: '0079982310',
    nama: 'Zaky Alamsyah',
    kelas: 'XII TKJ',
    jurusan: 'TKJ',
    jenisKelamin: 'L',
    rfidUid: '1F:88:9C:62',
    statusHariIni: 'Tidak Hadir',
    noHpOrangTua: '0812-3344-5566',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-11',
    nisn: '0078819203',
    nama: 'Aulia Zahra',
    kelas: 'XI OTPK',
    jurusan: 'OTPK',
    jenisKelamin: 'P',
    rfidUid: '6D:77:E1:44',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0819-0011-2233',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-12',
    nisn: '0086654312',
    nama: 'Bayu Nugroho',
    kelas: 'X AKL',
    jurusan: 'AKL',
    jenisKelamin: 'L',
    rfidUid: '2B:99:A5:17',
    statusHariIni: 'Hadir',
    noHpOrangTua: '0822-1133-5577',
    foto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  },
];

export const JURUSAN_LIST = [
  { kode: 'TKJ', nama: 'Teknik Komputer dan Jaringan', totalSiswa: 48 },
  { kode: 'AKL', nama: 'Akuntansi dan Keuangan Lembaga', totalSiswa: 38 },
  { kode: 'OTPK', nama: 'Otomatisasi & Tata Kelola Perkantoran', totalSiswa: 34 },
  { kode: 'BDP', nama: 'Bisnis Daring dan Pemasaran', totalSiswa: 28 },
];

export const INITIAL_STATS = {
  hadir: 128,
  hadirPercent: 72,
  terlambat: 12,
  terlambatPercent: 7,
  tidakHadir: 8,
  tidakHadirPercent: 4,
  totalSiswa: 148,
  totalPercent: 100,
};

// Play pleasant RFID beep chime using Web Audio API
export const playRfidBeep = (isSuccess: boolean = true) => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (isSuccess) {
      // Pleasant high double beep (RFID card recognized)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1760, ctx.currentTime); // A6
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.08);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2637, ctx.currentTime + 0.1); // E7
      gain2.gain.setValueAtTime(0.14, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.22);
    } else {
      // Amber/warning lower tone for late
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Ignore audio context autoplay restriction if any
  }
};
