<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $bulan = $request->filled('bulan') ? (int)$request->input('bulan') : (int)date('m');
        $tahun = $request->filled('tahun') ? (int)$request->input('tahun') : (int)date('Y');

        $jurusan = trim((string) $request->input('jurusan', 'Semua'));
        $kelasId = trim((string) $request->input('kelas_id', 'Semua'));
        $status  = trim((string) $request->input('status', 'Semua'));

        $query = Presensi::with(['siswa.kelas'])
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($request->filled('jurusan') && !str_contains(strtolower($jurusan), 'semua')) {
            $query->whereHas('siswa.kelas', function ($q) use ($jurusan) {
                $q->where('jurusan', $jurusan);
            });
        }

        if ($request->filled('kelas_id') && !str_contains(strtolower($kelasId), 'semua')) {
            $query->whereHas('siswa', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        $summaryQuery = clone $query;
        $summary = [
            'hadir'       => (clone $summaryQuery)->where('status', 'Hadir')->count(),
            'terlambat'   => (clone $summaryQuery)->where('status', 'Terlambat')->count(),
            'izin'        => (clone $summaryQuery)->where('status', 'Izin')->count(),
            'sakit'       => (clone $summaryQuery)->where('status', 'Sakit')->count(),
            'tidak_hadir' => (clone $summaryQuery)->whereIn('status', ['Alpa', 'Alpha', 'Tidak Hadir'])->count(),
        ];

        if ($request->filled('status') && !str_contains(strtolower($status), 'semua')) {
            $query->where('status', $status);
        }

        $presensis = $query->latest('tanggal')->latest('waktu')->get();

        $kelases  = Kelas::all();
        $jurusans = Kelas::whereNotNull('jurusan')
            ->pluck('jurusan')
            ->unique()
            ->values()
            ->all();

        return Inertia::render('Laporan/index', [
            'presensis' => $presensis,
            'presensi'  => $presensis,
            'summary'   => $summary,
            'kelases'   => $kelases,
            'jurusans'  => $jurusans,
            'filters'   => [
                'bulan'    => (string)$bulan,
                'tahun'    => (string)$tahun,
                'jurusan'  => $jurusan,
                'kelas_id' => $kelasId,
                'status'   => $status,
            ]
        ]);
    }

    public function export(Request $request)
    {
        $bulan = $request->filled('bulan') ? (int)$request->input('bulan') : (int)date('m');
        $tahun = $request->filled('tahun') ? (int)$request->input('tahun') : (int)date('Y');

        $jurusan = trim((string) $request->input('jurusan', 'Semua'));
        $kelasId = trim((string) $request->input('kelas_id', 'Semua'));
        $status  = trim((string) $request->input('status', 'Semua'));

        $query = Presensi::with(['siswa.kelas'])
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($request->filled('jurusan') && !str_contains(strtolower($jurusan), 'semua')) {
            $query->whereHas('siswa.kelas', function ($q) use ($jurusan) {
                $q->where('jurusan', $jurusan);
            });
        }

        if ($request->filled('kelas_id') && !str_contains(strtolower($kelasId), 'semua')) {
            $query->whereHas('siswa', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        if ($request->filled('status') && !str_contains(strtolower($status), 'semua')) {
            $query->where('status', $status);
        }

        $presensis = $query->latest('tanggal')->latest('waktu')->get();

        $bulanPadded = str_pad((string)$bulan, 2, '0', STR_PAD_LEFT);
        $filename = "Laporan_Presensi_{$bulanPadded}_{$tahun}.csv";

        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($presensis) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); 
            fputcsv($file, ['NO', 'TANGGAL', 'NIS', 'NAMA SISWA', 'KELAS', 'JURUSAN', 'STATUS', 'WAKTU']);

            foreach ($presensis as $idx => $row) {
                fputcsv($file, [
                    $idx + 1,
                    $row->tanggal,
                    $row->siswa->nisn ?? '-',
                    $row->siswa->nama_siswa ?? '-',
                    $row->siswa->kelas->nama_kelas ?? '-',
                    $row->siswa->kelas->jurusan ?? '-',
                    $row->status,
                    $row->waktu ?? '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}