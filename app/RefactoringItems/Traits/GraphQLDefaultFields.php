<?php

namespace App\Traits;

use App\Models\{Client, Outil};
use Carbon\Carbon;

trait GraphQLDefaultFields
{

    // Type client, Nomenclature client
    protected function resolveNbreClientField($root, $args)
    {
        $id = $root['id'];
        return Client::where($this->column, $id)->count();
    }

    protected function resolveColorEtatTxtField($root, $args,$column='etat')
    {
        $retour= $root[$column];
        $text = "danger";
        if($retour==1 || $retour==true)
        {
            $text = "success";
        }
        return $text;
    }

    // Dates
    public function resolveCreatedAtFrField($root, $args)
    {
        return formatDate($root['created_at']);
    }

    public function resolveUpdatedAtFrField($root, $args)
    {
        return formatDate($root['updated_at']);
    }

    public function resolveDeletedAtFrField($root, $args)
    {
        return formatDate($root['deleted_at']);
    }

    protected function resolveColorField($root, $args,$name="status")
    {
        $retour= $root[$name];
        $text = "danger";
        if($retour==1 || $retour==true)
        {
            $text = "success";
        }
        return $text;
    }
    protected function resolveFrField($root, $args,$name)
    {
        $retour= $root[$name];
        $text = " Non";
        if($retour==1 || $retour==true)
        {
            $text = "Oui";
        }
        return $text;
    }

    protected function resolveColorStatusField($root, $args)
    {
        $retour= $root['status'];
        $text = "danger";
        if($retour==1 || $retour==true)
        {
            $text = "success";
        }
        return $text;
    }

    protected function resolveStatusFrField($root, $args)
    {
        $retour= $root['status'];
        $text = " Non";
        if($retour==1 || $retour==true)
        {
            $text = "Oui";
        }
        return $text;
    }

    protected function resolveDateFrField($root, $args)
    {
        $date_at = $root['date'];
        $date_at = !isset($date_at) ? $date_at : Carbon::parse($date_at)->format(Outil::formatDate(true, ['withHours' => false]));
        return $date_at;
    }

    protected function resolveDateDebutFrField($root, $args)
    {
        $date_at = $root['date_debut'];
        $date_at = !isset($date_at) ? $date_at : Carbon::parse($date_at)->format(Outil::formatDate(true, ['withHours' => false]));
        return $date_at;
    }

    protected function resolveDateFinFrField($root, $args)
    {
        $date_at = $root['date_fin'];
        $date_at = !isset($date_at) ? $date_at : Carbon::parse($date_at)->format(Outil::formatDate(true, ['withHours' => false]));
        return $date_at;
    }

    public function resolveImageField($root, $args)
    {
        return Outil::resolveImageField($root['image']);
    }

    public function resolveQrcodeField($root, $args)
    {
        return Outil::resolveImageField($root['qrcode']);
    }


    // Monetaire
    public function resolvePrixFrField($root, $args)
    {
        return Outil::formatWithThousandSeparator($root['prix']);
    }

    public function resolveMontantFrField($root, $args)
    {
        return Outil::formatWithThousandSeparator($root['montant']);
    }

    public function resolveTarifFrField($root, $args)
    {
        return Outil::formatWithThousandSeparator($root['tarif']);
    }

    public function resolveTotalFrField($root, $args)
    {
        return Outil::formatWithThousandSeparator($root['total']);
    }

    protected function resolveQuantiteFrField($root, $args)
    {
        return Outil::formatWithThousandSeparator($root['quantite']);
    }
}
