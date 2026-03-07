<?php

namespace App\GraphQL\Type;

use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class UserType extends RefactGraphQLType
{
    protected function resolveFields(): array
    {
        return [
            'id'                                 => ['type' => Type::int()],
            'name'                               => ['type' => Type::string()],
            'email'                              => ['type' => Type::string()],
            'telephone'                          => ['type' => Type::string()],
            'image'                              => ['type' => Type::string()],
            'status'                             => ['type' => Type::boolean()],
            'status_fr'                          => ['type' => Type::string()],
            'color_status'                       => ['type' => Type::string()],
            'role_id'                            => ['type' => Type::int()],
            'last_login'                         => ['type' => Type::string()],
            'last_login_ip'                      => ['type' => Type::string()],
            'is_on_line'                         => ['type' => Type::boolean()],
            'created_at_user_id'                 => ['type' => Type::int()],
            'updated_at_user_id'                 => ['type' => Type::int()],

            'niveau_habilite_id'                 => ['type' => Type::int()],
            'niveau_habilite'                    => ['type' => GraphQL::type('NiveauHabiliteType')],

            'client_id'                          => ['type' => Type::int()],
            'client'                             => ['type' => GraphQL::type('ClientType')],

            'roles'                              => ['type' => Type::listOf(GraphQL::type('RoleType'))],

            'created_at_user'                    => ['type' => GraphQL::type('UserType')],
            'updated_at_user'                    => ['type' => GraphQL::type('UserType')],

            'created_at'                         => [ 'type' => Type::string()],
            'created_at_fr'                      => [ 'type' => Type::string()],
            'updated_at'                         => [ 'type' => Type::string()],
            'updated_at_fr'                      => [ 'type' => Type::string()],
            'deleted_at'                         => [ 'type' => Type::string()],
            'deleted_at_fr'                      => [ 'type' => Type::string()],
            'display_text'                       => [ 'type' => Type::string()],
            'nom'                                => [ 'type' => Type::string()],
        ];
    }
}
