<?php

namespace App\Http\Controllers;

use App\RefactoringItems\CRUDController;
use Illuminate\Validation\Rule;

class ProvenanceController extends CRUDController
{

    protected $graphQLQueryName = "provenances";
    public function beforeValidateData() : void
    {
        $this->request['cedeao'] = !(array_key_exists('cedeao', $this->request->all())) ? 0 : 1;
    }
    protected function getValidationRules(): array
    {
        return [
            'libelle'                        => [
                'required',
                Rule::unique($this->table)->ignore($this->modelId)
            ]
        ];
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            "libelle.required"             => "Le libellé est obligatoire"
        ];
    }
}
