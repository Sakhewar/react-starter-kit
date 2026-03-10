<?php

namespace App\Models;

class Fournisseur extends Model
{
    public $codePrefix = 'F';
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
            "column_db"     => "type_fournisseur_id",
            "column_excel"  => "Type De Fournisseur",
            "columnMatched" => "libelle",
            "model"         => TypeFournisseur::class,
            "import"        => true,
            "export"        => true,
        ]
    ];
}
