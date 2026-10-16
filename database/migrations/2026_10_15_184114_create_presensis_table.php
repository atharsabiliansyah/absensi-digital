<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presensis', function (Blueprint $table) {
        $table->id();
    
        $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
        $table->date('tanggal');
        $table->time('waktu');
        $table->enum('status', ['Hadir', 'Terlambat', 'Tidak Hadir', 'Izin', 'Sakit']);
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensis');
    }
};
