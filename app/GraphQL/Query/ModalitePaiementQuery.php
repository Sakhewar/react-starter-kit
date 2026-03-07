<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class ModalitePaiementQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'modalitepaiements',
        'description' => 'Retourne la liste des modalite de paiements',
    ];
}
