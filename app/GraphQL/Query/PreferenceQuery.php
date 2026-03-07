<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class PreferenceQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'preferences',
        'description' => 'Retourne la liste des preferences',
    ];
}
