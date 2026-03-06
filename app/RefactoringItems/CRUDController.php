<?php

namespace App\RefactoringItems;

use App\Exports\ModelExport;
use App\Models\{Outil, FileItem, Notif, NotifPermUser};
use Illuminate\Database\QueryException;
use ReflectionClass;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Events\SendNotifEvent;
use Illuminate\Routing\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\RefactoringItems\{CRUDModelNotFoundException};
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\{Auth, DB, Route, Schema, Validator};

abstract class CRUDController extends Controller
{
    use AuthorizesRequests;
    use DispatchesJobs;
    use ValidatesRequests;

    protected $relationsdelete;
    protected $relationsUpdateStatut;
    protected $job = null;


    /**
     * Permet de determiner si la requete entrante
     * est de type JSON
     *
     * @var boolean
     */
    protected $isAJAX = false;

    /**
     * Requete courante
     *
     * @var Illuminate\Http\Request
     */
    protected $request = null;

    /**
     * La table du modele
     *
     * @var string
     */
    protected $table = null;

    /**
     * Le nom du model
     * ei: Pour le model \App\Models\Produit le modelName sera Produit
     *
     * @var string
     */
    protected $modelName = null;

    /**
     * Le model instancié
     *
     * @var string
     */
    protected $model = null;

    /**
     * Pour import xls
     *
     * @var string
     */
    protected $modelImport = null;

    /**
     * Pour export xls
     *
     * @var string
     */
    protected $modelExportFilename = null;

    /**
     * Pour export xls
     *
     * @var string
     */
    protected $modelExport = ModelExport::class;

    /**
     * Le model instancié
     *
     * @var any
     */
    protected $modelId = null;

    /**
     * La valeur du model instancié
     *
     * @var any
     */
    protected $modelValue = null;

    /**
     * La valeur du model instancié
     *
     * @var any
     */
    protected $columStatut = 'status';

    /**
     * Le namespace ou est localise les model
     *
     * @var string
     */
    protected $modelNamespace = '\\App\\Models';

    /**
     * Le namespace ou est localise les model
     *
     * @var string
     */
    protected $jobNamespace = '\\App\\Jobs\\Imports';

    /**
     * Le namespace ou est localise les export
     *
     * @var string
     */
    protected $exportNamespace = '\\App\\Exports';

    /**
     * Le nom du query grapqQL
     *
     * @var string
     */
    protected $graphQLQueryName = null;

    /**
     * Les données liées au model
     *
     * @var arraymessage
     */
    protected $relations = [];

    /**
     * La liste des champs graphql
     * pour la reponse
     *
     * ei: id,nom,test{id,nom}
     * @var string
     */
    protected $graphQLResponseFields = null;

    public function __construct()
    {
        $this->initControllerState();
        // TODO: jacques à revoir pour la partie user depuis le web
        if (str_contains($this->getPath(), 'role')) // Prevent crash role user
        {
            auth()->setDefaultDriver('web'); // Utiliser pour la combinaison mobile & web users
            //Auth::shouldUse('web'); // Utiliser pour la combinaison mobile & web users
            //$this->app['auth']->setDefaultDriver('admin');
        }
        // dd(auth()->getDefaultDriver());
    }

    /**
     * Permet de creer un nouveau model
     * si aucun id n'est fournit
     * sinon fait une mise a jour
     *
     * @param Request $request
     * @return void
     */
    public function save()
    {
        $this->runChecks();

        if (isset($this->modelValue))
        {
            Validator::make($this->getUpdatingRules(), ['cant_updated' => 'can_update'])->validate();
        }

        return DB::transaction(function ()
        {
            $this->beforeValidateData();

            $dataValidated = $this->validateData();

            $this->beforeCRUDProcessing();


            //
            $model = $this->modelValue;


            $model->forceFill($dataValidated)->save();
            $model->refresh();
            // dd($model);
            if (!is_null($this->modelId)) // on fait une mise a jour
            {
                $this->afterUpdated($model);
            }
            else // On fait une creation
            {
                $this->modelId = $model->id;
                $this->afterCreated($model);
            }

            $this->afterCRUDProcessing($model);
            $model->save();

            $this->afterCRUD($model);

            $this->cleanFiles();

            if (isset($this->request->return_object))
            {
                return response()->json($model);
            }

            // dd("here", $this->getGraphQLResponse());
            return $this->getGraphQLResponse();
        });
    }

