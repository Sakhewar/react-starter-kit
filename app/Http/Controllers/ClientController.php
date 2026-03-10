<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Mpdf\Tag\U;
use App\Models\{Outil,Contact,TypeClient};
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class ClientController extends EntityTypeController
{
    protected function getValidationRules(): array
    {
        return [
            'nom'                         => 'required',

            'prenom'                      => 'required',

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
            'prenom.required'                    => "Le prénom du client est requis",
            'nom.required'                       => "Le nom complet du client est requis",
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

        if ($this->request->from_excel)
        {

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
