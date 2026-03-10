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
            'last_value_inc'                     => ['type' => Type::int()],
            'code'                               => ['type' => Type::string()],
            'nom'                                => ['type' => Type::string()],
            'prenom'                             => ['type' => Type::string()],
            'display_text'                       => ['type' => Type::string(), 'alias' => 'nom'],
            'email'                              => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'faxe'                               => ['type' => Type::string()],
            'fixe'                               => ['type' => Type::string()],
            'ninea'                              => ['type' => Type::string()],
            'rcc'                                => ['type' => Type::string()],
            'adresse_postale'                    => ['type' => Type::string()],
            'adresse'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'ville'                              => ['type' => Type::string()],
            'status'                             => ['type' => Type::int()],
            'status_fr'                          => ['type' => Type::string()],
            'color_status'                       => ['type' => Type::string()],
            'image'                              => ['type' => Type::string()],
            'remise'                             => ['type' => Type::float()],
            'plafond'                            => ['type' => Type::float()],

            'pay_id'                             => ['type' => Type::int()],
            'type_client_id'                     => ['type' => Type::int()],
            'modalite_paiement_id'               => ['type' => Type::int()],

            'pay'                                => ['type' => GraphQL::type('ProvenanceType')],
            'type_client'                        => ['type' => GraphQL::type('TypeClientType')],
            'modalite_paiement'                  => ['type' => GraphQL::type('ModalitePaiementType')],
            'contacts'                           => ['type' => Type::listOf(GraphQL::type('ContactType'))],
        ];
    }
}
