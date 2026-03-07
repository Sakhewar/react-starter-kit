<?php

namespace App\GraphQL\Type;

use App\Models\Outil;
use App\RefactoringItems\RefactGraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;

class PageType extends RefactGraphQLType
{
    public function resolveFields(): array
    {
        return [
            'id'                   => ['type' => Type::int()],

            'title'                => ['type' => Type::string()],
            'libelle'              => ['type' => Type::string(), 'alias' => "title"],
            'icon'                 => ['type' => Type::string()],
            'description'          => ['type' => Type::string()],
            'order'                => ['type' => Type::int()],
            'link'                 => ['type' => Type::string()],
            'can_be_managed'       => ['type' => Type::boolean()],

            'module_id'            => ['type' => Type::int()],
            'permissions'          => ['type' => Type::string()],

            'created_at'           => ['type' => Type::string()],
            'created_at_fr'        => ['type' => Type::string()],
            'updated_at'           => ['type' => Type::string()],


            'image'                => ['type' => Type::string()],



        ];
    }

    protected function resolvePermissionsField($root, $args)
    {
        return json_encode($root['permissions']);
    }

    public function resolveImageField($root, $args)
    {
        return Outil::resolveImageField("uploads/icons/{$root['icon']}.svg");
    }
}
