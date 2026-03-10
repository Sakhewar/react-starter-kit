<?php

namespace App\Models;

class Fournisseur extends Model
{
    public $codePrefix = 'F';
    public static $columnsExport =  [
        [
            "column_db" => "nom",
            "column_excel" => "Nom",
            "column_unique" => true
        ],
        [
            "column_db" => "email",
            "column_excel" => "Email",
            "column_unique" => false
        ],
        [
            "column_db" => "telephone",
            "column_excel" => "Telephone",
            "column_unique" => false
        ],
        [
            "column_db" => "pay_id",
            "column_excel" => "Pays",
            "column_unique" => false
        ],
        [
            "column_db" => "ville",
            "column_excel" => "Ville",
            "column_unique" => false
        ],
    ];
}