    /**
     * Recupere un model si un id est fourni
     * sinon une collection
     *
     * @return void
     */
    public function get()
    {
        $this->runChecks();

        if (is_null($this->modelId))
        {
            return $this->getGraphQLResponse(false);
        }

        return $this->getGraphQLResponse();
    }

    // Pour éffectuer certains controles avant le changement de staut
    public function beforeStatut(): void
    {

    }

    public function statut()
    {
        $this->runChecks();

        try
        {
            $this->beforeStatut();

            return DB::transaction(function ()
            {
                $errors = null;
                $data = 0;

                if (isset($this->modelValue))
                {
                    if (Schema::hasColumn($this->modelValue->getTable(), $this->columStatut))
                    {
                        $this->modelValue->{$this->columStatut} = $this->request->status;
                    }
                    $this->modelValue->save();
                    // dd('here', $this->columStatut);
                    if (!isset($errors))
                    {
                        $this->modelValue->save();

                        if (isset($this->relationsUpdateStatut))
                        {
                            // On ventile la modification du statut sur les relations filles au besoin
                            foreach ($this->relationsUpdateStatut as $relation)
                            {
                                $this->modelValue->{$relation}()->update([
                                    "{$this->columStatut}" => $this->modelValue->{$this->columStatut}
                                ]);
                            }
                        }

                    }
                }
                else
                {
                    $errors = "Cette donnée n'existe pas";
                }

                if (!isset($errors) && $this->modelValue->save())
                {
                    $data = 1;
                }

                $this->afterStatut($this->modelValue);

                $this->afterCRUD($this->modelValue);

                return response('{"data":' . $data . ', "errors": "' . $errors . '" }')->header('Content-Type', 'application/json');
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }

    public function afterStatut($model): void
    {

    }

    /**
     * Permet d'executer certaines operations avant la suppression
     *
     * @return void
     */
    public function beforeDelete(): void
    {
        
    }

    /**
     * Permet de supprimer un enregistrement
     *
     * @return void
     */
    public function delete()
    {
        $this->runChecks();

        Validator::make($this->getDeletingRules(), ['cant_delete' => 'can_delete'])->validate();

        try
        {
            return DB::transaction(function ()
            {
                $this->beforeDelete();
                
                $errors = [];
                $data = null;
                //dd($this->relationsdelete);

                $ids = explode(",", $this->modelId);

                $alaligne = "";
                foreach($ids as $key => $id)
                {
                    $this->modelValue = $this->model::find($id);
                    if (count($ids) > 1)
                    {
                        $alaligne = " => ligne n°" . ($key + 1);
                    }

                    if (isset($this->modelValue))
                    {
                        if (isset($this->relationsdelete))
                        {
                            foreach($this->relationsdelete as $onrelation)
                            {
                                if ((Str::of($onrelation)->endsWith('s') && isset($this->modelValue->$onrelation) && count($this->modelValue->$onrelation) > 0) || (!Str::of($onrelation)->endsWith('s') && isset($this->modelValue->$onrelation)))
                                {
                                    throw new \Exception("Impossible de supprimer une donnée qui a des liaisons du système {$alaligne}");
                                }
                            }
                        }
                        try
                        {
                            if (isset($this->reglegestions))
                            {
                                foreach($this->reglegestions as $onreglegestion)
                                {
                                    foreach($onreglegestion as $key=>$onreglevalue)
                                    {
                                        if (strtolower($this->modelValue->$key) == strtolower($onreglevalue))
                                        {
                                            throw new \Exception("Des règles de gestion existe sur cette donnée {$alaligne},<br/><strong>Vous ne pouvez pas la supprimer,</strong> <br/>Au besoin, contactez le support technique pour en savoir plus");
                                        }
                                    }
                                }
                            }
                            $this->modelValue->delete();
                            $this->modelValue->forceDelete();
                            $data = 1;
                            $this->afterDelete();
                            // Pour send la notif
                            // $queryName = Outil::getQueryNameOfModel($this->modelValue->getTable());
                            //Outil::publishEvent(['type' => substr($queryName, 0, (strlen($queryName) - 1)), 'delete' => true]);
                        }
                        catch (QueryException $e)
                        {
                            if (intval($e->errorInfo[1]) == 7)
                            {
                                throw new \Exception("Impossible de supprimer cette donnée {$alaligne}, verifier les liaisons");
                            }
                            else
                            {
                                throw new \Exception("Impossible de supprimer cette donnée {$alaligne}, verifier les liaisons");
                            }
                        }
                    }
                    else
                    {
                        throw new \Exception("Item introuvable {$alaligne}");
                    }
                }

                $retour = array(
                    'data'          => $data,
                );

                return response()->json($retour);
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }


    /**
     * Permet d'executer certaines operations après la CU d'un model
     *
     * @param Request $request
     * @return void
     */
    public function afterDelete(): void
    {
        Outil::publishEvent(['type' => substr($this->graphQLQueryName, 0, (strlen($this->graphQLQueryName) - 1)), 'delete' => true]);
    }



    /**
     * Permet d'export les donnees
     *
     * @return void
     */
    public function export()
    {
        $this->runChecks();

        $export = new $this->modelExport(
            $this->model::all(),
            $this->modelExportFilename
        );

        $filename = "{$this->table}-" . now()->format('d-m-Y') . ".xlsx";
        return Excel::download($export, $filename);
    }

    public function sendNotifImport($userId, &$filename)
    {
        $queryName = $this->graphQLQueryName ?? Outil::getQueryNameOfModel(app($this->model)->getTable());
        $generateLink = substr($queryName, 0, (strlen($queryName) - 1));
        // ENVOIE DE LA NOTIFICATION DE DEBUT
        $notif = new Notif();
        $notif->message = "<strong>L'import du fichier excel est en cours</strong>,<br>Vous serez notifié une fois le traitement terminé";
        $notif->link = "#!/list-{$generateLink}";
        $notif->save();

        $notifPermUser  = new NotifPermUser();
        $notifPermUser->notif_id = $notif->id;
        $namePermission = $this->permValidate ?? $generateLink;
        $notifPermUser->permission_id = Permission::where('name', "creation-{$namePermission}")->first()->id ?? null;
        $notifPermUser->user_id = $userId;
        $notifPermUser->save();

        $eventNotif = new SendNotifEvent($notifPermUser);
        event($eventNotif);

        $files = $this->request->file();
        $file = array_shift($files);
        $extension = $file->extension();
        $from = storage_path("app/uploads/{$queryName}/{$userId}/");
        $to = "upload.{$extension}";

        //dd("test",$from, $to, $file->storeAs($from, $to));
        $file = $file->storeAs($from, $to);
        $requestSend = $this->request->except('file');

        $fileToexport = "{$this->exportNamespace}\\" .  ucfirst("blankExport") . "FeuilleExport";

        $refl = new ReflectionClass($fileToexport);
        $this->feuilleExport = $refl->getName();

        $this->dispatch((new $this->job(get_called_class(), $this->model, $generateLink, $file, $userId, $from.$to, $requestSend)));
    }

    public function beforeFeuille(): void
    {
        //
    }

    // Pour exporter la feuille export correspondant au modal
    public function feuille()
    {
        //Appeller cette fonction avant de tirer la feuille
        $this->beforeFeuille();
        $fileToexport = "{$this->exportNamespace}\\" .  ucfirst("blankExport") . "FeuilleExport";

        $refl = new ReflectionClass($fileToexport);
        $this->feuilleExport = $refl->getName();
        return Excel::download(new $this->feuilleExport($this->model), "{$this->modelName}.xlsx");
    }

    /**
     * Permet d'executer certain operation avant
     * le check de la validation
     *
     * @param Request $request
     * @return void
     */
    public function beforeImport(): void
    {
        //
    }

    public function import(Request $request)
    {
        $this->runChecks();

        try
        {
            $this->beforeImport();

            $errors = null;
            $data = 0;
            //dd($this->job);
            if (!isset($this->job))
            {
                $errors = "L'import sur ce type de donnée n'a pas été configuré dans le système";
            }
            else
            {
                if (empty($request->file('file')))
                {
                    $errors ='Un fichier Excel est requis';
                }
                if($request->hasFile('file'))
                {
                    $filename = request()->file('file');
                    $extension = pathinfo($filename->getClientOriginalName(), PATHINFO_EXTENSION);
                    if ($extension == "xlsx" || $extension == "xls" || $extension == "csv")
                    {
                        $data = Excel::toArray(null, $filename);
                        $data = $data[0]; // 0 => à la feuille 1

                        if (count($data) < 2)
                        {
                            $errors = "Le fichier ne doit pas être vide";
                        }
                        else
                        {
                            $userId = Auth::user()->id;
                            if (file_exists(storage_path('app/uploads')."/" . Outil::getQueryNameOfModel(app($this->model)->getTable()) . "/{$userId}/upload.{$extension}"))
                            {
                                // $this->sendNotifImport($userId, $filename);
                                $errors = "Un fichier est déjà en cours d'upload, merci de patienter, la fin de celui-ci";
                            }
                            else
                            {
                                $this->sendNotifImport($userId, $filename);
                            }
                        }
                    }
                }
            }

            if (isset($errors))
            {

                throw new \Exception($errors);
            }
            $data = 1;

            return response()->json(
                array(
                    "data" => $data,
                    "message" => "Le fichier est en cours de traitement..."
                )
            );
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }

    /**
     * Permet d'importer des donnees excel
     *
     * @param Request $request
     * @return void
     */
    /*public function import(Request $request)
    {
        $this->runChecks();

        $files = $request->file();
        $file = array_shift($files);
        $ext = $file->extension();

        if (is_null($file)) {
            throw new Exception("Assurez vous de fournir un fichier!");
        }

        if (!in_array($ext, ['xlsx', 'xls', 'csv'])) {
            throw new Exception("Le format du fichier est incorrect!");
        }

        $path = $file->storePubliclyAs('uploads', "excel.{$ext}");

        return response()->json(['message' => 'Importation éffectuée avec succés']);

        //dd('tester');

        if (!is_null($this->modelImport)) {
            $path = $file->storePubliclyAs('uploads', "excel.{$ext}");
            //$this->handleImport($path);

            return response()->json(['message' => 'Importation éffectuée avec succés']);
        } else {
            throw new Exception("L'option d'importation n'existe pas pour ce model");
        }

        throw new Exception("L'importation est impossible pour les " . $this->table);
    }*/

    // /**
    //  * Initialise le job et la notification
    //  *
    //  * @param string $filePath
    //  * @return void
    //  */
    // public function handleImport($filePath)
    // {
    //     $modelName = strtolower($this->modelName);
    //     $userId = optional(auth()->user())->id ?? 1;

    //     $notif = new Notification();
    //     $notif->message = "<strong>L'import du fichier excel est en cours</strong>,<br>Vous serez notifié une fois le traitement terminé";
    //     $notif->link = "#!/list-" . strtolower($modelName);
    //     $notif->save();

    //     $notifPermission  = new NotificationPermission();
    //     $notifPermission->notification_id = $notif->id;
    //     $permissionCreation = Permission::where('name', "creation-{$this->table}")->first();
    //     //$notifPermission->permission_id = $permissionCreation ? $permissionCreation->id : null;
    //     $notifPermission->permission_id  = 1;
    //     $notifPermission->user_id = $userId;
    //     $notifPermission->save();

    //     event(new NotificationEvent($notifPermission));
    //     ImportJob::dispatch($filePath, $this->modelImport, $notif, $userId, $this->table);
    // }

    /**
     * Permet de generer un qrCode
     *
     * @param Request $request
     * @return void
     */
    public function getQrCode(Request $request)
    {
        //
    }

    /**
     * Permet d'executer certain operation avant
     * le check de la validation
     *
     * @param Request $request
     * @return void
     */
    public function beforeValidateData(): void
    {
        //
    }

    /**
     * Permet d'executer certain operation avant
     * la creation ou la mise a jour d'un modele
     *
     * @param Request $request
     * @return void
     */
    public function beforeCRUDProcessing(): void
    {
        //
    }

    /**
     * Permet d'executer certaines operations après la CU d'un model
     *
     * @param Request $request
     * @return void
     */
    public function afterCRUDProcessing(&$model): void
    {
        //
    }

    /**
     * Permet d'executer certaines operations après la CU d'un model
     *
     * @param Request $request
     * @return void
     */
    public function afterCRUD(&$model): void
    {
        Outil::publishEvent(['type' => substr($this->graphQLQueryName, 0, (strlen($this->graphQLQueryName) - 1)), 'add' => true]);
    }

    /**
     * Permet d'executer certaines operations après la CU d'un model
     *
     * @param Request $request
     * @return void
     */
    public function afterStaut(&$model): void
    {

    }

    /**
     * Et lancer une fois qu'un model est cree
     *
     * @param [type] $model
     * @return void
     */
    public function afterCreated(&$model): void
    {
        //
    }

    /**
     * Et lancer une fois qu'un model est mise a jour
     *
     * @param [type] $model
     * @return void
     */
    public function afterUpdated(&$model): void
    {
        //
    }

    /**
     * Donnes l'utilisateur connecté
     *
     * @return void
     */
    public function user()
    {
        return auth()->user();
    }

    public function getPath()
    {
        return str_ireplace('api/', '', $this->request->path());
    }

    protected function cleanFiles()
    {
        foreach (array_keys($this->request->all()) as $key)
        {
            if (Str::endsWith($key, 'erase') && isset($this->request->{$key}))
            {
                $name = str_ireplace('_erase', '', $key);

                // Media::where('name', $name)->delete();
            }
        }
    }

    /**
     * Renvoie les rules de validation
     *
     * @return array
     */
    protected function getValidationRules(): array
    {
        return [];
    }

    /**
     * Renvoie les rules de suppression
     *
     * @return array
     */
    protected function getDeletingRules(): array
    {
        return [];
    }

    /**
     * Renvoie les rules de modification
     *
     * @return array
     */
    protected function getUpdatingRules(): array
    {
        return [];
    }

    protected function getCustomValidationMessage(): array
    {
        $model = str_ireplace('-', ' ', Str::kebab($this->modelName));
        return [
            "*.unique"  => "{$model} existe déja"
        ];
    }

    /**
     * Permet de recuperer une reponse graphql
     *
     * @return void
     */
    protected function getGraphQLResponse(bool $single = true)
    {
        return getGraphQLResponse($this->graphQLQueryName, $this->graphQLResponseFields, $single ? ['id' => $this->modelId] : []);
    }

    /**
     * Permet d'executer certain operation avant
     * le check de la validation
     *
     * @return void
     */
    public function beforeInitControllerState(): void
    {
        //
    }

    public function setModelValueFromExcel($getObject)
    {
        if (isset($getObject))
        {
            $this->request['id']        = $getObject->id;
            $this->modelId              = $getObject->id;
            $this->modelValue           = $getObject;
        }
    }
    /**
     * Permet de populer les attribute de classe
     *
     * @return void
     */
    private function initControllerState()
    {
        /**
         * Permet d'enregistrer la requete au niveau de l'instance
         */
        //   dd(request());
        $this->request = request();

        $this->beforeInitControllerState();

        $ref = new ReflectionClass(get_called_class());
        $routeParams = optional(Route::current())->parameters() ?? [];

        if (request()->wantsJson())
        {
            $this->isAJAX = true;
        }

        if (is_null($this->modelName))
        {
            $this->modelName = str_ireplace('Controller', '', $ref->getShortName());
        }

        /**k
         * Recuperer le class du model a CRUD depuis
         * le nom de classe si ce dernier n'est pas fournit
         */
        if (is_null($this->model))
        {
            try
            {
                $refl = new ReflectionClass("{$this->modelNamespace}\\" .  ucfirst($this->modelName));
                $this->model = $refl->getName();
            } catch (\Exception $e) {}
        }


        if (isset($this->request->from_excel))
        {
            $getObject                  = $this->model::query();

            $can = false;
            foreach($this->model::$columnsExport as $columnsExport)
            {
                if (isset($columnsExport['column_unique']) && $columnsExport['column_unique'])
                {
                    $can = true;
                    $getObject->whereRaw("TRIM(lower({$columnsExport['column_db']})) = TRIM(lower(?))", [$this->request[$columnsExport['column_db']]]);
                }
            }

            if ($can)
            {
                $getObject                  = $getObject->first();
                if (isset($getObject))
                {
                    $this->request['id']        = $getObject->id;
                }
            }
        }

        /**
         * Recupere le id
         */
        $this->modelId = $this->request->input('id') ?: (isset($routeParams['id']) ? $routeParams['id'] : null);


        /**k
         * Recuperer le class du model a CRUD depuis
         * le nom de classe si ce dernier n'est pas fournit
         */
        if (is_null($this->job))
        {
            try
            {
                $refl = new ReflectionClass("{$this->jobNamespace}\\Import" .  ucfirst($this->modelName) . "FileJob");
                $this->job = $refl->getName();
            }
            catch (\Exception $e)
            {
                if (!class_exists($this->job))
                {
                    $refl = new ReflectionClass("{$this->jobNamespace}\\ImportDefaultFileJob");
                    $this->job = $refl->getName();
                }
            }
        }

        /**
         * Permet de recuperer la table du model CRUD
         */
        if (is_null($this->table) && !is_null($this->model))
        {
            $this->table = (new $this->model())->getTable();
        }

        /**
         * Recupere la classe qui gere l'importation
         */
        if (is_null($this->modelImport))
        {
            try
            {
                $refl = new ReflectionClass("App\\Imports\\" . ucfirst($this->modelName) . "Import");
                $this->modelImport = $refl->getName();
            } catch (\Exception $e) {}
        }

        /**
         * Recupere la classe qui gere l'exportation
         */
        if (is_null($this->modelExportFilename))
        {
            $path = resource_path("views/exports/{$this->table}.blade.php");

            if (file_exists($path))
            {
                $this->modelExportFilename = $this->table;
            }
        }

        /**
         * Auto defini le graphQLQueryName
         * si null
         */
        if (is_null($this->graphQLQueryName))
        {
            $this->graphQLQueryName = str_replace('_', '', $this->table);
        }

        if (is_null($this->graphQLResponseFields))
        {
            $this->graphQLResponseFields = 'id';
        }

        // dd("{$this->modelNamespace}\\" .  ucfirst($this->modelName), $this->model);

        if (is_null($this->modelId))
        {
            $this->modelValue = new $this->model();
        }
        else
        {
            if (is_numeric($this->modelId))
            {
                $this->modelValue = $this->model::findOrFail($this->modelId);
            }
            else // Pour permettre de gérer les ids multiples lors de la suppression multiple
            {
                $this->modelValue = $this->model::whereRaw("id in ({$this->modelId})")->get();
            }
        }
    }

    /**
     * Permet de faire les verifications necessaire
     * avant de lancer une operation
     *
     * @return void
     */
    protected function runChecks(): void
    {
        if (is_null($this->model))
        {
            throw new CRUDModelNotFoundException();
        }
    }

    /**
     * Permet de valider les inputs user
     *
     * @return array
     */
    protected function validateData(): array
    {
        if (isset($this->request->from_excel))
        {
            $validator = Validator::make($this->request->all(), $this->getValidationRules(), $this->getCustomValidationMessage());
            if ($validator->fails())
            {
                throw new \Exception($validator->errors()->first());
            }
        }
        else
        {
            $this->request->validate($this->getValidationRules(), $this->getCustomValidationMessage());
        }

        // dd('good');

        $dataValidated = $this->request->all();

        $dataValidated = collect($dataValidated)->except(['id', 'signature']);
        $dataValidated = arrayWithOnly($dataValidated, $this->model);

        return $dataValidated;
    }


    /**
     * Permet de faire les verifications necessaire
     * avant de lancer une operation
     *
     * @return void
     */
    protected function attachFileToItem($value, array $columnNme, $foreignKParentItem, $foreignKItem, array $lastArray): void
    {
        $files = $this->request->file();

        //dd($value);
        if (isset($value["files"]))
        {
            $allfiles = FileItem::query();
            foreach ($columnNme as $key => $val)
            {
                $allfiles = $allfiles->where($key, $val);
            }
            $allfiles_check = clone $allfiles;


            $allfiles = $allfiles->get();
            $newfiles = $value["files"];
            if ($allfiles && isset($this->request->id))
            {
                Outil::Checkdetail($allfiles, $value["files"], FileItem::class, ['name']);
            }

            // dd($allfiles_check->get(), $files);
            foreach ($value["files"] as $cle => $valeur)
            {
                if (isset($valeur['erase']))
                {
                    FileItem::where($foreignKParentItem, $this->modelValue->id)->where('name', $valeur['erase'])->forceDelete();
                }

                foreach ($files as $skey => $svalue)
                {
                    if ($skey == $valeur['name'])
                    {
                        Outil::uploadMultiFilesToModel(FileItem::class, $foreignKParentItem, $this->request, $this->modelValue, $skey, $lastArray);
                    }
                }
            }
        }
    }
}
