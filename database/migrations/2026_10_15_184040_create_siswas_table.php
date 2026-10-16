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
        Schema::create('siswas', function (Blueprint $table) {
        $table->id();
        $table->string('rfid_uid', 50)->unique();
        $table->string('nisn', 20)->nullable();
        $table->string('nama_siswa', 100);
        $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};
