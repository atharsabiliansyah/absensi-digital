<?php

namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
    'name',
    'username',
    'email',
    'password',
    'nip', 
    'role',
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

public function kelasDiampu()
{
    return $this->belongsToMany(
        \App\Models\Kelas::class,
        'guru_kelas',
        'user_id',
        'kelas_id'
    )->withTimestamps();
}

public function isSuperAdmin(): bool
{
    return $this->role === 'super_admin';
}

public function isGuru(): bool
{
    return $this->role === 'guru';
}

}
