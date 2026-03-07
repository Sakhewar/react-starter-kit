<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;

class PageQuery extends RefactGraphQLQuery
{
    protected $searchColumns = [
        'title',
        'icon',
        'permissions',
    ];

    public $attributes = [
        'name' => 'page',
        'description' => 'Retourne la liste des pages',
    ];
    public function args(): array
    {
        return $this->addArgs([

            'title'                  => ['type' => Type::string()],
            'icon'                   => ['type' => Type::string()],
            'description'            => ['type' => Type::string()],
            'order'                  => ['type' => Type::int()],
            'module_id'              => ['type' => Type::int()],
            'permissions'            => ['type' => Type::string()],
            'can_be_managed'         => ['type' => Type::boolean()],
            'link'                   => ['type' => Type::string()],
            'autre'                  => ['type' => Type::int()],
            'search'                 => ['type' => Type::string()],

        ]);
    }
}
