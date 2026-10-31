<?php

namespace App\Console\Commands;

use App\Models\Presensi;
use App\Models\Siswa;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class MarkAbsentStudents extends Command
{
    protected $signature = 'presensi:mark-absent';

    protected $description = 'Menandai siswa yang tidak melakukan presensi masuk';

    public function handle(): int
    {
        $now = Carbon::now('Asia/Jakarta');

        if ($now->format('H:i:s') < '21:00:00') {
            $this->error('Perintah ini hanya boleh dijalankan mulai pukul 21.00 WIB.');
            return self::FAILURE;
        }

        $today = $now->toDateString();
        $total = 0;

        Siswa::query()->chunkById(100, function ($siswas) use ($today, &$total) {
            foreach ($siswas as $siswa) {
                $sudahAda = Presensi::where('siswa_id', $siswa->id)
                    ->whereDate('tanggal', $today)
                    ->exists();

                if (!$sudahAda) {
                    Presensi::create([
                        'siswa_id' => $siswa->id,
                        'tanggal' => $today,
                        'waktu' => null,
                        'waktu_pulang' => null,
                        'status' => 'Tidak Hadir',
                    ]);

                    $total++;
                }
            }
        });

        $this->info("Selesai. {$total} siswa ditandai Tidak Hadir.");

        return self::SUCCESS;
    }
}
