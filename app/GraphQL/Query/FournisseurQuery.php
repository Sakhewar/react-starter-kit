<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class FournisseurQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'fournisseurs',
        'description' => 'Retourne la liste des fournisseurs',
    ];
}
