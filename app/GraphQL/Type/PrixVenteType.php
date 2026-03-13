<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;

class PrixVenteType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'point_vente_id'                     => ['type' => Type::int()],
            'produit_id'                         => ['type' => Type::int()],

            'prix_achat'                         => ['type' => Type::float()],
            'frais'                              => ['type' => Type::float()],
            'prix_revient'                       => ['type' => Type::float()],
            'prix_vente'                         => ['type' => Type::float()],

            'point_vente'                        => ['type' => GraphQL::type('EntityTypeType')],
        ];
    }
}
