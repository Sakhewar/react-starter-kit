<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use App\RefactoringItems\{CRUDController};

class EntityTypeController extends CRUDController
{
    protected function getValidationRules(): array
    {
        if(array_key_exists('famille_produit_id', $this->request->all()))
        {
            $nomUnique = Rule::unique($this->table)->where('famille_produit_id', $this->request->famille_produit_id)->ignore($this->modelId);
        }
        else
        {
            $nomUnique = Rule::unique($this->table)->ignore($this->modelId);
        }

        return [
            'code'                        => [
                'nullable',
                Rule::unique($this->table)->ignore($this->modelId)
            ],
            'libelle'                         => [
                'required',
                $nomUnique
            ],
            // 'nom'                         => [
            //     'required',
            //     $nomUnique
            // ],
            'ordre'                        => [
                str_contains(strtolower($this->model), "familledebour") ? 'required' : 'nullable',
                Rule::unique($this->table)->ignore($this->modelId)
             ],
            'nbre_jour'                        => [
               str_contains(strtolower($this->model), "modalitepaiement") ? 'required' : 'nullable'
            ],
            'tarifbsc'                        => [
                str_contains(strtolower($this->model), "typeconteneur") ? 'required' : 'nullable'
            ],
        ];
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            "nom.required"             => "Le nom est obligatoire",
            "libelle.required"         => "Le libelle est obligatoire",
            "libelle.unique"           => "Le libelle existe déjà",
            "ordre.required"           => "L'ordre est obligatoire",
            "nbre_jour.required"       => "Le nombre de jour est obligatoire",
            "signe.unique"             => "Le signe de la devise est déjà utilisé",
            "devise_base.unique"       => "Une devise de base est déja définie",
            "nom.unique"               => "Ce nom existe déjà",
            "tarifbsc.required"        => "Le tarif BSC est obligatoire",
        ];
    }
}
