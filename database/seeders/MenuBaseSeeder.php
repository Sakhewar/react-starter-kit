<?php

namespace Database\Seeders;

use App\Models\{LinkRouteController, ModeLink, Module, Page};
use Illuminate\Database\Seeder;

class MenuBaseSeeder extends Seeder
{
    private $modules;
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
        $functionCall = "updateOrCreate";
        if (config('app.env') === 'production')
        {
            $functionCall = "firstOrCreate";
        }

        $mode_links = array();
        array_push($mode_links, array("nom" => "liste-view", "description" => ""));
        array_push($mode_links, array("nom" => "liste-card", "description" => ""));
        array_push($mode_links, array("nom" => "card-view", "description" => ""));
        foreach ($mode_links as $item)
        {
            $new_mode_link = ModeLink::$functionCall([
                'nom' => $item['nom']
            ], [
                'description' => $item['description'],
            ]);
        }

        /**
         * Modules
         */
        $this->modules = [
            [
                "title"       => "Dashboard",
                "title_en"    => "Dashboard",
                "icon"        => "icon-dashboard",
                "description" => null,
                "order"       => 1,
                "mode_link"   => "card-view",
                "modules"     => [],
                "pages"       => [
                    [
                        "title"       => "Dashboard",
                        "title_en"    => "Dashboard",
                        "icon"        => "icon-dashboard",
                        "description" => null,
                        "order"       => 1,
                        "link"        => "#!/dashboard",
                        "permissions" => ["dashboard"],
                    ]
                ]
            ],
            [
                "title"       => "Backoffice",
                "title_en"    => "Backoffice",
                "icon"        => "icon-back-office",
                "description" => null,
                "order"       => 2,
                "mode_link"   => "liste-view",
                "pages"       => [

                    [
                        "title"       => "Pays",
                        "title_en"    => "Countries",
                        "icon"        => "icon-pays",
                        "description" => null,
                        "order"       => 1,
                        "link"        => "#!/list-pays",
                        "permissions" => ["pays"],
                    ],
                    [
                        "title"       => "Modalités de paiement",
                        "title_en"    => "Terms of payment",
                        "icon"        => "icon-modalitepaiement",
                        "description" => null,
                        "order"       => 2,
                        "link"        => "#!/list-modalitepaiement",
                        "permissions" => ["modalitepaiement"],
                    ],
                    [
                        "title"       => "Modes de paiement",
                        "title_en"    => "Methods of payment",
                        "icon"        => "icon-modepaiement",
                        "description" => null,
                        "order"       => 3,
                        "link"        => "#!/list-modepaiement",
                        "permissions" => ["modepaiement"],
                    ],
                    [
                        "title"       => "Type De Clients",
                        "title_en"    => "Customers",
                        "icon"        => "icon-typeclient",
                        "description" => null,
                        "order"       => 4,
                        "link"        => "#!/list-typeclient",
                        "permissions" => ["typeclient"],
                    ],
                    [
                        "title"       => "Clients",
                        "title_en"    => "Customers",
                        "icon"        => "icon-client",
                        "description" => null,
                        "order"       => 5,
                        "link"        => "#!/list-client",
                        "permissions" => ["client"],
                    ],
                    [
                        "title"       => "Fournisseurs",
                        "title_en"    => "Suppliers",
                        "icon"        => "icon-fournisseur",
                        "description" => null,
                        "order"       => 6,
                        "link"        => "#!/list-fournisseur",
                        "permissions" => ["fournisseur"],
                    ]
                ]
            ],
            [
                "title"       => "Outils Admin",
                "title_en"    => "Admin Tools",
                "icon"        => "icon-outil-admin",
                "description" => null,
                "order"       => 3,
                "mode_link"   => "card-view",
                "modules"     => [],
                "pages"       => [
                    [
                        "title"       => "Profils & Permissions",
                        "title_en"    => "Profiles & Permissions",
                        "icon"        => "icon-profil",
                        "description" => null,
                        "order"       => 1,
                        "link"        => "#!/list-profil",
                        "permissions" => ["role"],
                    ],
                    [
                        "title"       => "Gestion des utilisateurs",
                        "title_en"    => "Users management",
                        "icon"        => "icon-utilisateur",
                        "description" => null,
                        "order"       => 2,
                        "link"        => "#!/list-user",
                        "permissions" => ["user"],
                    ],
                    [
                        "title"       => "Liste des préférences",
                        "title_en"    => "Preferences list",
                        "icon"        => "icon-preference",
                        "description" => null,
                        "order"       => 3,
                        "link"        => "#!/list-preference",
                        "permissions" => ["preference"],
                    ],
                ]
            ]
        ];

        foreach ($this->modules as $module)
        {
            $new_module = Module::{$this->functionCall}([
                'icon' => $module['icon']
            ],
            [
                'title'          => $module['title'],
                'title_en'       => $module['title_en'],
                'icon'           => $module['icon'],
                'description'    => $module['description'],
                'order'          => $module['order'],
                'mode_link_id'   => isset($module['mode_link']) && ModeLink::where('nom', $module['mode_link'])->first() ? ModeLink::where('nom', $module['mode_link'])->first()->id : null,
            ]);

            if(isset($module['modules']))
            {

                foreach ($module['modules'] as $sub_module)
                {
                    $new_sub_module = Module::{$this->functionCall}([
                        'icon'      => $sub_module['icon'],
                        'module_id' => $new_module->id
                    ],
                    [
                        'module_id'      => $new_module->id,
                        'title'          => $sub_module['title'],
                        'title_en'       => $sub_module['title_en'],
                        'icon'           => $sub_module['icon'],
                        'description'    => $sub_module['description'],
                        'order'          => $sub_module['order'],
                    ]);

                    foreach ($sub_module['pages'] as $page)
                    {
                        $new_sub_page = Page::{$this->functionCall}([
                            'link' => $page['link']
                        ],
                        [
                            'module_id'      => $new_sub_module->id,
                            'title'          => $page['title'],
                            'title_en'       => $page['title_en'],
                            'icon'           => $page['icon'],
                            'description'    => $page['description'],
                            'order'          => $page['order'],
                            'link'           => $page['link'],
                            'permissions'    => $page['permissions'],
                        ]);
                    }
                }
            }

            foreach ($module['pages'] as $page)
            {
                $new_page = Page::{$this->functionCall}([
                    'link' => $page['link'],
                ],
                [
                    'module_id'      => $new_module->id,
                    'title'          => $page['title'],
                    'title_en'       => $page['title_en'],
                    'icon'           => $page['icon'],
                    'description'    => $page['description'],
                    'order'          => $page['order'],
                    'link'           => $page['link'],
                    'permissions'    => $page['permissions'],
                ]);
            }
        }



        // Les pages qui ne pourront pas être intégrées à des modules
        $link_route_controllers = [
            [
                "route_name"             => "soustypecotation",
                "controller_name"        => "TypeCotation"
            ],
            [
                "route_name"             => "souschapitrenomenclaturedouaniere",
                "controller_name"        => "ChapitreNomenclatureDouaniere"
            ],
        ];
        foreach ($link_route_controllers as $link_route_controller)
        {
            $new_link_route_controller = LinkRouteController::{$this->functionCall}([
                'route_name'            => $link_route_controller['route_name']
            ],
            [
                'controller_name'      => $link_route_controller['controller_name'],
            ]);
        }
    }
}
