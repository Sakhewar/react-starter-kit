<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    App\Providers\GraphQLServiceProvider::class,
    \Rebing\GraphQL\GraphQLServiceProvider::class,
];
