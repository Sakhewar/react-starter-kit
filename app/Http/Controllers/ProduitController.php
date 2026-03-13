<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Outil;
use App\Models\PrixVente;
use App\Models\Seuil;
use Illuminate\Validation\Rule;
use Illuminate\Support\{Str};
use App\RefactoringItems\{CRUDController};

class ProduitController extends CRUDController
{
    protected function getValidationRules(): array
    {
        $baseArray =  [
            'code'                        => [
                'nullable',
                Rule::unique($this->table)->ignore($this->modelId)
            ],
            'libelle'                         => [
                'required',
                 Rule::unique($this->table)->ignore($this->modelId)
            ],
            'famille_produit_id'                       => [
                'required',
            ],
        ];
        return $baseArray;
    }


    protected function getCustomValidationMessage(): array
    {
        return [
            "libelle.required"                  => "Le libelle est obligatoire",
            "libelle.unique"                    => "Le libelle existe déjà",
            "code.unique"                       => "Le code existe déjà",
            "famille_produit_id.required"       => "La famille de produit est obligatoire",

            
        ];
    }

    public function beforeValidateData(): void
    {
        if (!isset($this->request->id))
        {
            $this->request['code']                       = empty($this->request['code']) ?  Outil::getCode($this->model, $this->modelValue->codePrefix) : $this->request['code'];
        }
    }

    public function afterCRUDProcessing(&$model): void
    {
        $prix_ventes = parseArray($this->request->prix_ventes, PrixVente::class);
        $seuils      = parseArray($this->request->seuils, Seuil::class);

        $line = 1;
        $prix_ventes = array_map(function ($item) use (&$line) 
        {
            $endText = " ==> Pricing : Ligne $line";
            if(empty($item['prix_vente']))
            {
                throw new \Exception("Le prix de vente est obligatoire" . $endText);
            }

            foreach(['prix_achat', 'frais', 'prix_revient', 'prix_vente'] as $key)
            {
                $item = $this->setNullIfEmpty($item, $key);
            }

            $line++;
            return $item;
        }, $prix_ventes);

        $model->saveHasManyRelation($prix_ventes, PrixVente::class);

        $seuils = array_map(function ($item) use (&$line) 
        {
            foreach(['min', 'max'] as $key)
            {
                $item = $this->setNullIfEmpty($item, $key);
            }

            $line++;
            return $item;
        }, $seuils);

        $model->saveHasManyRelation($seuils, Seuil::class);

   
        Outil::uploadFileToModel($this->request, $model, 'image');
    }

    public function setNullIfEmpty($value, $key)
    {
        
        if(empty($value[$key])) $value[$key] = null;
        return $value;
    }
}
