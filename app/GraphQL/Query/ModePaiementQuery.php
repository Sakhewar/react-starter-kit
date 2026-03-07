<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;

class ModePaiementQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'modepaiements',
        'description' => 'Retourne la liste des modepaiements',
    ];

    public function args(): array
    {
        return $this->addArgs([

            'libelle'       => ['type' => Type::string()],
        ]);
    }
}
