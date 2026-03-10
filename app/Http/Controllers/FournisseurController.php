<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;

class FournisseurController extends ClientController
{
    public function beforeValidateData(): void
    {
        if($this->request->from_excel)
        {
            //dd($this->request->all());
        }
    }

    protected function getValidationRules(): array
    {

        return [
            'nom_complet'                         => [
                'required'
            ],

            'telephone'                   => [
                'nullable',
                Rule::unique($this->table)->where('telephone', $this->request->telephone)->ignore($this->modelId)
            ]
        ];
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            'nom_complet.required'               => "Le nom complet du fournisseur est requis",
            'telephone.required'                 => "Le numéro de téléphone du fournisseur est requis",
            'telephone.unique'                   => "Ce numéro de téléphone est déjà utilisé"
        ];
    }
}
