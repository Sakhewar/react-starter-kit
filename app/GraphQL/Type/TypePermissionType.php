<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class TypePermissionType extends GraphQLType
{
    protected $attributes = [
        'name' => 'TypePermissionType',
        'description' => 'Type pour les types de permission',
    ];

    public function fields(): array
    {
        return [
            // Définir les champs ici
            'id' => [
                'type' => Type::nonNull(Type::int()),'description' => 'ID du type de permission',
            ],
            'nom' => [
                'type' => Type::string(),'description' => 'Nom du type de permission',
            ],
        ];
    }
}
