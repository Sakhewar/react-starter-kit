<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use GraphQL\Type\Definition\Type;

class LastValueType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'type_value'                           => ['type' => Type::string()],
            'value'                                => ['type' => Type::string()],
        ];
    }
}
