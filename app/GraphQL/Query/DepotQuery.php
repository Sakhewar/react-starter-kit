<?php

namespace App\GraphQL\Query;

use GraphQL\Type\Definition\Type;

class DepotQuery extends EntityTypeQuery
{

    public function args(): array
    {
        return $this->addArgs([
            'point_vente_id'         => ['type' => Type::int()],
            'type_depot_id'          => ['type' => Type::int()],
        ]);
    }
}
