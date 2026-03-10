<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class ClientType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'code'                               => ['type' => Type::string()],
            'nom_complet'                        => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'adresse'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'activer'                            => ['type' => Type::int()],
            'activer_fr'                         => ['type' => Type::string()],
            'image'                              => ['type' => Type::string()],
            'remise'                             => ['type' => Type::float()],
            'plafond'                            => ['type' => Type::float()],

            'type_client_id'                     => ['type' => Type::int()],
            'modalite_paiement_id'               => ['type' => Type::int()],

            'type_client'                        => ['type' => GraphQL::type('TypeClientType')],
            'modalite_paiement'                  => ['type' => GraphQL::type('ModalitePaiementType')],
            'contacts'                           => ['type' => Type::listOf(GraphQL::type('ContactType'))],
        ];
    }
}
