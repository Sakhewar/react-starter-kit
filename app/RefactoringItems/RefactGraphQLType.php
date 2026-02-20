<?php

namespace App\RefactoringItems;

use App\Models\Outil;
use App\Traits\GraphQLDefaultFields;
use Carbon\Carbon;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\{Log};
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Arr;
use Rebing\GraphQL\Support\Type as GraphQLType;
use ReflectionClass;

abstract class RefactGraphQLType extends GraphQLType
{
    use GraphQLDefaultFields;

    protected $attributes = [];
    protected $column;

    public function __construct()
    {
        $this->resolveTypeName();
    }

    protected function resolveTypeName()
    {
        $ref = new ReflectionClass(get_called_class());
        $classname = $ref->getShortName();

        /**
         * Nom du type pagination
         */
        if (!isset($this->attributes['name']))
        {
            $this->attributes['name'] = $classname;
        }
    }

    /**
     * Renvoie les fields du type courant
     *
     * @return array
     */
    protected function resolveFields(): array
    {
        return [];
    }

    public function fields(): array
    {
        // Log::debug('here' . $this->attributes['name']);

        if (!str_contains($this->attributes['name'], 'Paginated'))
        {
            return $this->resolveFields();
        }

        $getGoodType = $this->attributes['name'];
        if (str_contains($getGoodType, 'spaginated'))
        {
            $getGoodType .= "Type";
        }
        $getGoodType = str_ireplace('spaginated', '', $getGoodType);
        $getGoodType = str_ireplace('paginated', '', $getGoodType);

        // dd(ucwords($getGoodType));
        return [
            'metadata' => [
                'type' => GraphQL::type('Metadata'),
                'resolve' => function ($root)
                {
                    return Arr::except($root->toArray(), ['data']);
                }
            ],
            'data' => [
                'type' => Type::listOf(GraphQL::type(ucwords($getGoodType))),
                'resolve' => function ($root)
                {
                    return $root;
                }
            ]
        ];
    }
}
