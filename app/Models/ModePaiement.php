<?php

namespace App\Models;

class ModePaiement extends Model
{
    public static $columnsExport =  [
        [
            "column_db" => "libelle",
            "column_excel" => "Libelle",
            "column_unique" => true
        ]
    ];
}
