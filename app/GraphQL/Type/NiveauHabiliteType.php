<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NiveauHabiliteType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NiveauHabiliteType',
        'description' => 'Type pour le niveau d\'habilité',
    ];

    public function fields(): array
    {
        return [
            // Définir les champs ici
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'ID du niveau d\'habilité',
            ],
            'nom' => [
                'type' => Type::string(),
                'description' => 'Nom du niveau d\'habilité',
            ],
        ];
    }
}
