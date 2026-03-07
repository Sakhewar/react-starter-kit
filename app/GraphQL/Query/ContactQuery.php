<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class ContactQuery extends RefactGraphQLQuery
{
     public $attributes = [
        'name' => 'contact',
        'description' => 'Retourne les informations d’un client',
    ];
}
