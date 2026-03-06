<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Permission\Models\Permission;

class Outil extends Model
{
    public static function listenerUsers(&$table, $add = true)
    {
        if ($add)
        {
            $table->foreignId('created_at_user_id')->nullable()->constrained('users');
            $table->foreignId('updated_at_user_id')->nullable()->constrained('users');
        }
        else
        {
            $table->dropConstrainedForeignId('created_at_user_id');
            $table->dropConstrainedForeignId('updated_at_user_id');
        }
    }

    public static function hasOnePermissionOf(array $models)
    {
        $user = auth()->user();
        if (!$user)
        {
            return false;
        }

        $permissions = collect();

        if (count($models) > 0)
        {
            $permissions = Permission::whereNotNull('display_name')
                ->where(function ($query) use ($models) {
                    foreach ($models as $model)
                    {
                        $query->orWhere('name', 'like', "%{$model}%");
                    }
                })
                ->pluck('name');
        }
        
        // Aucun modèle => pas de restriction
        if ($permissions->isEmpty())
        {
            return true;
        }

        // Vérifie si l'utilisateur a au moins une permission correspondante
        foreach ($permissions as $permissionName)
        {
            if ($user->can($permissionName))
            {
                return true;
            }
        }

        return false;
    }

    public static function getAllClassesOf(array $directories)
    {
        $profondeur = "";
        $profondeur_2 = "";
        foreach ($directories as $directory)
        {
            $profondeur .= "{$directory}/";
            $profondeur_2 .= "\\{$directory}";
        }

        $classPaths = glob(app_path() . "/{$profondeur}*.php");

        $classes = array();
        $namespace = "App{$profondeur_2}\\";
        foreach ($classPaths as $classPath)
        {
            $segments = explode('/', $classPath);
            $classes[] = "\\". str_replace('.php', '', ($namespace . end($segments)));
        }
        return $classes;
    }

    public static function addWhereToModel(&$query, $args, $filtres)
    {
        foreach ($filtres as $key => $value)
        {
            if (isset($args[$value[0]]) || ($value[1]=='date' && isset($args[$value[0].'_start'])))
            {
                $operator = $value[1];
                $valueColumn = isset($args[$value[0]]) ? $args[$value[0]] : null;
                if ($operator == 'join')
                {
                    $second = $value[2];
                    $query->whereRaw("{$second}_id in (select id from {$second}s where {$value[0]}=?)", [$valueColumn]);
                }
                else if ($operator == 'date')
                {
                    if (isset($args[$value[0].'_start']) && isset($args[$value[0].'_end']))
                    {
                        // Si la colonne est précisée, on utilise la colonne, sinon, on match avec la colonne date
                        $column = isset($value[2]) ? $value[2] : "date";

                        $from = $args[$value[0].'_start'];
                        $to = $args[$value[0].'_end'];

                        //dd($to);
                        // Eventuellement la date fr
                        $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
                        $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

                        $from = date($from.' 00:00:00');
                        $to = date($to.' 23:59:59');
                        $query->whereBetween($column, array($from, $to));
                    }
                }
                else
                {
                    if ($operator == 'like')
                    {
                        $operator = self::getOperateurLikeDB();
                        $valueColumn = '%' . $valueColumn . '%';
                    }
                    $query->where($value[0], $operator, $valueColumn);
                }
            }
        }
    }

    public static function getOperateurLikeDB()
    {
        return config('database.default') == "mysql" ? "like" : "ilike";
    }
}
