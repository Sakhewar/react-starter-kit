<?php

namespace App\Models;

class TypeClient extends Model
{
    public static $columnsExport =  [
        [
            "column_db" => "libelle",
            "column_excel" => "Libelle",
            "column_unique" => true
        ],
        [
            "column_db" => "description",
            "column_excel" => "Description",
            "column_unique" => true
        ],

    ];
}
