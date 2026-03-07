<?php

namespace App\Models;

class Client extends Model
{
    public $codePrefix = 'CL';

    public static $columnsExport =  [
        [
            "column_db" => "nom",
            "column_excel" => "Nom",
            "column_unique" => true
        ],
        [
            "column_db" => "numero_comptable",
            "column_excel" => "Nº Comptable",
            "column_unique" => false
        ],
        [
            "column_db" => "adresse_postale",
            "column_excel" => "Adresse",
            "column_unique" => false
        ],
        [
            "column_db" => "telephone",
            "column_excel" => "Telephone",
            "column_unique" => false
        ],
        [
            "column_db" => "type_client_id",
            "column_excel" => "Type De Client",
            "column_unique" => false
        ]
    ];

    public function user()
    {
        return $this->hasMany(User::class);
    }
}
