<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class ContactType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom'                                => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'fonction'                           => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],

            'livreur_id'                         => ['type' => Type::int()],
            'compagnie_maritime_id'              => ['type' => Type::int()],
            'client_id'                          => ['type' => Type::int()],

            'client'                             => ['type' => GraphQL::type('ClientType')],
            'fournisseur'                        => ['type' => GraphQL::type('ClientType')],
        ];
    }
}
