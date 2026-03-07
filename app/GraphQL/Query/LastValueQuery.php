<?php

namespace App\GraphQL\Query;

use App\RefactoringItems\RefactGraphQLQuery;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\{DB};

class LastValueQuery extends RefactGraphQLQuery
{
    public function args(): array
    {
        return $this->addArgs([
            'model'                      => ['type' => Type::string()],
            'type_value'                 => ['type' => Type::int()],
        ]);
    }

    public $attributes = [
        'name' => 'lastvalue',
        'description' => 'Retourne la liste des pages',
    ];
    public function resolve($root, $args)
    {
        $value = null;
        if (isset($args['model']))
        {

            if ($args['model']=="ordretransits")
            {
                $args['model'] = "ordre_transits";
            }

            try
            {

                $val = DB::select(DB::raw("select pg_sequence_last_value(pg_get_serial_sequence('{$args['model']}', 'id')) as result;")) ;
                $value = $val[0]->result;
            }
            catch (\Exception $e)
            {

            }
        }
        // TOOD; continuer le changement pour l'upload des fichiers
        //

        return [
            [
                'value' => $value
            ]
        ];
    }
}
