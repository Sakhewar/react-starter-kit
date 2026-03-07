<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class TypeClientQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'typeclients',
        'description' => 'Retourne la liste des typeclients',
    ];
}
