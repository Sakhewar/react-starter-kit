<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use Notifiable;
    use HasRoles;
    use HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
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

    public static $columnsExport =  [
        [
            "column_db" => "name",
            "column_excel" => "Nom",
            "column_unique" => true,
            "import"        =>true,
            "export"        =>true
        ],
        [
            "column_db" => "email",
            "column_excel" => "Email",
            "column_unique" => false,
            "import"        =>true,
            "export"        =>true
        ],
        [
            "column_db" => "status_fr",
            "column_excel" => "Actif",
            "column_unique" => false,
            "import"        =>true,
            "export"        =>true
        ],
    ];

    public function getImageAttribute()
    {
        return Outil::resolveImageField($this->attributes['image']);
    }
}
