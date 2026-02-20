<?php

namespace App\RefactoringItems;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\{Events\SendNotifEvent };
use App\Gestions\PhotoGestionInterface;
use Illuminate\Support\Facades\Schema;
use App\Http\Controllers\Controller;
use App\Models\{
    Devise,
    NotifPermUser,
    Notif,
    Outil,
    PointBingo,
    TypeCotation,
    TypePrestation,
};
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class SaveModelController extends Controller
{
    protected $queryName;
    protected $model;
    protected $job;
    protected $relationToDelete;
    protected $reglegestions;


    //*******ENREGISTREMENT DES ELEMENTS DU BACKOFFICE ************************************* */


    public function __construct(PhotoGestionInterface $photogestion)
    {
        $this->photogestion = $photogestion;
    }
    public function save(Request $request )
    {
        //dd($request->all());
        try
        {
            return DB::transaction(function ()use($request)
            {
                $errors     = null;
                $classe     = app($this->model)->getTable();
                $item       = new $this->model();


                if (isset($request->id))
                {
                    $item = app($this->model)::find($request->id);
                    if (!isset($item))
                    {
                        $errors = " l'item que vous tentez de modifier n'existe pas dans le système ";
                        throw new \Exception($errors);
                    }
                    else if(isset($this->reglegestions))
                    {
                        foreach($this->reglegestions as $onreglegestion)
                        {
                            foreach($onreglegestion as $key=>$onreglevalue)
                            {
                                if (strtolower($item->$key) == strtolower($onreglevalue))
                                {
                                    if($classe=='devises')
                                    {
                                      $errors = "Impossible de modifier une devise de base";
                                    }
                                    else
                                    {
                                      $errors = "Des règles de gestion existe sur cette donnée,<br/><strong>Vous ne pouvez pas la modifier,</strong> <br/>Au besoin, contactez le support technique pour en savoir plus";
                                    }
                                    throw new \Exception($errors);
                                }
                            }
                        }
                    }
                }
                if (Schema::hasColumn($classe, 'nom'))
                {

                    if($classe=='type_cotations')
                    {
                        !Outil::isUnique(['nom', 'type_cotation_id'], [strtolower($request->nom), $request->type_cotation_id], $request->id, $this->model) ?
                        $errors =  __('customlang.type_cotation_id'):$item->nom = strtolower($request->nom);
                    }
                    else
                    {
                        !Outil::isUnique(['nom'], [strtolower($request->nom)], $request->id, $this->model)?
                        $errors = __('customlang.nom_already'): $item->nom = strtolower($request->nom);
                    }
                }
                if (Schema::hasColumn($classe,'type_cotation_id'))
                    {
                        if (!isset($request->type_cotation_id) && $classe !='type_cotations')
                        {
                            $errors = "Veuillez definir le type de cotation ";
                        }
                        else
                        {
                            $item->type_cotation_id = null;
                            if (isset($request->type_cotation_id))
                            {
                                $typecotation         = TypeCotation::find($request->type_cotation_id);
                                if (!isset($typecotation))
                                {
                                    $errors = "Ce type de cotation n'existe pas dans le système";
                                }
                                else
                                {
                                    $item->type_cotation_id = $typecotation->id;
                                }
                            }
                        }
                    }
                if(Schema::hasColumn($classe,'nbre_jour') )
                  {
                      if((isset($request->nbre_jour) &&  !is_numeric($request->nbre_jour) &&  $request->nbre_jour < 1 ) )
                      {
                          $errors = "le nombre de jour doit etre supperieur a 0 ";
                      }
                      else
                      {
                          $item->nbre_jour = $request->nbre_jour;
                      }
                }
                if(Schema::hasColumn($classe, 'taux_change') )
                {
                    if(isset($request->taux_change ) && $request->taux_change  < 0 || !isset($request->taux_change ) )
                    {
                        $errors = __('customlang.taux_change_negatif');
                    }
                    else
                    {
                        $item->taux_change = $request->taux_change;
                    }
                }
                if(Schema::hasColumn($classe,'signe') )
                {
                    if(!isset($request->signe ) )
                    {
                        $errors = __('customlang.signe_required');
                    }
                    else
                    {
                        $item->signe = $request->signe;
                    }
                }
                if(Schema::hasColumn($classe, 'par_defaut') )
                {
                    $pardefaut =Outil::donneValeurCheckbox($request->pardefaut);
                    if($pardefaut == 1)
                    {
                        !Outil::isUnique(['par_defaut'], [strtolower(Outil::donneValeurCheckbox($request->pardefaut))], $request->id, $this->model)?
                        $errors = __('customlang.devise_par_defaut'): $item->par_defaut = Outil::donneValeurCheckbox($request->pardefaut);
                    }
                    else
                    {
                        $item->par_defaut = Outil::donneValeurCheckbox($request->pardefaut);
                    }
                }
                if(Schema::hasColumn($classe,'abreviation') )
                {
                    if(!isset($request->abreviation) )
                    {
                        $errors = __('customlang.abreviation');
                    }
                    else
                    {
                      $item->abreviation = $request->abreviation;
                    }
                }
                if (Schema::hasColumn($classe,'type_prestation_id'))
                {
                    if (!isset($request->type_prestation_id))
                    {
                        $errors = " Veuillez definir le type de prestation";
                    }
                    else
                    {
                        $typeprestation         = TypePrestation::find($request->type_prestation_id);
                        if (!isset($typeprestation))
                        {
                            $errors = "Ce Type  de prestation  n'existe pas dans le système";
                        }
                        else
                        {
                            $item->type_prestation_id = $typeprestation->id;
                        }
                    }
                }
                 // dd($item);
                if (!isset($errors))
                {
                    $item->created_at_user_id            = $item->id ? $item->created_at_user_id : Auth::user()->id;
                   
                    Schema::hasColumn($classe,'description') ? $item->description = $request->description :null;
                    Schema::hasColumn($classe,'image') ? $this->photogestion->save($request, $item):null;
                    Schema::hasColumn($classe,'paiement_cash') ? $item->paiement_cash            = Outil::donneValeurCheckbox($request->paiement_cash):null;
                    return Outil::redirectIfModeliSSaved($item, $this->queryName);
                }

                throw new \Exception($errors);
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }
    /******END SAVE METHODE********************** */
    public function beforeValidate($id)
    {

    }

    public function statut(Request $request )
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                $this->beforeValidate($request->id);
                $errors = null;
                $data = 0;
                $column  = !isset($request->substatut) ? "status" : $request->substatut;
                $item = app($this->model)::find($request->id);
                $tablename =$item->getTable();
                
                if ($item != null)
                {  
                     if($tablename=="devises")
                    {
                        if($request->status==1 && Devise::where('par_defaut',1)->count() > 0)
                        {
                            $errors = "Une Devise de base est deja definite";
                        }
                        else
                        {
                            $item->par_defaut = $request->status;
                            $item->save();
                            $data = 1;
                        }
                    }
                    else
                    {
                        $item->$column = $request->status;
                        $item->save();
                        if(Schema::hasColumn($tablename, 'user_validate_at'))
                        {
                            $item->user_validate_at                            = Auth::user()->id ;
                            $item->save();
                        }  
                    }
                }
                else
                {
                    $errors = "Cette donnée n'existe pas";
                }
                if (!isset($errors) && $item->save())
                {
                    $data = 1;
                }
                    return response('{"data":' . $data . ', "errors": "'. $errors .'" }')->header('Content-Type','application/json');
            });
        }
        catch (\Exception $e)
        {
            //dd($e);
            $errors = "Vérifier les données fournies";
            return response('{"data":' . 0 . ', "errors": "'. $errors .'" }')->header('Content-Type','application/json');
        }
    }


    public function beforeDelete($id)
    {

    }

    public function UpdateTable($tableId,$commandeId)
    {

    }

    public function delete($id)
    {
        try
        {
           
            return DB::transaction(function () use ($id)
            {
                $errors = null;
                $data = null;
                $tableId = null;
                //dd($id);
                $this->beforeDelete($id);
                if ((int) $id)
                {
                    if (isset($this->relationToDelete))
                    {
                        $item = app($this->model)::with($this->relationToDelete)->find($id);
                    }
                    else
                    {
                        $item = app($this->model)::find($id);
                    }
                    //dd($item,$this->model);

                    if (isset($item))
                    {
                        if (isset($this->relationToDelete))
                        {
                            foreach($this->relationToDelete as $onrelation)
                            {
                                if ((Str::of($onrelation)->endsWith('s') && count($item->$onrelation) > 0) || (!Str::of($onrelation)->endsWith('s') && isset($item->$onrelation)))
                                {
                                    $errors = "Impossible de supprimer une donnée qui a des liaisons du système";
                                    throw new \Exception($errors);
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
                                        if (strtolower($item->$key) == strtolower($onreglevalue))
                                        {
                                            $errors = "Des règles de gestion existe sur cette donnée,<br/><strong>Vous ne pouvez pas la supprimer,</strong> <br/>Au besoin, contactez le support technique pour en savoir plus";
                                            throw new \Exception($errors);
                                        }
                                    }
                                }
                            }
                            
                            $item->delete();
                            $item->forceDelete();
                            $data = 1;

                            // Pour send la notif
                            $queryName = Outil::getQueryNameOfModel($item->getTable());
                            Outil::publishEvent(['type' => substr($queryName, 0, (strlen($queryName) - 1)), 'delete' => true]);
                        }
                        catch (QueryException $e)
                        {
                            if (intval($e->errorInfo[1]) == 7)
                            {
                                $errors = $e->getMessage() . "Impossible de supprimer cette donnée, verifier les liaisons";
                            }
                            else
                            {
                                $errors = "Impossible de supprimer cette donnée, verifier les liaisons" ;
                            }
                            throw new \Exception($errors);
                        }
                    }
                    else
                    {
                        $errors = "Item introuvable";
                    }
                }
                else
                {
                    $errors = "Données manquantes";
                }
                if ($errors)
                {
                    throw new \Exception($errors);
                }
                else
                {
                    $retour = array(
                        'data'          => $data,
                    );
                }
                return response()->json($retour);
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }




    public function sendNotifImport($userId, $filename)
    {
        $extension = pathinfo($filename->getClientOriginalName(), PATHINFO_EXTENSION);

        $queryName = Outil::getQueryNameOfModel(app($this->model)->getTable());
        $generateLink = substr($queryName, 0, (strlen($queryName) - 1));
        // ENVOIE DE LA NOTIFICATION DE DEBUT
        $notif = new Notif();
        $notif->message = "L'import du fichier excel est en cours,Vous serez notifié une fois le traitement terminé";
        $notif->link = "#!/list-{$generateLink}";
        $notif->save();

        $notifPermUser  = new NotifPermUser();
        $notifPermUser->notif_id = $notif->id;
        $notifPermUser->permission_id = Permission::where('name', "creation-{$generateLink}")->first()->id;
        $notifPermUser->user_id = $userId;
        $notifPermUser->save();

        $eventNotif = new SendNotifEvent($notifPermUser);
        event($eventNotif);

        $from = public_path('uploads')."/{$queryName}/{$userId}/";
        $to = "upload.{$extension}";
        $file = $filename->move($from, $to);

        $this->dispatch((new $this->job($this->model, $generateLink, $file, $userId, $from.$to)));
    }

    public function import(Request $request)
    {
        try
        {
            $errors = null;
            $data = 0;

            
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
                            $this->sendNotifImport($userId, $filename);
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
}
