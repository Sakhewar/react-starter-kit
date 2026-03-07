<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use App\RefactoringItems\{CRUDController};

class RoleController extends EntityTypeController
{
    protected $modelNamespace = '\\Spatie\\Permission\\Models';

    protected function getValidationRules(): array
    {
        return [
            'name'                         => [
                'required',
                Rule::unique($this->table)->ignore($this->modelId)
            ],
        ];
    }

    protected function getCustomValidationMessage(): array
    {
        return [
            "name.unique"             => "Ce nom existe déjà",
            "name.required"           => "Le nom est obligatoire",
        ];
    }

    public function afterCRUDProcessing(&$model): void
    {
        if (\Str::lower($model->name) == \Str::lower("super-admin"))
        {
            throw new \Exception(__('customlang.modification_profil_impossible'));
        }

        $permissions = parseArray($this->request->permissions);
        if (isset($permissions))
        {
            try
            {
                $permissions = explode(',', $permissions);
                $permissions = str_replace('[', '', $permissions);
                $permissions = str_replace(']', '', $permissions);
            }
            catch (\Exception $e)
            {
                $permissions = (!empty($permissions)) ? array($permissions) : array();
            }
        }

        if (count($permissions) == 0)
        {
            throw new \Exception(__('customlang.profil_tabpermission_vide'));
        }

        $model->syncPermissions($permissions);
    }
}
