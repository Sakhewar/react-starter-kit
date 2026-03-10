<?php

namespace App\Models;

class Client extends Model
{
    public $codePrefix = 'CL';

    public static $columnsExport =  [
        [
            "column_db" => "nom_complet",
            "column_excel" => "Nom Complet",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "email",
            "column_excel" => "Email",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "telephone",
            "column_excel" => "Téléphone",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "adresse",
            "column_excel" => "Adresse",
            "column_unique" => false,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "telephone",
            "column_excel" => "Telephone",
            "column_unique" => false,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db"     => "type_client_id",
            "column_excel"  => "Type De Client",
            "columnMatched" => "libelle",
            "model"         => TypeClient::class,
            "import"        => true,
            "export"        => true,
        ]
    ];

    public function user()
    {
        return $this->hasMany(User::class);
    }
}
