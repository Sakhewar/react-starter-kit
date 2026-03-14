<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;

class PermissionQuery extends RefactGraphQLQuery
{
    protected $modelNamespace = '\\Spatie\\Permission\\Models';

    public function args(): array
    {
        return $this->addArgs([
            'user_id'          => ['type' => Type::int()],
        ]);
    }

    public function addQuery(\Illuminate\Database\Eloquent\Builder &$query, array &$args)
    {
        if(isset($args['user_id']))
        {
            $user_id = $args['user_id'];
            $query->whereRaw("id in (select role_has_permissions.permission_id from model_has_roles, role_has_permissions where model_has_roles.model_id={$user_id} and model_has_roles.role_id=role_has_permissions.role_id)");
        }
    }
}
