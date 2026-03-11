<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Outil;
use Illuminate\Validation\Rule;
use Illuminate\Support\{Str};
use App\RefactoringItems\{CRUDController};

class EntityTypeController extends CRUDController
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
            ]
        ];

        if(Str::contains('modalitepaiement', $this->getPath()))
        {
            $baseArray = array_merge($baseArray,[
                'nbre_jour'                        => [
                    'required',
                ]
            ]);
        }
   
        if(Str::contains('depot', $this->getPath()))
        {
            $baseArray = array_merge($baseArray,[
                'point_vente_id'                       => [
                    'required',
                ],
                'type_depot_id'                        => [
                    'required',
                ]
            ]);
        }
        return $baseArray;
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            "libelle.required"         => "Le libelle est obligatoire",
            "libelle.unique"           => "Le libelle existe déjà",
            "nbre_jour.required"       => "Le nombre de jour est obligatoire",
            "point_vente_id.required"  => "Le point de vente est obligatoire",
            "type_depot_id.required"   => "Le type de depot est obligatoire"
        ];
    }

    public function afterCRUDProcessing(&$model): void
    {
        if(Str::contains('pointvente', $this->getPath()))
        {
            $data = parseArray($this->request->contacts, Contact::class);
            //dd($data);
            $model->saveHasManyRelation($data, Contact::class);

            Outil::uploadFileToModel($this->request, $model, 'image');
        }
    }
}
