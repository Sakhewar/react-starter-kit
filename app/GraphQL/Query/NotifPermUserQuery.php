<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class NotifPermUserQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'notifpermusers',
        'description' => 'Retourne la liste des notifpermusers',
    ];
}
