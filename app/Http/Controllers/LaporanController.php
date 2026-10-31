<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class LaporanController extends Controller
{
    /**
     * Query kelas yang boleh diakses pengguna.
     */
    private function queryKelasUntuk(User $user)
    {
        $query = Kelas::query();

        if ($user->role !== 'super_admin') {
            $query->whereIn(
                'id',
                $user->kelasDiampu()->select('kelas.id')
            );
        }

        return $query;
    }

    /**
     * Query presensi yang boleh diakses pengguna.
     */
    private function queryPresensiUntuk(User $user)
    {
        $query = Presensi::with(['siswa.kelas'])
            ->whereHas('siswa');

        if ($user->role !== 'super_admin') {
            $query->whereHas('siswa', function ($q) use ($user) {
                $q->whereIn(
                    'kelas_id',
                    $user->kelasDiampu()->select('kelas.id')
                );
            });
        }

        return $query;
    }

    /**
     * Terapkan filter jurusan, tipe kelas, dan kelas.
     * Filter kelas menerima ID kelas atau nama_kelas.
     */
    private function terapkanFilter(
        $query,
        Request $request,
        bool $gunakanIdKelas = false
    ) {
        $jurusan = trim((string) $request->input('jurusan', 'Semua'));
        $kelas = trim((string) $request->input('kelas_id', 'Semua'));
        $tipeKelas = trim((string) $request->input('tipe_kelas', 'Semua'));

        if (
            $jurusan !== '' &&
            !str_contains(strtolower($jurusan), 'semua')
        ) {
            $query->whereHas('siswa.kelas', function ($q) use ($jurusan) {
                $q->where('jurusan', $jurusan);
            });
        }

        if (
            $tipeKelas !== '' &&
            !str_contains(strtolower($tipeKelas), 'semua')
        ) {
            $query->whereHas('siswa.kelas', function ($q) use ($tipeKelas) {
                $q->where('tipe_kelas', $tipeKelas);
            });
        }

        if (
            $kelas !== '' &&
            !str_contains(strtolower($kelas), 'semua')
        ) {
            $query->whereHas('siswa.kelas', function ($q) use (
                $kelas,
                $gunakanIdKelas
            ) {
                if ($gunakanIdKelas && ctype_digit($kelas)) {
                    $q->where('id', (int) $kelas);
                } else {
                    $q->where('nama_kelas', $kelas);
                }
            });
        }

        return $query;
    }

    /**
     * Halaman laporan bulanan.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $bulan = $request->filled('bulan')
            ? (int) $request->input('bulan')
            : (int) Carbon::now('Asia/Jakarta')->format('m');

        $tahun = $request->filled('tahun')
            ? (int) $request->input('tahun')
            : (int) Carbon::now('Asia/Jakarta')->format('Y');

        abort_if($bulan < 1 || $bulan > 12, 422, 'Bulan tidak valid.');
        abort_if($tahun < 2000 || $tahun > 2100, 422, 'Tahun tidak valid.');

        $jurusan = trim((string) $request->input('jurusan', 'Semua'));
        $kelasId = trim((string) $request->input('kelas_id', 'Semua'));
        $tipeKelas = trim((string) $request->input('tipe_kelas', 'Semua'));
        $status = trim((string) $request->input('status', 'Semua'));

        $query = $this->queryPresensiUntuk($user)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        $this->terapkanFilter($query, $request, true);

        // Ringkasan mengikuti filter tanggal, jurusan, tipe kelas, dan kelas,
        // tetapi tidak berubah karena filter status tabel.
        $summary = [
            'hadir' => (clone $query)->where('status', 'Hadir')->count(),
            'terlambat' => (clone $query)->where('status', 'Terlambat')->count(),
            'izin' => (clone $query)->where('status', 'Izin')->count(),
            'sakit' => (clone $query)->where('status', 'Sakit')->count(),
            'tidak_hadir' => (clone $query)
                ->whereIn('status', ['Alpa', 'Alpha', 'Tidak Hadir'])
                ->count(),
        ];

        // Filter status hanya untuk daftar detail.
        if (
            $status !== '' &&
            !str_contains(strtolower($status), 'semua')
        ) {
            if (in_array(strtolower($status), ['tidak hadir', 'alpa', 'alpha'])) {
                $query->whereIn('status', ['Tidak Hadir', 'Alpa', 'Alpha']);
            } else {
                $query->where('status', $status);
            }
        }

        $presensis = $query
            ->orderByDesc('tanggal')
            ->orderByDesc('waktu')
            ->get();

        // Pilihan kelas mengikuti hak akses dan filter jurusan/tipe kelas.
        $kelasQuery = $this->queryKelasUntuk($user)
            ->whereNotNull('nama_kelas');

        if ($jurusan !== '' && !str_contains(strtolower($jurusan), 'semua')) {
            $kelasQuery->where('jurusan', $jurusan);
        }

        if ($tipeKelas !== '' && !str_contains(strtolower($tipeKelas), 'semua')) {
            $kelasQuery->where('tipe_kelas', $tipeKelas);
        }

        $kelases = (clone $kelasQuery)
            ->pluck('nama_kelas')
            ->unique()
            ->values()
            ->all();

        // Pilihan jurusan mengikuti hak akses pengguna.
        $jurusans = $this->queryKelasUntuk($user)
            ->whereNotNull('jurusan')
            ->pluck('jurusan')
            ->unique()
            ->values()
            ->all();

        // Daftar tipe kelas mengikuti hak akses pengguna.
        $tipeKelases = $this->queryKelasUntuk($user)
            ->whereNotNull('tipe_kelas')
            ->pluck('tipe_kelas')
            ->map(fn ($tipe) => (string) $tipe)
            ->unique()
            ->sort()
            ->values()
            ->all();

        return Inertia::render('Laporan', [
            'auth' => [
                'user' => [
                    'id'       => $user->id,
                    'name'     => $user->name,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'nip'      => $user->nip ?? '-',
                    'role'     => $user->role ?? 'User',
                ],
            ],
            'presensis'  => $presensis,
            'presensi'   => $presensis,
            'summary'    => $summary,
            'kelases'    => $kelases,
            'jurusans'   => $jurusans,
            'tipeKelases' => $tipeKelases,
            'filters'    => [
                'bulan'      => (string) $bulan,
                'tahun'      => (string) $tahun,
                'jurusan'    => $jurusan,
                'kelas_id'   => $kelasId,
                'tipe_kelas' => $tipeKelas,
                'status'     => $status,
            ],
        ]);
    }

    /**
     * Ekspor rekap presensi ke CSV.
     */

public function export(Request $request)
{
    $user = $request->user();
    abort_unless($user, 401);

    $bulan = $request->filled('bulan')
        ? (int) $request->input('bulan')
        : (int) Carbon::now('Asia/Jakarta')->format('m');

    $tahun = $request->filled('tahun')
        ? (int) $request->input('tahun')
        : (int) Carbon::now('Asia/Jakarta')->format('Y');

    abort_if($bulan < 1 || $bulan > 12, 422, 'Bulan tidak valid.');
    abort_if($tahun < 2000 || $tahun > 2100, 422, 'Tahun tidak valid.');

    $query = $this->queryPresensiUntuk($user)
        ->whereMonth('tanggal', $bulan)
        ->whereYear('tanggal', $tahun);

    // Gunakan filter yang sama dengan halaman laporan.
    $this->terapkanFilter($query, $request, true);

    $status = trim((string) $request->input('status', 'Semua'));

    if ($status !== '' && !str_contains(strtolower($status), 'semua')) {
        if (in_array(strtolower($status), ['tidak hadir', 'alpa', 'alpha'])) {
            $query->whereIn('status', ['Tidak Hadir', 'Alpa', 'Alpha']);
        } else {
            $query->where('status', $status);
        }
    }

    $presensis = $query
        ->orderBy('tanggal')
        ->orderBy('waktu')
        ->get();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Rekap Absensi');

    // Judul utama seperti pada contoh gambar.
    $sheet->mergeCells('A2:I3');
    $sheet->setCellValue('A2', 'REKAP ABSENSI');

    $sheet->getStyle('A2:I3')->applyFromArray([
        'font' => [
            'bold' => true,
            'size' => 12,
            'color' => ['rgb' => '000000'],
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['rgb' => '808080'],
        ],
        'alignment' => [
            'horizontal' => Alignment::HORIZONTAL_CENTER,
            'vertical' => Alignment::VERTICAL_CENTER,
        ],
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['rgb' => '000000'],
            ],
        ],
    ]);

    $headers = [
        'NO',
        'TANGGAL',
        'NIS',
        'NAMA',
        'KELAS',
        'JURUSAN',
        'TIPE KELAS',
        'STATUS',
        'WAKTU',
    ];

    // Header tabel pada baris ke-4.
    foreach ($headers as $index => $header) {
        $column = chr(65 + $index);
        $sheet->setCellValue($column . '4', $header);
    }

    $sheet->getStyle('A4:I4')->applyFromArray([
        'font' => ['bold' => false, 'size' => 10],
        'alignment' => [
            'horizontal' => Alignment::HORIZONTAL_CENTER,
            'vertical' => Alignment::VERTICAL_CENTER,
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['rgb' => 'FFFFFF'],
        ],
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['rgb' => '000000'],
            ],
        ],
    ]);

    $row = 5;

    foreach ($presensis as $index => $presensi) {
        $siswa = $presensi->siswa;
        $kelas = $siswa?->kelas;

        $sheet->fromArray([
            $index + 1,
            $presensi->tanggal
                ? Carbon::parse($presensi->tanggal)->format('d/m/Y')
                : '-',
            $siswa?->nisn ?? '-',
            $siswa?->nama_siswa ?? '-',
            $kelas?->nama_kelas ?? '-',
            $kelas?->jurusan ?? '-',
            $kelas?->tipe_kelas ?? '-',
            $presensi->status ?? '-',
            $presensi->waktu ?? '-',
        ], null, 'A' . $row);

        $row++;
    }

    $lastRow = max(4, $row - 1);

    // Garis hitam pada seluruh tabel, termasuk baris data.
    $sheet->getStyle("A4:I{$lastRow}")->applyFromArray([
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['rgb' => '000000'],
            ],
        ],
        'alignment' => [
            'vertical' => Alignment::VERTICAL_CENTER,
        ],
    ]);

    // Ratakan kolom nomor, tanggal, tipe kelas, status, dan waktu.
    foreach (['A', 'B', 'G', 'H', 'I'] as $column) {
        $sheet->getStyle("{$column}5:{$column}{$lastRow}")
            ->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
    }

    // Lebar kolom disesuaikan agar rapi saat dibuka di Excel.
    $widths = [
        'A' => 7,
        'B' => 15,
        'C' => 16,
        'D' => 25,
        'E' => 15,
        'F' => 18,
        'G' => 15,
        'H' => 16,
        'I' => 14,
    ];

    foreach ($widths as $column => $width) {
        $sheet->getColumnDimension($column)->setWidth($width);
    }

    $sheet->getRowDimension(2)->setRowHeight(16);
    $sheet->getRowDimension(3)->setRowHeight(16);
    $sheet->getRowDimension(4)->setRowHeight(22);

    for ($r = 5; $r <= $lastRow; $r++) {
        $sheet->getRowDimension($r)->setRowHeight(20);
    }

    // Pengaturan saat file dibuka atau dicetak.
    $sheet->freezePane('A5');
    $sheet->getPageSetup()
        ->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
    $sheet->getPageSetup()
        ->setFitToWidth(1);
    $sheet->getPageSetup()
        ->setFitToHeight(0);
    $sheet->getPageSetup()->setFitToPage(true);
    $sheet->getPageMargins()->setTop(0.4);
    $sheet->getPageMargins()->setBottom(0.4);
    $sheet->getPageMargins()->setLeft(0.3);
    $sheet->getPageMargins()->setRight(0.3);

    $filename = sprintf(
        'Rekap_Presensi_%02d_%d.xlsx',
        $bulan,
        $tahun
    );

    return response()->streamDownload(function () use ($spreadsheet) {
        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
    }, $filename, [
        'Content-Type' =>
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]);
}

}
