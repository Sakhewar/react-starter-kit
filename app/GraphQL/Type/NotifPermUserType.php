<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class NotifPermUserType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'notif_id'                           => ['type' => Type::int()],
            'permission_id'                      => ['type' => Type::int()],
            'user_id'                            => ['type' => Type::int()],
            'view'                               => ['type' => Type::boolean()],
            'notif'                              => ['type' => GraphQL::type('NotifType')],
            'link'                               => ['type' => Type::string()],
            'permission'                         => ['type' => GraphQL::type('PermissionType')],
            'user'                               => ['type' => GraphQL::type('UserType')],

            'created_at'                         => ['type' => Type::string()],
            'created_at_fr'                      => ['type' => Type::string()],
            'updated_at'                         => ['type' => Type::string()],
            'updated_at_fr'                      => ['type' => Type::string()],
            'deleted_at'                         => ['type' => Type::string()],
            'deleted_at_fr'                      => ['type' => Type::string()],
        ];
    }
}
