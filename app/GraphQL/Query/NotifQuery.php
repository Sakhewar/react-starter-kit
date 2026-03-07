<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class NotifQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'notif',
        'description' => 'Retourne la liste des pays',
    ];
}
