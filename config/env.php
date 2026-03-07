<?php

return [

    /*
    |--------------------------------------------------------------------------
    | FICHIER DE CONFIGURATION DES VARIABLES D'ENVIRONNMENT
    |--------------------------------------------------------------------------
    |
    | Chaque fois qu'une variable est modifiée dans ce fichier, il faudra
    | faire à nouveau php artisan config:cache pour rendre la modification disponible.
    |
    */
    'APP_URL'                          => env('APP_URL', 'http://localhost:8000'),
    'APP_URL_BACK'                     => env('APP_URL_BACK', 'http://localhost:8000'),
    'FOLDER'                           => env('FOLDER', ''),
    'FRONT_URL'                        => env('FRONT_URL', ''),
    'MSG_ERROR'                        => env('MSG_ERROR', 'Contactez le support technique'),
    'PERMISSION_TRANSACTION'           => env('PERMISSION_TRANSACTION'),
    'APP_ERROR_API'                    => env('APP_ERROR_API', false),
    'APP_ENV_FOR'                      => env('APP_ENV_FOR', 'local'),

];
