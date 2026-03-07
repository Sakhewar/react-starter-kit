<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;

class PreferenceType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom'                                => ['type' => Type::string()],
            'valeur'                             => ['type' => Type::string()],
            'display_name'                       => ['type' => Type::string()],
        ];
    }
}
