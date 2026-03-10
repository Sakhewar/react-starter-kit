<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Mpdf\Tag\U;
use App\Models\{Outil,Contact,TypeClient};
use App\RefactoringItems\CRUDController;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class ClientController extends CRUDController
{
    protected function getValidationRules(): array
    {
        return [
            'nom_complet'                         => [
                'required',
            ],

            'type_client_id'              => 'required',

            'telephone'                   => [
                'nullable',
                Rule::unique($this->table)->where('telephone', $this->request->telephone)->ignore($this->modelId)
            ]

        ];
    }
    protected function getCustomValidationMessage(): array
    {
        return [
            'nom_complet.required'               => "Le nom complet du client est requis",
            'nom_complet.unique'                 => "Ce nom de client est déjà utilisé",
            'type_client_id.required'            => "Renseigner le type de client",
            'telephone.unique'                   => "Ce numéro de téléphone est déjà utilisé"
        ];
    }
    public function beforeValidateData(): void
    {
        if (!isset($this->request->id))
        {
            $this->request['code']                       =  Outil::getCode($this->model, $this->modelValue->codePrefix);
        }
           
    }


    public function afterCRUDProcessing(&$model): void
    {
        $data = parseArray($this->request->contacts, Contact::class);
        $model->saveHasManyRelation($data, Contact::class);

        // On fait le traitement uniquement pour le cas d'un fournisseur
        if (str_contains($this->request->path(), 'fournisseur'))
        {
            Outil::uploadFileToModel($this->request, $model, 'image');
        }
    }
}
