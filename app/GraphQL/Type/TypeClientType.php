<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class TypeClientType extends RefactGraphQLType
{
    protected $column = 'type_client_id';

    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'libelle'                                => ['type' => Type::string()],
            'description'                        => ['type' => Type::string()],
            'nbre_client'                        => ['type' => Type::int()],
        ];
    }
}
