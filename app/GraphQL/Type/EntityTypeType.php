<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class EntityTypeType extends RefactGraphQLType
{
    protected $column = 'type_client_id';

    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],

            'libelle'                            => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'adresse'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'rccm'                               => ['type' => Type::string()],
            'ninea'                              => ['type' => Type::string()],
            'image'                              => ['type' => Type::string()],

            'nbre_client'                        => ['type' => Type::int()],
            'nbre_fournisseur'                   => ['type' => Type::int()],

            'activer'                            => ['type' => Type::int()],
            'activer_fr'                         => ['type' => Type::string()],

            'type_depot_id'                      => ['type' => Type::int()],
            'type_depot'                         => ['type' => GraphQL::type('EntityTypeType')],

            'point_vente_id'                     => ['type' => Type::int()],
            'point_vente'                        => ['type' => GraphQL::type('EntityTypeType')],

            'contacts'                           => ['type' => Type::listOf(GraphQL::type('ContactType'))],

        ];
    }

    public function resolveImageField($root, $args)
    {
        return $root['image'];
    }
}
