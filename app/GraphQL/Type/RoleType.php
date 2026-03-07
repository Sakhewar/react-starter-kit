<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class RoleType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::id()],
            'name'                               => ['type' => Type::string()],
            'guard_name'                         => ['type' => Type::string()],
            'permissions'                        => ['type' => Type::listOf(GraphQL::type('PermissionType'))],

            'created_at'                         => [ 'type' => Type::string()],
            'created_at_fr'                      => [ 'type' => Type::string()],
            'updated_at'                         => [ 'type' => Type::string()],
            'updated_at_fr'                      => [ 'type' => Type::string()],
            'deleted_at'                         => [ 'type' => Type::string()],
            'deleted_at_fr'                      => [ 'type' => Type::string()],
        ];
    }
}
