<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;

class SeuilType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'depot_id'                           => ['type' => Type::int()],
            'produit_id'                         => ['type' => Type::int()],

            'min'                                => ['type' => Type::float()],
            'max'                                => ['type' => Type::float()],

            'depot'                              => ['type' => GraphQL::type('EntityTypeType')],
        ];
    }
}
