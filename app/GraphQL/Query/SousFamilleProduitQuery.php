<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;

class SousFamilleProduitQuery extends EntityTypeQuery
{
    public function addQuery(\Illuminate\Database\Eloquent\Builder &$query, array &$args)
    {
        $query->whereNotNull('famille_produit_id');
    }
}
