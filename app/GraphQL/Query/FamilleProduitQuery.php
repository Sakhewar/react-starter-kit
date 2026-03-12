<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class FamilleProduitQuery extends EntityTypeQuery
{
    public function addQuery(\Illuminate\Database\Eloquent\Builder &$query, array &$args)
    {
        $query->whereNull('famille_produit_id');
    }
}
