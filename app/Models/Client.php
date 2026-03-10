<?php

namespace App\Models;

class Client extends Model
{
    public $codePrefix = 'CL';

    public static $columnsExport =  [
        [
            "column_db" => "nom",
            "column_excel" => "Nom",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "numero_comptable",
            "column_excel" => "Nº Comptable",
            "column_unique" => false,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db" => "adresse_postale",
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
            "column_db" => "type_client_id",
            "column_excel" => "Type De Client",
            "column_unique" => false,
            "import"      => true,
            "export"      => true
        ]
    ];

    public function user()
    {
        return $this->hasMany(User::class);
    }
}
