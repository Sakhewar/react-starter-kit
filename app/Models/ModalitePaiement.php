<?php

namespace App\Models;

class ModalitePaiement extends Model
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
            "column_unique" => false
        ],
        [
            "column_db" => "nbre_jour",
            "column_excel" => "Nbre De Jour",
            "column_unique" => false
        ],
        [
            "column_db" => "findumois",
            "column_excel" => "Fin du mois (0/1)",
            "column_unique" => false
        ],
    ];
}
