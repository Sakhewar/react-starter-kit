<?php

namespace App\GraphQL\Query;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Arr;

class UserQuery extends RefactGraphQLQuery
{
    public $attributes = [
        'name' => 'users',
        'description' => 'Retourne la liste des users',
    ];

    public function args(): array
    {
        return $this->addArgs([
            //ignoreInDB est mis a true pour eviter le traitement direct de l'attribut en base de donnei
            'role_id'                      => ['type' => Type::int(),'ignoreInDB' => true],

            'point_vente_id'               => ['type' => Type::int()],
            'client_id'                    => ['type' => Type::int()],
            'email'                        => ['type' => Type::string()],
        ]);
    }

    public function addQuery(Builder &$query, array &$args)
    {
        $query = $query->where('email', '!=', 'guindytechnology@gmail.com');

        if (isset($args['dashboard']))
        {
            $from = isset($args['date_start']) ? date($args['date_start']) : date('Y-m-d');
            $to = isset($args['date_end']) ? date($args['date_end']) : date('Y-m-d');

            $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
            $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

            $from = $from.' 00:00:00';
            $to = $to.' 23:59:59';

            $addQuery = "";
            if (isset($args['point_vente_id']))
            {
                $addQuery = "and point_vente_id = {$args['point_vente_id']}";
            }

            $query->selectRaw("users.* , (select coalesce(sum(es.total), 0) as ca_vendu from es where users.id=es.created_at_user_id and es.source='commande' and es.created_at >= ? and es.created_at <= ? $addQuery), (select coalesce(sum(es.total_remise), 0) as ca_remise from es where users.id=es.created_at_user_id and es.source='commande' and es.created_at >= ? and es.created_at <= ? $addQuery)", [$from,$to,$from,$to]);
            $query->whereRaw("(select coalesce(sum(es.total), 0) as ca_vendu from es where users.id=es.created_at_user_id and es.source='commande' and es.created_at >= ? and es.created_at <= ? $addQuery) > 0", [$from,$to]);
            $query->orderBy(Arr::get($args, 'sort', 'ca_vendu'), Arr::get($args, 'order', 'desc'));
        }
        if (isset($args['role_id']))
        {
            $role_id = $args['role_id'];

            $query = $query->whereHas('roles', function ($query) use ($role_id)
            {
                $query->where('roles.id', $role_id);
            });;
        }
    }
}
