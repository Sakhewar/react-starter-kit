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
                    // [
                    //     'title'       => 'Pays',
                    //     'title_en'    => 'Countries',
                    //     'icon'        => 'Globe',
                    //     'description' => null,
                    //     'order'       => 1,
                    //     'link'        => '/provenance',
                    //     'permissions' => ['provenance'],
                    // ],
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
                        'title'       => 'Type De Fournisseurs',
                        'title_en'    => 'Supplier Types',
                        'icon'        => 'UsersRound',
                        'description' => null,
                        'order'       => 5,
                        'link'        => '/typefournisseur',
                        'permissions' => ['typefournisseur'],
                    ],
                    [
                        'title'       => 'Points de vente',
                        'title_en'    => 'Points of Sale',
                        'icon'        => 'Store',
                        'description' => null,
                        'order'       => 6,
                        'link'        => '/pointvente',
                        'permissions' => ['pointvente'],
                    ]
                ]
            ],
            [
                'title'       => 'Tiers',
                'title_en'    => 'Third Parties',
                'icon'        => 'Users',
                'description' => null,
                'order'       => 3,
                'mode_link'   => 'liste-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Clients',
                        'title_en'    => 'Customers',
                        'icon'        => 'Users',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/client',
                        'permissions' => ['client'],
                    ],
                    [
                        'title'       => 'Situation Compte Client',
                        'title_en'    => 'Customer Account Status',
                        'icon'        => 'UserCheck',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/compteclient',
                        'permissions' => ['client']
                    ],
                    [
                        'title'       => 'Fournisseurs',
                        'title_en'    => 'Suppliers',
                        'icon'        => 'Truck',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/fournisseur',
                        'permissions' => ['fournisseur'],
                    ],
                    [
                        'title'       => 'Situation Compte Fournisseur',
                        'title_en'    => 'Supplier Account Status',
                        'icon'        => 'UserCheck',
                        'description' => null,
                        'order'       => 4,
                        'link'        => '/comptefournisseur',
                        'permissions' => ['fournisseur']
                    ]
                ]
            ],
            [
                'title'       => 'Gestion des produits',
                'title_en'    => 'Products management',
                'icon'        => 'ShoppingBag',
                'description' => null,
                'order'       => 4,
                'mode_link'   => 'liste-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Familles de produits',
                        'title_en'    => 'Product Families',
                        'icon'        => 'Tag',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/familleproduit',
                        'permissions' => ['familleproduit'],
                    ],
                    [
                        'title'       => 'Marques',
                        'title_en'    => 'Brands',
                        'icon'        => 'Tag',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/marque',
                        'permissions' => ['marque'],
                    ],
                    [
                        'title'       => 'Liste des produits',
                        'title_en'    => 'Products List',
                        'icon'        => 'ShoppingBag',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/produit',
                        'permissions' => ['produit'],
                    ],

                ]
            ],
            [
                'title'       => 'Gestion Stock',
                'title_en'    => 'Stock Management',
                'icon'        => 'Archive',
                'description' => null,
                'order'       => 5,
                'mode_link'   => 'liste-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Entrées de stock',
                        'title_en'    => 'Stock Entries',
                        'icon'        => 'ArrowDownTray',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/entreestock',
                        'permissions' => ['entreestock'],
                    ],
                    [
                        'title'       => 'Sorties de stock',
                        'title_en'    => 'Stock Exits',
                        'icon'        => 'ArrowUpTray',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/sortiestock',
                        'permissions' => ['sortiestock'],
                    ],
                    [
                        'title'       => 'Inventaire',
                        'title_en'    => 'Inventory',
                        'icon'        => 'ListBullet',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/inventaire',
                        'permissions' => ['inventaire'],
                    ],
                    [
                        'title'       => 'Transferts de stock',
                        'title_en'    => 'Stock Transfers',
                        'icon'        => 'ArrowRightCircle',
                        'description' => null,
                        'order'       => 4,
                        'link'        => '/transfertstock',
                        'permissions' => ['transfertstock'],
                    ],
                    [
                        'title'       => 'Journal de stock',
                        'title_en'    => 'Stock Journal',
                        'icon'        => 'FileText',
                        'description' => null,
                        'order'       => 5,
                        'link'        => '/journalstock',
                        'permissions' => ['journalstock'],
                    ]
                ]
            ],
            [
                'title'       => 'POS',
                'title_en'    => 'POS',
                'icon'        => 'ShoppingCart',
                'description' => null,
                'order'       => 6,
                'mode_link'   => 'card-view',
                'modules'     => [],
                'pages'       => [
                    [
                        'title'       => 'Proformas',
                        'title_en'    => 'Proformas',
                        'icon'        => 'ShoppingBag',
                        'description' => null,
                        'order'       => 1,
                        'link'        => '/proforma',
                        'permissions' => ['proforma'],
                    ],
                    [
                        'title'       => 'Ventes',
                        'title_en'    => 'Sales',
                        'icon'        => 'ShoppingBag',
                        'description' => null,
                        'order'       => 2,
                        'link'        => '/vente',
                        'permissions' => ['vente'],
                    ],
                    [
                        'title'       => 'Retours',
                        'title_en'    => 'Returns',
                        'icon'        => 'CornerUpLeft',
                        'description' => null,
                        'order'       => 3,
                        'link'        => '/retour',
                        'permissions' => ['retour'],
                    ],
                    [
                        'title'       => 'Factures',
                        'title_en'    => 'Invoices',
                        'icon'        => 'DocumentText',
                        'description' => null,
                        'order'       => 4,
                        'link'        => '/facture',
                        'permissions' => ['facture'],
                    ],
                    [
                        'title'       =>  'Réglements',
                        'title_en'    => 'Payments',
                        'icon'        => 'CurrencyDollar',
                        'description' => null,
                        'order'       => 5,
                        'link'        => '/reglement',
                        'permissions' => ['reglement'],
                    ],

                ] 
            ],
            [
                'title'       => 'Outils Admin',
                'title_en'    => 'Admin Tools',
                'icon'        => 'UserStar',
                'description' => null,
                'order'       => 7,
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
                        'link'        => '/user',
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
            //['route_name' => 'typefournisseur', 'controller_name' => 'EntityType'],
        ];
        
        LinkRouteController::query()->forceDelete();

        foreach ($link_route_controllers as $item)
        {
            LinkRouteController::$functionCall(
                ['route_name' => $item['route_name']],
                ['controller_name' => $item['controller_name']]
            );
        }
    }
}