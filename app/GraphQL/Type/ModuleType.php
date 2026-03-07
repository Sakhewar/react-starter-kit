<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class ModuleType extends RefactGraphQLType
{
    public function resolveFields(): array
    {
        return [
            'id'                        => ['type' => Type::int()],

            'title'                     => ['type' => Type::string()],
            'icon'                      => ['type' => Type::string()],
            'description'               => ['type' => Type::string()],
            'order'                     => ['type' => Type::int()],
            'link'                      => ['type' => Type::string()],
            'nb_notifs'                 => ['type' => Type::string()],
            'nb_notif_perm_users'       => ['type' => Type::string()],
            'can_be_managed'            => ['type' => Type::boolean()],

            'module_id'                 => ['type' => Type::int()],
            'module'                    => ['type' => GraphQL::type('ModuleType')],
            'pages'                     => ['type' => Type::listOf(GraphQL::type('PageType'))],
            'notifs'                    => ['type' => Type::listOf(GraphQL::type('NotifType'))],
            'notif_perm_users'          => ['type' => Type::listOf(GraphQL::type('NotifPermUserType'))],

            'created_at'                => ['type' => Type::string()],
            'created_at_fr'             => ['type' => Type::string()],
            'updated_at'                => ['type' => Type::string()]
        ];
    }
}
