<?php

namespace App\Models;

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

    public static function getOperateurLikeDB()
    {
        return config('database.default') == "mysql" ? "like" : "ilike";
    }
}
