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

    public function run()
    {
        Module::query()->forceDelete();
        Page::query()->forceDelete();

        $functionCall = "updateOrCreate";
        if (config('app.env') === 'production') {
            $functionCall = "firstOrCreate";
        }

        // Modes de liens (affichage : card / list / etc.)
        $mode_links = [
            ['nom' => 'liste-view', 'description' => 'Affichage en liste classique'],
            ['nom' => 'liste-card', 'description' => 'Affichage en cartes dans une liste'],
            ['nom' => 'card-view',  'description' => 'Affichage uniquement en cartes / dashboard'],
        ];

        foreach ($mode_links as $item) {
            ModeLink::$functionCall(
                ['nom' => $item['nom']],
                ['description' => $item['description']]
            );
        }

        // Modules + Pages (avec routes Inertia modernes et icônes Lucide)
        $this->modules = [
            [
                'title'       => 'Dashboard',
                'title_en'    => 'Dashboard',
                'icon'        => 'LayoutDashboard',
                'description' => null,
                'order'       => 1,
                'mode_link'   => 'card-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Dashboard',
                        'title_en'    => 'Dashboard',
                        'icon'        => 'LayoutDashboard',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/dashboard',
                        'permissions' => ['dashboard'],
                    ]
                ]
            ],
            [
                'title'         => 'Backoffice',
                'title_en'      => 'Backoffice',
                'icon'          => 'Settings2',
                'description'   => null,
                'order'         => 2,
                'mode_link'     => 'liste-view',
                'open_default'  => true,
                'pages'         => [
                    [
                        'title'       => 'Pays',
                        'title_en'    => 'Countries',
                        'icon'        => 'Globe',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/pays',
                        'permissions' => ['pays'],
                    ],
                    [
                        'title'       => 'Modalités de paiement',
                        'title_en'    => 'Terms of payment',
                        'icon'        => 'CalendarCheck',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/modalitepaiement',
                        'permissions' => ['modalitepaiement'],
                    ],
                    [
                        'title'       => 'Modes de paiement',
                        'title_en'    => 'Methods of payment',
                        'icon'        => 'CreditCard',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/modepaiement',
                        'permissions' => ['modepaiement'],
                    ],
                    [
                        'title'       => 'Type De Clients',
                        'title_en'    => 'Customer Types',
                        'icon'        => 'UsersRound',
                        'description' => null,
                        'order'       => 4,
                        'link'        => '/typeclient',
                        'permissions' => ['typeclient'],
                    ],
                    [
                        'title'       => 'Clients',
                        'title_en'    => 'Customers',
                        'icon'        => 'Users',
                        'description' => null,
                        'order'       => 5,
                        'link'        => '/client',
                        'permissions' => ['client'],
                    ],
                    [
                        'title'       => 'Fournisseurs',
                        'title_en'    => 'Suppliers',
                        'icon'        => 'Truck',
                        'description' => null,
                        'order'       => 6,
                        'link'        => '/fournisseur',
                        'permissions' => ['fournisseur'],
                    ]
                ]
            ],
            [
                'title'       => 'Outils Admin',
                'title_en'    => 'Admin Tools',
                'icon'        => 'UserStar',
                'description' => null,
                'order'       => 3,
                'mode_link'   => 'card-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Profils & Permissions',
                        'title_en'    => 'Profiles & Permissions',
                        'icon'        => 'ShieldCheck',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/role',
                        'permissions' => ['role'],
                    ],
                    [
                        'title'       => 'Utilisateurs',
                        'title_en'    => 'Users',
                        'icon'        => 'UserCog',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/users',
                        'permissions' => ['user'],
                    ],
                    [
                        'title'       => 'Préférences',
                        'title_en'    => 'Preferences',
                        'icon'        => 'Settings',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/preference',
                        'permissions' => ['preference'],
                    ],
                ]
            ]
        ];

        foreach ($this->modules as $module) {
            $new_module = Module::$functionCall(
                [
                    'title' => $module['title'],
                    'icon' => $module['icon']
                ],
                [
                    'title'        => $module['title'],
                    'title_en'     => $module['title_en'],
                    'icon'         => $module['icon'],
                    'description'  => $module['description'],
                    'order'        => $module['order'],
                    'open_default' => $module['open_default'] ?? false,
                    'mode_link_id' => ModeLink::where('nom', $module['mode_link'] ?? 'liste-view')->first()?->id,
                ]
            );

            // Sous-modules (s'il y en a)
            if (!empty($module['modules']))
            {
                foreach ($module['modules'] as $sub_module)
                {
                    $new_sub_module = Module::$functionCall(
                        ['icon' => $sub_module['icon'], 'module_id' => $new_module->id],
                        [
                            'module_id'   => $new_module->id,
                            'title'       => $sub_module['title'],
                            'title_en'    => $sub_module['title_en'],
                            'icon'        => $sub_module['icon'],
                            'description' => $sub_module['description'],
                            'order'       => $sub_module['order'],
                        ]
                    );

                    foreach ($sub_module['pages'] ?? [] as $page)
                    {
                        Page::$functionCall(
                            ['link' => $page['link']],
                            [
                                'module_id'   => $new_sub_module->id,
                                'title'       => $page['title'],
                                'title_en'    => $page['title_en'],
                                'icon'        => $page['icon'],
                                'description' => $page['description'],
                                'order'       => $page['order'],
                                'link'        => $page['link'],
                                'permissions' => $page['permissions'],
                            ]
                        );
                    }
                }
            }

            // Pages du module principal
            foreach ($module['pages'] as $page)
            {
                Page::$functionCall(
                    ['link' => $page['link']],
                    [
                        'module_id'   => $new_module->id,
                        'title'       => $page['title'],
                        'title_en'    => $page['title_en'],
                        'icon'        => $page['icon'],
                        'description' => $page['description'],
                        'order'       => $page['order'],
                        'link'        => $page['link'],
                        'permissions' => $page['permissions'],
                    ]
                );
            }
        }

        // LinkRouteController (inchangé sauf si tu veux renommer)
        $link_route_controllers = [
            //['route_name' => 'soustypecotation', 'controller_name' => 'TypeCotation'],
        ];

        foreach ($link_route_controllers as $item)
        {
            LinkRouteController::$functionCall(
                ['route_name' => $item['route_name']],
                ['controller_name' => $item['controller_name']]
            );
        }
    }
}