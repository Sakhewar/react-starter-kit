<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;

class ClientQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'clients',
        'description' => 'Retourne les informations d’un client',
    ];

    public function args(): array
    {
        return $this->addArgs([

            'modalite_paiement_id'       => ['type' => Type::int()],
            'type_client_id'             => ['type' => Type::int()]
        ]);
    }
}
