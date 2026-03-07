<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use App\Models\{TypePermission};

class PermissionType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'name'                               => ['type' => Type::string()],
            'display_name'                       => ['type' => Type::string()],
            'guard_name'                         => ['type' => Type::string()],

            'type_permission_id'                 => ['type' => Type::int()],
            'groupe_permission_id'               => ['type' => Type::int()],

            'roles'                              => ['type' => Type::listOf(GraphQL::type('RoleType'))],
            'type_permission'                    => ['type' => GraphQL::type('TypePermissionType')],
            'groupe_permission'                  => ['type' => GraphQL::type('GroupePermissionType')],

            'created_at'                         => [ 'type' => Type::string()],
            'created_at_fr'                      => [ 'type' => Type::string()],
            'updated_at'                         => [ 'type' => Type::string()],
            'updated_at_fr'                      => [ 'type' => Type::string()],
            'deleted_at'                         => [ 'type' => Type::string()],
            'deleted_at_fr'                      => [ 'type' => Type::string()],
        ];
    }

    public function resolveTypePermissionField($root, $args)
    {
        return TypePermission::find($root['type_permission_id']);
    }
}
