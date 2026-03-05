<?php

namespace Database\Seeders;

use App\Models\{User, TypePermission, GroupePermission, GroupeTypePermission};
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionTableSeeder extends Seeder
{
    private $functionCall;

    public function __construct()
    {
        $this->functionCall = DatabaseSeeder::functionCall();
    }

    /**
     * Run the database seeders.
     *
     * @return void
     */
    public function run()
    {
        $groupePermissions =
        [
            [
                "name" => "Modalités de paiement",
                "tag" => "modalitepaiement",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des modalités de paiement"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer une modalité de paiement"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier une modalité de paiement"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer une modalité de paiement"),
                ],
            ],
            [
                "name" => "Modes de paiement",
                "tag" => "modepaiement",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des modes de paiement"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un mode de paiement"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un mode de paiement"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un mode de paiement"),
                ],
            ],
            [
                "name" => "Pays",
                "tag" => "pays",
                "permissions" =>
                [
                    //array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des types de conteneurs"),
                    //array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un type de conteneur"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un type de conteneur"),
                    //array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un type de conteneur"),
                ],
            ],
            [
                "name" => "Types de client",
                "tag" => "typeclient",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des types de client"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un type de client"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un type de client"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un type de client"),
                    array("name" => "detail" , "couleur" => "info" , "display_name" => "Voir les détails d'un type de client"),
                ],
            ],
            [
                "name" => "Clients",
                "tag" => "client",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des clients"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un client"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un client"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un client"),
                    array("name" => "detail" , "couleur" => "info" , "display_name" => "Voir les détails d'un client"),
                    array("name" => "statut" , "couleur" => "primary" , "display_name" => "Activer/Désactiver un client"),
                ],
            ],
            [
                "name" => "Fournisseurs",
                "tag" => "fournisseur",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des fournisseurs"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un fournisseur"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un fournisseur"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un fournisseur"),
                    array("name" => "detail" , "couleur" => "info" , "display_name" => "Voir les détails d'un fournisseur"),
                    array("name" => "statut" , "couleur" => "primary" , "display_name" => "Activer/Désactiver un fournisseur"),
                ],
            ],

            //DASHBOARD

            [
                "name" => "Dashboard",
                "tag" => "dashboard",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir le dashboard"),
                ],
            ],

            // OUTILS ADMIN
            [
                "name" => "Préferences",
                "tag" => "preference",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des préférences"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier les préférences un profil"),
                ],
            ],
            [
                "name" => "Profils",
                "tag" => "role",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des profils"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un profil"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un profil"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un profil"),
                ],
            ],
            [
                "name" => "Utilisateurs",
                "tag" => "user",
                "permissions" =>
                [
                    array("name" => "liste" , "couleur" => "primary" , "display_name" => "Voir la liste des utilisateurs"),
                    array("name" => "creation" , "couleur" => "success" , "display_name" => "Créer un utilisateur"),
                    array("name" => "modification" , "couleur" => "warning" , "display_name" => "Modifier un utilisateur"),
                    array("name" => "suppression" , "couleur" => "danger" , "display_name" => "Supprimer un utilisateur"),
                    array("name" => "statut" , "couleur" => "primary" , "display_name" => "Activer/Désactiver le compte d'un utilisateur"),
                    array("name" => "detail" , "couleur" => "info" , "display_name" => "Voir les détails d'un utilisateur")
                ],
            ]
        ];


        foreach ($groupePermissions as $groupePermission)
        {
            $getGroupePermission = GroupePermission::{$this->functionCall}([
                'tag' => $groupePermission['tag']
            ],
            [
                'name' => $groupePermission['name']
            ]);

            foreach ($groupePermission['permissions'] as $permission)
            {
                $typePermission = TypePermission::firstOrCreate([
                    'name' => $permission['name']
                ],
                [
                    'couleur' => $permission['couleur'] ?? "primary"
                ]);

                $namePermission = $permission['name'] . "-" . $getGroupePermission->tag;
                $newitem = Permission::where('name', $namePermission)->first();
                if (!isset($newitem))
                {
                    $newitem = new Permission();
                }
                $newitem->name = $namePermission;
                $newitem->display_name = $permission['display_name'];
                $newitem->type_permission_id = $typePermission->id;
                $newitem->groupe_permission_id = $getGroupePermission->id;
                $newitem->save();

            }
        }

        $permissions = [
        ];

        foreach ($permissions as $permission)
        {
            Permission::firstOrCreate([
                'name' => $permission['name']
            ],
            [
                'display_name' => $permission['name']
            ]);
        }


        /**
         * Roles / Profils
         */
        $superAdminRole = Role::firstOrCreate([
            'name' => 'super admin'
        ]);

        $superAdminRole->syncPermissions(Permission::all());




        /**
         * Utilisateurs
         */
        $users = array();
        array_push($users, array("name" => "Root", "email" => "root@osp.com", "image" => ('assets/media/logos/logo.svg'), "password" => "rootOSP@2026"));
        array_push($users, array("name" => "OSP", "email" => "sakh96@gmail.com", "image" => ('assets/media/logos/logo.svg'), "password" => "Passer123"));

        foreach ($users as $user)
        {
            $newitem = User::{$this->functionCall}([
                'email' => $user['email']
            ],
            [
                'name'      => $user['name'],
                'password'  => $user['password'],
                'image'     => $user['image'],
            ]);
            $newitem->syncRoles($superAdminRole);
        }
    }
}
