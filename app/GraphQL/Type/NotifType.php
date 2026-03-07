<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class NotifType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'icon'                               => ['type' => Type::string()],
            'toast'                              => ['type' => Type::string()],
            'message'                            => ['type' => Type::string()],
            'link'                               => ['type' => Type::string()],

            'page_id'                            => ['type' => Type::int()],
            'page'                               => ['type' => GraphQL::type('PageType')],

            'module_id'                          => ['type' => Type::int()],
            'module'                             => ['type' => GraphQL::type('ModuleType')],

            'created_at'                         => ['type' => Type::string()],
            'created_at_fr'                      => ['type' => Type::string()],
            'updated_at'                         => ['type' => Type::string()],
            'updated_at_fr'                      => ['type' => Type::string()],
            'deleted_at'                         => ['type' => Type::string()],
            'deleted_at_fr'                      => ['type' => Type::string()],
        ];
    }
}
