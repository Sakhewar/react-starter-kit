<?php

namespace App\Http\Middleware;

use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    protected  $modules;

    public function __construct()
    {
        $this->modules = Module::with(['modules', 'pages', 'mode_link'])->whereNull('module_id')->orderBy('order')->get();
    }

     protected function getModulesNew(array $modules, $user): array
    {
        if (!$user)
        {
            return [];
        }

        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        $filteredModules = [];

        foreach ($modules as $module)
        {
            $visiblePages = [];

            foreach ($module['pages'] ?? [] as $page)
            {
                $pagePermissions = $page['permissions'] ?? []; // ex: ['dashboard']

                $pageIsVisible = false;

                foreach ($pagePermissions as $requiredKeyword)
                {
                    foreach ($userPermissions as $userPerm)
                    {
                        if (stripos($userPerm, $requiredKeyword) !== false)
                        {
                            $pageIsVisible = true;
                        }
                    }
                }

                if ($pageIsVisible)
                {
                    $visiblePages[] = $page;
                }
            }

            // Module visible si au moins une page l'est
            if (!empty($visiblePages))
            {
                $moduleCopy = $module;
                $moduleCopy['pages'] = $visiblePages;
                $filteredModules[] = $moduleCopy;
            }
        }

        return $filteredModules;
    }
    public function share(Request $request): array
    {
        $filteredModules = $this->getModulesNew($this->modules->toArray(), $request->user());
        $rtr = [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? $request->user()->only('id', 'name', 'image') : null,
            ],
            'modules' => $filteredModules,
        ];
        return $rtr;
    }
}
