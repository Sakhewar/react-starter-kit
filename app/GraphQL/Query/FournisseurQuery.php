<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;


class FournisseurQuery extends RefactGraphQLQuery
{

    public function args(): array
    {
        return $this->addArgs([
            'type_fournisseur_id'        => ['type' => Type::int()]
        ]);
    }

}
