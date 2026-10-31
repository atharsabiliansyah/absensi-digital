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
    Schema::create('guru_kelas', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
            ->constrained('users')
            ->cascadeOnDelete();

        $table->foreignId('kelas_id')
            ->constrained('kelas')
            ->cascadeOnDelete();

        $table->timestamps();

        $table->unique(['user_id', 'kelas_id']);
    });
}

public function down(): void
{
    Schema::dropIfExists('guru_kelas');
}
};
