<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class ModeleType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom'                                => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],

            'marque_id'                          => ['type' => Type::int()],
            // 'marque'                             => ['type' => GraphQL::type('MarqueType')],
            'gabarit_id'                         => ['type' => Type::int()],
            // 'gabarit'                            => ['type' => GraphQL::type('GabaritType')],
        ];
    }
}
