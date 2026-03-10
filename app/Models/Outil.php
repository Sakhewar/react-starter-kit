<?php

namespace App\Models;

use App\Events\RtEvent;
use App\Exports\DatasExport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

use function PHPUnit\Framework\isEmpty;
use Illuminate\Http\{Request};

class Outil extends Model
{
    public static $queries = array(
        "provenances"                               => "id,libelle,description",
        "modalitepaiements"                         => "id,libelle,description,nbre_jour",
        "users"                                     => "id,name,image,status,status_fr,email",       
    );
    public static function listenerUsers(&$table, $add = true)
    {
        if ($add)
        {
            $table->foreignId('created_at_user_id')->nullable()->constrained('users');
            $table->foreignId('updated_at_user_id')->nullable()->constrained('users');
        }
        else
        {
            $table->dropConstrainedForeignId('created_at_user_id');
            $table->dropConstrainedForeignId('updated_at_user_id');
        }
    }

    public static function hasOnePermissionOf(array $models)
    {
        $user = auth()->user();
        if (!$user)
        {
            return false;
        }

        $permissions = collect();

        if (count($models) > 0)
        {
            $permissions = Permission::whereNotNull('display_name')
                ->where(function ($query) use ($models) {
                    foreach ($models as $model)
                    {
                        $query->orWhere('name', 'like', "%{$model}%");
                    }
                })
                ->pluck('name');
        }
        
        // Aucun modèle => pas de restriction
        if ($permissions->isEmpty())
        {
            return true;
        }

        // Vérifie si l'utilisateur a au moins une permission correspondante
        foreach ($permissions as $permissionName)
        {
            if ($user->can($permissionName))
            {
                return true;
            }
        }

        return false;
    }

    public static function getAllClassesOf(array $directories)
    {
        $profondeur = "";
        $profondeur_2 = "";
        foreach ($directories as $directory)
        {
            $profondeur .= "{$directory}/";
            $profondeur_2 .= "\\{$directory}";
        }

        $classPaths = glob(app_path() . "/{$profondeur}*.php");

        $classes = array();
        $namespace = "App{$profondeur_2}\\";
        foreach ($classPaths as $classPath)
        {
            $segments = explode('/', $classPath);
            $classes[] = "\\". str_replace('.php', '', ($namespace . end($segments)));
        }
        return $classes;
    }

    protected function getAllClassesOf2(string $workDirectory, string $directory): array
    {
        $path = app_path("{$workDirectory}/{$directory}");

        if (!is_dir($path)) {
            return [];
        }

        $classes = [];

        foreach (glob("{$path}/*.php") as $file) {
            $className = 'App\\GraphQL\\' . $directory . '\\' . basename($file, '.php');

            if (class_exists($className)) {
                $classes[] = $className;
            }
        }

        return $classes;
    }

    public static function addWhereToModel(&$query, $args, $filtres)
    {
        foreach ($filtres as $key => $value)
        {
            if (isset($args[$value[0]]) || ($value[1]=='date' && isset($args[$value[0].'_start'])))
            {
                $operator = $value[1];
                $valueColumn = isset($args[$value[0]]) ? $args[$value[0]] : null;
                if ($operator == 'join')
                {
                    $second = $value[2];
                    $query->whereRaw("{$second}_id in (select id from {$second}s where {$value[0]}=?)", [$valueColumn]);
                }
                else if ($operator == 'date')
                {
                    //dd($value[2]);
                    if (isset($args[$value[0].'_start']) && isset($args[$value[0].'_end']))
                    {
                        // Si la colonne est précisée, on utilise la colonne, sinon, on match avec la colonne date
                        $column = isset($value[2]) ? $value[2] : "date";

                        $from = $args[$value[0].'_start'];
                        $to = $args[$value[0].'_end'];

                        //dd($to);
                        // Eventuellement la date fr
                        $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
                        $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

                        $from = date($from.' 00:00:00');
                        $to = date($to.' 23:59:59');
                        $query->whereBetween($column, array($from, $to));
                    }
                }
                else
                {
                    if ($operator == 'like')
                    {
                        $operator = self::getOperateurLikeDB();
                        $valueColumn = '%' . $valueColumn . '%';
                    }
                    $query->where($value[0], $operator, $valueColumn);
                }
            }
        }
    }

    public static function getOperateurLikeDB()
    {
        return config('database.default') == "mysql" ? "like" : "ilike";
    }

    public static function getCurrentEnv()
    {
        return config('env.APP_ENV_FOR');
    }

    public static function getAPI()
    {
        return config('env.APP_URL_BACK');
    }

    public static function getMsgError()
    {
        return config('env.MSG_ERROR');
    }

    public static function getResponseError(\Exception $e)
    {
        return response()->json(array(
            'errors'          => [$e->getCode() == 0 ? $e->getMessage() : config('env.MSG_ERROR')],
            'errors_debug'    => [$e->getMessage()],
            'errors_line'     => [$e->getLine()],
            'errors_trace'    => [$e->getTrace()],
        ));
    }

