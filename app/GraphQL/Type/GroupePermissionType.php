<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use App\Models\{TypePermission};
use Spatie\Permission\Models\Permission;


class GroupePermissionType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'name'                               => ['type' => Type::string()],
            'tag'                                => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],

            'permissions'                        => ['type' => Type::listOf(GraphQL::type('PermissionType'))],
        ];
    }


    // TODO: a revoir
    // public function resolvePermissionsField($root, $args)
    // {
    //     $typePermissions = TypePermission::orderBy('id')->get();
    //     $retour = [];

    //     foreach($typePermissions as $typePermission)
    //     {
    //         $find = false;
    //         foreach($root['permissions'] as $permission)
    //         {
    //             if ($permission['type_permission_id']==$typePermission->id)
    //             {
    //                 $find = true;
    //                 break;
    //             }
    //         }

    //         if ($find)
    //         {
    //             array_push($retour, $permission);
    //         }
    //         else
    //         {
    //             $newPermission = $typePermission->name;
    //             $newPermission->type_permission_id = $typePermission->id;

    //             array_push($retour, $newPermission);
    //         }
    //     }

    //     return $retour;
    // }
}
