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
            'nom'                         => [
                'required',
                Rule::unique($this->table)->where('nom', $this->request->nom)->ignore($this->modelId)
            ],

            'type_client_id'               => 'required',

            'telephone'                    => 'nullable',

        ];
    }
    protected function getCustomValidationMessage(): array
    {
        return [
            'type_client_id.required'            => "Renseigner le type de client"
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
