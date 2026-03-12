<?php

namespace App\Http\Controllers;

use App\Models\{Outil, LinkRouteController, Commande, Module, Page};
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ViewController extends Controller
{

    /**
     * Le root path du view
     *
     * @var string
     */
    protected $viewPath = '';



    public function __construct()
    {

    }

    public function redirectToController(Request $request, $table_name, $methode = 'save', $id = null)
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
            $linkRouterController = LinkRouteController::whereRaw("LOWER(TRIM(route_name)) = LOWER(TRIM(?))", [$table_name])->first();
            $getController = !isset($linkRouterController) ? null : $linkRouterController->controller_name . "Controller";
        }

        if (isset($getController))
        {
            return app()->make("App\\Http\\Controllers\\{$getController}")->callAction($methode, $parameters = array(isset($id) ? $id : $request));
        }
        else
        {
            $modelClass = "App\\Models\\" . Str::studly($table_name);

            if (class_exists($modelClass))
            {
                $instance = new $modelClass();
                $request['model_name'] = $instance::class;

                $controllerClass = new class extends EntityTypeController
                {
                    public function beforeInitControllerState():void
                    {
                        $this->model = $this->request->model_name;
                    }
                };

                if(isset($controllerClass))
                {
                    return $controllerClass->{$methode}();
                }
            }
        }
    }
}
