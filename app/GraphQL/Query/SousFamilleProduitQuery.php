<?php

namespace App\GraphQL\Query;

use GraphQL\Type\Definition\Type;

class SousFamilleProduitQuery extends EntityTypeQuery
{
    public function args(): array
    {
        return $this->addArgs([
            'famille_produit_id'     => ['type' => Type::int()],
        ]);
    }
    public function addQuery(\Illuminate\Database\Eloquent\Builder &$query, array &$args)
    {
        $query->whereNotNull('famille_produit_id');
    }
}
