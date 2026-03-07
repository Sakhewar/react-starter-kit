<?php

namespace App\Http\Controllers;

class FournisseurController extends EntityTypeController
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
            'nom'                         => [
                'required','unique:fournisseurs'
            ],
        ];
    }
}
