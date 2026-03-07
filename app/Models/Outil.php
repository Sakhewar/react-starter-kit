<?php

namespace App\Models;

use App\Events\RtEvent;
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

    public static function getCurrentEnv()
    {
        return config('env.APP_ENV_FOR');
    }

    public static function getAPI()
    {
        return config('env.APP_URL_BACK');
    }

    public static function getMsgError()
    {
        return config('env.MSG_ERROR');
    }

    public static function getResponseError(\Exception $e)
    {
        return response()->json(array(
            'errors'          => [$e->getCode() == 0 ? $e->getMessage() : config('env.MSG_ERROR')],
            'errors_debug'    => [$e->getMessage()],
            'errors_line'     => [$e->getLine()],
            'errors_trace'    => [$e->getTrace()],
        ));
    }

    // Format Date
    public static function formatDate($fr = false, $optionals = ['getSeparator' => false, 'withHours' => true])
    {

        if (!isset($optionals['getSeparator']) || !$optionals['getSeparator']) {
            return ($fr ? "d/m/Y" : "Y-m-d") . (!isset($optionals['withHours']) || $optionals['withHours'] ? " H:i:s" : "");
        } else {
            return "/";
        }
    }

    // Format Price
    public static function formatWithThousandSeparator($valeur)
    {
        return number_format($valeur, 0, '.', ' ');
    }

    public static function resolveImageField($image, $elseDefault = true)
    {
        if (!isset($image))
        {
            if ($elseDefault)
            {
                $image = "/assets/images/upload.jpg";
            }
        } else {
            if (!str_contains($image, "?date")) {
                // In the event that an image exists in the database, in versioning
                $image = $image . '?date=' . (date('Y-m-d H:i'));
            }
        }

        if (isset($image) && !str_contains($image, "http")) {
            return self::getAPI() . $image;
        }

        return $image;
    }

    public static function publishEvent($data)
    {
        $eventRT = new RtEvent($data);
        event($eventRT);
    }
}