    // Format Date
    public static function formatDate($fr = false, $optionals = ['getSeparator' => false, 'withHours' => true])
    {

        if (!isset($optionals['getSeparator']) || !$optionals['getSeparator']) {
            return ($fr ? "d/m/Y" : "Y-m-d") . (!isset($optionals['withHours']) || $optionals['withHours'] ? " H:i:s" : "");
        } else {
            return "/";
        }
    }

    // Format Price
    public static function formatWithThousandSeparator($valeur)
    {
        return number_format($valeur, 0, '.', ' ');
    }

    public static function resolveImageField($image, $elseDefault = true)
    {
        if (!isset($image))
        {
            if ($elseDefault)
            {
                $image = "/assets/images/upload.jpg";
            }
        } else {
            if (!str_contains($image, "?date")) {
                // In the event that an image exists in the database, in versioning
                $image = $image . '?date=' . (date('Y-m-d H:i'));
            }
        }

        if (isset($image) && !str_contains($image, "http")) {
            return self::getAPI() . $image;
        }

        return $image;
    }

    public static function publishEvent($data)
    {
        $eventRT = new RtEvent($data);
        event($eventRT);
    }

    public static function generateFilePdfOrExcel(Request $request, $queryName, $type, $id = null)
    {
        $oldtag = $queryName;
        $rewriteQueryName = null;

        $titre = null;
        $user = Auth::user()->name;

        $object = array_keys($request->all());

        $folder = config('env.FOLDER');
        if (!isset($folder))
        {
            $folder = '/';
        }
        else
        {
            if ($folder == "")
            {
                $folder = '/';
            }
        }
        
        // GESTION DES FILTRES 
        $uri = $request->getRequestUri();
        $query = parse_url($uri)['query'] ?? '';
        $filtre = isset($id) ? "id:{$id}" : $query;

        $data = Outil::getOneItemWithFilterGraphQl($request, $queryName, $filtre);

        if ($rewriteQueryName != null)
        {
            $queryName = $rewriteQueryName;
        }
        $details = null;
        if (isset($id))
        {
            $model = substr($queryName, 0, strlen($queryName) - 1);
            $filtre_detail = "{$model}_id:$id";
            if ($oldtag == 'entree' ||  $oldtag == 'sortiestock') 
            {
                $queryName = 'entreesortiestocks';
                $filtre_detail = "entree_sortie_stock_id:$id";
            }
          
            $queryName_detail = "detail{$queryName}";
            $queryToIgnore = ['contrats','facturecontrats'];
            if(!in_array($queryName, $queryToIgnore))
            {
                $details = Outil::getOneItemWithFilterGraphQl($request, $queryName_detail, $filtre_detail);
            }

        }
        
        if ($data && count($data) > 0)
        {
            $addToLink = (isset($id) ? "detail-" : "");

            $data = array('user' => $user, 'data' => $data, 'is_excel' => false, 'titre' => $titre, 'details' => $details);

            if (str_contains($type, "pdf"))
            {
                if (isset($id))
                {
                    $pdf = PDF::loadView("pdfs.{$addToLink}{$queryName}", $data);
                }
                else
                {
                    $good = false;
                    if (!view()->exists("pdfs.{$addToLink}{$queryName}"))
                    {
                        $className = 'App\\Models\\' . Str::studly( Str::singular($queryName));

                        $data['columns'] = [];

                        if (class_exists($className)) 
                        {
                            $data['columns'] = collect($className::$columnsExport)->where('export', true)->toArray();
                        }

                        if (count($data['columns']) > 0)
                        {
                            $pdf = PDF::loadView("pdfs.default_export", $data);
                            $good = true;
                        }
                    }

                    if (!$good)
                    {
                        $pdf = PDF::loadView("pdfs.{$addToLink}{$queryName}", $data);
                    }
                }

                

                return $pdf->stream("{$addToLink}{$queryName}");
            }
            else
            { 
                return Excel::download(new DatasExport($data, $queryName, $id), "{$addToLink}{$queryName}.xlsx");
            }
        }
        else
        {
            return redirect()->back();
        }
    }

