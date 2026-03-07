<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;

class ModePaiementType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'libelle'                            => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'ventes'                             => ['type' => Type::string()],
            'form'                               => ['type' => Type::string()],
        ];
    }

    protected function resolveFormField($root, $args)
    {
        return "tet";
    }
}
