<?php

namespace App\Models;

use Spatie\Permission\Models\{Permission};

class GroupePermission extends Model
{
    // Cette fonction a été réécrit ici pour des besoins fonctionnels
    // pour restreindre l'utilisateur connecté à ne voir que ces permissions au moment
    // de la création d'un profil en ce sens
    // qu'il ne peut que créer un profil comme lui ou moins que lui
    public function permissions()
    {
        $relationShip = $this->hasMany(Permission::class)->orderBy('type_permission_id');
        if (auth()->check())
        {
            $user_id = auth()->user()->id;
            $relationShip->whereRaw("id in (select role_has_permissions.permission_id from model_has_roles, role_has_permissions where model_has_roles.model_id={$user_id} and model_has_roles.role_id=role_has_permissions.role_id)");
        }
        return $relationShip;
    }


}
