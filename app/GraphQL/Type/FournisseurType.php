<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class FournisseurType extends RefactGraphQLType
{   protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom'                                => ['type' => Type::string()],
            'nom_complet'                        => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'code'                               => ['type' => Type::string()],

            'faxe'                               => ['type' => Type::string()],
            'fixe'                               => ['type' => Type::string()],
            'ninea'                              => ['type' => Type::string()],
            'rcc'                                => ['type' => Type::string()],
            'image'                               => ['type' => Type::string()],
            'adresse_postale'                    => ['type' => Type::string()],
            'status'                             => ['type' => Type::int()],
            'status_fr'                          => ['type' => Type::string()],
            'color_status'                       => ['type' => Type::string()],
            'adresse'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'pays_id'                            => ['type' => Type::int()],
            'pays'                               => ['type' => GraphQL::type('ProvenanceType')],
            'ville'                              => ['type' => Type::string()],

            'contacts'                           => ['type' => Type::listOf(GraphQL::type('ContactType'))],
        ];
    }
}
