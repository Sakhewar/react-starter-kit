<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;

class EntityTypeQuery extends RefactGraphQLQuery
{
    protected $paginationType = 'EntityTypePaginatedType';
    protected $modelType      = 'EntityTypeType';
    public function args(): array
    {
        return $this->addArgs([

            'modalite_paiement_id'    => ['type' => Type::int()],
            'type_client_id'          => ['type' => Type::int()],
            'famille_produit_id'      => ['type' => Type::int()],
            'sous_famille_produit_id' => ['type' => Type::int()],
            'marque_id'               => ['type' => Type::int()]
        ]);
    }
}
