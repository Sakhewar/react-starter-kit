<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class FournisseurType extends RefactGraphQLType
{   protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom_complet'                        => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'code'                               => ['type' => Type::string()],

           
            'image'                               => ['type' => Type::string()],
        
            'activer'                            => ['type' => Type::int()],
            'activer_fr'                         => ['type' => Type::string()],
            'adresse'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],

            'type_fournisseur_id'                => ['type' => Type::int()],
            'type_fournisseur'                   => ['type' => GraphQL::type('TypeClientType')],
            'contacts'                           => ['type' => Type::listOf(GraphQL::type('ContactType'))],
        ];
    }

    public function resolveImageField($root, $args)
    {
        return $root['image'];
    }
}
