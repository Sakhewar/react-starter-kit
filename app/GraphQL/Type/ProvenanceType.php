<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class ProvenanceType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'libelle'                            => ['type' => Type::string()],
            'cedeao'                             => ['type' => Type::boolean()],
            'display_text'                       => ['type' => Type::string(), 'alias' => 'libelle'],
            'indic'                              => ['type' => Type::string()],
            'abreviation'                        => ['type' => Type::string()],
            'description'                        => ['type' => Type::string(), 'alias' => 'libelle'],
        ];
    }
}