    public static function getOneItemWithFilterGraphQl($request, $queryName, $filter, array $listeattributs_filter = null, $addToQueryAttr = null, $justTheseAttr = null, $auth_user_id = null)
    {
        $token = "";
        if (auth()->check())
        {
            $auth_user_id = auth()->id();
        }

        if (isset($auth_user_id))
        {
            $token = cache('currentToken.' . $auth_user_id);
            if (!isset($token) && isEmpty($token))
            {
                Outil::generateTokenForUser();
                $token = cache('currentToken.' . $auth_user_id);
            }
        }
    
        $guzzleDefaults['headers']           = ['Authorization' => "Bearer {$token}", 'Content-Type' => 'application/json'];
        $guzzleDefaults['verify']            = true;
        $guzzleDefaults['http_errors']       = false;

        $guzzleClient = new \GuzzleHttp\Client($guzzleDefaults);

        $critere = !empty($filter) ? '(' . $filter . ')' : "";
        if (str_contains($queryName, 'pdf'))
        {
            $queryName = str_replace('pdf', '', $queryName);
        }
        
        if (isset($justTheseAttr))
        {
            $queryAttr = $justTheseAttr;
        }
        else if (!isset($queryAttr) && isset($queryName))
        {
            $queryAttr = Outil::$queries[$queryName] ?? "id,libelle,description";
        }

        $queryAttr = $queryAttr . $addToQueryAttr;

        $add_text_filter = "";
        if (isset($listeattributs_filter)) 
        {
            foreach ($listeattributs_filter as $key => $one) 
            {
                $queryAttr = str_replace($one . ",", "", $queryAttr); // Si le paramètre existe, on le remplace dans la chaine de caractère
                $getAttr = $one;
                $reste = "";
                if (strpos($one, "{") !== false) 
                {
                    $getAttr = substr($one, 0, strpos($one, "{"));
                    $reste = substr($one, strpos($one, "{"));
                }
                $add_text_filter .= (($key === 0) ? ',' : '') . $getAttr . $critere . $reste . (count($listeattributs_filter) - $key > 1 ? ',' : '');
            }
        }

        $mount_session_id = "";
        if (isset($auth_user_id))
        {
            $mount_session_id = "current_user_id=".$auth_user_id."&";
        }
        $url = self::getAPI()."graphql?{$mount_session_id}query={{$queryName}{$critere}{{$queryAttr}{$add_text_filter}}}";
        $cpt = 1;
        while ($cpt<2)
        {
            $response = $guzzleClient->request('GET', $url, $guzzleDefaults);
            //dd($response);

            if ($response->getStatusCode()==401)
            {
                if (isset($auth_user_id))
                {
                    Outil::generateTokenForUser();
                    $token = cache('currentToken.' . $auth_user_id);
                    $guzzleDefaults['headers']['Authorization'] = "Bearer {$token}";
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
            $cpt++;
        }
        $data = json_decode($response->getBody(), true);
        if (!isset($data['data']) || !isset($data['data'][$queryName]))
        {
            dd($data, $url, $queryName, $filter, $listeattributs_filter);
        }
        return $data['data'][$queryName];
    }

    public static function generateTokenForUser($userId = null)
    {
        $currentUser = Auth::user();
        if (isset($userId))
        {
            if (\is_numeric($userId))
            {
                $currentUser = User::find($userId);
            }
            else
            {
                $currentUser = $userId;
            }
        }
        $abilities = [];
        $token  = explode('|', $currentUser->createToken($request->device_name ?? "master", $abilities)->plainTextToken);
        $token = is_array($token) && isset($token[1]) ? $token[1] : null;
        
        cache()->put('currentToken.' . $currentUser->id, $token);
    }

    public static function getCode($model, $indicatif)
    {
        $getLast = app($model)::where('code', self::getOperateurLikeDB(), '%' . $indicatif . '%')->orderBy('id', 'desc')->first();
        $codenumber = 1;
        if (isset($getLast))
        {
            $codenumber = $getLast->id + 1;
        }
        $code  =  $indicatif . "-00" . $codenumber . '-' . date('y');

        $sim = app($model)::where('code', $code)->orderBy('id', 'desc')->first();
        if (isset($sim))
        {
            $codenumber = $sim->id + 1;

            $cpt = 0;
            while (isset($sim))
            {
                $code = $indicatif . "-00" . $codenumber . '-' . date('y');
                $sim = app($model)::where('code', $code)->orderBy('id', 'desc')->first();
                $codenumber++;
                $cpt++;
                // if ($cpt==20)
                // {
                //     dd($codenumber, $sim);
                // }
            }
        }

        return $code;
    }

    public static function getQueryNameOfModel($nameTable)
    {
        return str_replace("_", "", $nameTable);
    }

    public static function uploadFileToModel(&$request, &$item, $file = "image", $subimage="image")
    {
        $attr_erase = $file . "_erase";
        if (!empty($request->file()) && isset($_FILES[$file]))
        {
            $fichier = $_FILES[$file]['name'];
            if (!empty($fichier))
            {
                $fichier_tmp = $_FILES[$file]['tmp_name'];
                $ext = explode('.', $fichier);
                $rename = config('view.uploads')[self::getQueryNameOfModel($item->getTable())] . "/{$file}_" . $item->id . "." . end($ext);
                move_uploaded_file($fichier_tmp, $rename);

                // Pour directement save le lien absolu ici
                $item->$subimage = self::resolveImageField($rename);
            }

        }
        else if (isset($request->$attr_erase))
        {
            // Allows you to delete the user's image
            $item->$subimage = null;
        }

        $item->save();
    }
}
