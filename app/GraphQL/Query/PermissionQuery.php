<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class PermissionQuery extends RefactGraphQLQuery
{
    protected $modelNamespace = '\\Spatie\\Permission\\Models';

    public $attributes = [
        'name' => 'permissions',
        'description' => 'Retourne la liste des permission',
    ];
}
