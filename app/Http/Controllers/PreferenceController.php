<?php

namespace App\Http\Controllers;

use App\RefactoringItems\CRUDController;


class PreferenceController extends CRUDController
{
    protected function getValidationRules(): array
    {
        return [
            'display_name'       => 'required',
            'valeur'             => 'required'
        ];
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            'display_name.required'              => "Renseigner le nom",
            'valeur.required'                    => "Renseigner la valeur",
        ];
    }
}
