<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class PaysType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'nom'                                => ['type' => Type::string()],
            'cedeao'                             => ['type' => Type::boolean()],
            'display_text'                       => ['type' => Type::string(), 'alias' => 'nom'],
            'indic'                              => ['type' => Type::string()],
            'abreviation'                        => ['type' => Type::string()],
        ];
    }
}
