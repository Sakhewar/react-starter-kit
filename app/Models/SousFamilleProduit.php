<?php

namespace App\Models;

class SousFamilleProduit extends FamilleProduit
{
    protected $table = 'famille_produits';

    public static $columnsExport =  [
        [
            "column_db" => "libelle",
            "column_excel" => "Libellé",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
        [
            "column_db"     => "famille_produit_id",
            "column_excel"  => "Famille Produit",
            "columnMatched" => "libelle",
            "model"         => FamilleProduit::class,
            "import"        => true,
            "export"        => true,
        ],
        [
            "column_db" => "description",
            "column_excel" => "Description",
            "column_unique" => true,
            "import"      => true,
            "export"      => true
        ],
    ];
}
