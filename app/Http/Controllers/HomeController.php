<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\{LinkRouteController, Module, Page, Outil};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class HomeController extends Controller
{
    /**
     * @var \Illuminate\Database\Eloquent\Collection
     */
    protected $modules;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
        $this->modules = Module::with(['modules', 'pages', 'mode_link'])->whereNull('module_id')->orderBy('order')->get();
    }

    public function getModules()
    {
        if (Auth::check())
        {
            $modules_access = array();
            foreach ($this->modules as $module)
            {
                $can_access = false;
                $pages_col = array();
                $all_pages_col = array();
                foreach($module->pages as $keyPage => $page)
                {
                    $modules_col = array();
                    foreach($module->modules as $keySubModule => $SubModule)
                    {
                        $can_access_sub_module = false;
                        $sub_pages_col = array();
                        $all_sub_pages_col = array();
                        foreach($SubModule->pages as $keySubPage => $subPage)
                        {
                            if (isset($subPage) && Outil::hasOnePermissionOf($subPage->permissions))
                            {
                                array_push($sub_pages_col, $subPage);
                                array_push($all_sub_pages_col, $subPage);
                                $can_access_sub_module = true;
                            }
                        }
                        if ($can_access_sub_module)
                        {
                            $SubModule['pages_col'] = $sub_pages_col;
                            $SubModule['all_pages_col'] = $all_sub_pages_col;
                            array_push($modules_col, $SubModule);
                        }
                    }

                    if (isset($page) && Outil::hasOnePermissionOf($page->permissions))
                    {
                        array_push($pages_col, $page);
                        array_push($all_pages_col, $page);
                        $can_access = true;
                    }
                }
                
                if ($can_access)
                {
                    $module['pages_col'] = $pages_col;
                    $module['all_pages_col'] = $all_pages_col;
                    $module['modules_col'] = $modules_col;

                    array_push($modules_access, $module);
                }
            }

            //dd($modules_access, $this->modules);
            $this->modules = $modules_access;
        }
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->getModules();
        $currentPath = request()->path();
        $currentPage = Page::where('link', '/'.$currentPath)->first();

        $breadcrumb = [];

        if ($currentPage)
        {
            $module = $currentPage->module;
            if ($module?->parent)
            {
                $breadcrumb[] = $module->parent->title;
            }

            if ($module)
            {
                $breadcrumb[] = $module->title;
            }

            $breadcrumb[] = $currentPage->title;
        }
        return Inertia::render('welcome', ["modules" => $this->getModules(), "breadcrumb" => $breadcrumb]);
    }

    public function renderPage(Request $request, string $namepage, string $prefixepermission = '')
    {
        $retour = [];

        // Pour récupérer les attrs balancés
        foreach (array_keys($request->all()) as $key)
        {
            $retour[$key] = $request->all()[$key];
        }

        $this->getModules();
        //dd($namepage, $this->modules);
        $getPage = empty($namepage) ? null : Page::where('link', Outil::getOperateurLikeDB(), "%/{$namepage}")->first();

     
        $authorized = $getPage && Outil::hasOnePermissionOf($getPage->permissions);

        
        if (!$authorized)
        {
            $namepage =empty($namepage) ? 'Welcome' : 'Unauthorized';
        }
        
        $breadcrumb = [];

        if ($getPage)
        {
            $module = $getPage->module;
            if ($module?->parent)
            {
                $breadcrumb[] = $module->parent->title;
            }

            if ($module)
            {
                $breadcrumb[] = $module->title;
            }

            $breadcrumb[] = $getPage->title;
        }

        $retour['prefixepermission']       = $prefixepermission;
        $retour['page']                    = $getPage;
        $retour['breadcrumb']              = $breadcrumb;
        $retour['active_link']             = "/" . $namepage;
        $retour['namepage']                = \Illuminate\Support\Str::studly($namepage);

        // Passer tout dans Inertia, layout unique
        return Inertia::render('MainEntry', $retour);
    }

    public function namepageOld(Request $request, $namepage, $prefixepermission = '')
    {
        $retour = [];

        // Pour récupérer les attrs balancés
        foreach (array_keys($request->all()) as $key)
        {
            $retour[$key] = $request->all()[$key];
        }

        $this->getModules();

        $viewName = "pages.unauthorized";
        $getPage = Page::where('link', Outil::getOperateurLikeDB(), "%{$namepage}")->first();
        if (isset($getPage) && Outil::hasOnePermissionOf($getPage->permissions))
        {
            $viewName = 'pages.' . $namepage;
        }

        if (!view()->exists($viewName))
        {
            $viewName = "pages.unauthorized";
        }

        if (str_contains($namepage, "detail") || str_contains($namepage, "sections"))
        {
            $viewName = 'pages.' . $namepage;
        }

        $retour['prefixepermission']       = $prefixepermission;
        $retour['modules']                 = $this->modules;
        $retour['page']                    = $getPage;
        //dd($viewName, $getPage);

        return view($viewName, $retour);
    }

    public function namepage(Request $request, $namepage, $prefixepermission = '')
    {
        $retour = [];


        foreach ($request->all() as $key => $value)
        {
            $retour[$key] = $value;
        }

        // Charger les modules
        $this->getModules();

        // Récupérer la page depuis la DB
        $getPage = Page::where('link', Outil::getOperateurLikeDB(), "%{$namepage}")->first();

        $component = 'Unauthorized';

        // Vérifier les permissions
        if (isset($getPage) && Outil::hasOnePermissionOf($getPage->permissions))
        {
            $component = \Illuminate\Support\Str::studly($namepage);

            if (str_contains($namepage, 'detail') || str_contains($namepage, 'sections'))
            {
                $component = \Illuminate\Support\Str::studly($namepage);
            }
        }

        // Ajouter le prefixepermission et modules aux props
        $retour['prefixepermission'] = $prefixepermission;
        $retour['modules']           = $this->modules;
        $retour['page']              = $getPage;

        
        return Inertia::render($component, $retour);
    }

    public function redirectToController($table_name, $methode = 'save', $id = null, \Illuminate\Http\Request $request)
    {
        $models = Outil::getAllClassesOf(['Http', 'Controllers']);
        $getController = preg_grep( "/" . preg_quote("\\{$table_name}Controller", "/") . "/i" , $models );
        if (count($getController) > 0)
        {
            $getController = array_values($getController)[0];
            $getController = explode('\\', $getController)[4];
        }
        else
        {
            $getController = LinkRouteController::whereRaw("LOWER(TRIM(route_name)) = LOWER(TRIM(?))", [$table_name])->first()->controller_name . "Controller";
        }

        dd("App\\Http\\Controllers\\{$getController}");

        return app()->make("App\\Http\\Controllers\\{$getController}")->callAction($methode, $parameters = array(isset($id) ? $id : $request));
    }

}

