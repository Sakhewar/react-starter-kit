<?php


namespace App\RefactoringItems;

use App\Models\{ChapitreNomenclatureDouaniere,
    ClientTypeDossier,
    ClientTypeMarchandise,
    OrdreTransitAsre,
    OrdreTransitFf,
    Outil,
    Client,
    TypeImportationTypeMarchandise};
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\{Auth, DB};
use ReflectionClass;

class ModelQuery
{
    public static function getQueryOrQueryPaginated($root, $args, &$query, $order=true, $arrayOrder = null)
    {
        $collumn        = 'id';
        $property       =  'DESC';
        if (isset($order))
        {
            if (isset($arrayOrder))
            {
                $collumn    = isset($arrayOrder['collumn']) ? $arrayOrder['collumn'] : $collumn;
                $property   = isset($arrayOrder['property']) ? $arrayOrder['property'] : $property;
            }
        }

        if (!isset($args['page']) && isset($args['count']))
        {
            $query = $query->limit($args['count']);
        }
        if (isset($args['count']) && isset($args['page']))
        {
            $count = Arr::get($args, 'count', 20);
            $page  = Arr::get($args, 'page', 1);
            if ($order && isset($collumn) && isset($property))
            {
                $query->orderBy($collumn,$property);
            }
            $query = $query->paginate($count, ['*'], 'page', $page);
        }
        else
        {
            if ($order && isset($collumn) && isset($property))
            {
                $query->orderBy($collumn,$property);
            }
            $query = $query->get();
        }
        return $query;
    }

    // public static $modelNamespace = '\\App\\Models';

    // public static function initForQuery($root, $args, $nameQuery, &$query)
    // {
    //     $nameQuery = str_ireplace("For", '', $nameQuery);
    //     $refl = new ReflectionClass(self::$modelNamespace . "\\" .  ucfirst($nameQuery));
    //     $query = $refl->getName()::query();

    //     Outil::addWhereToModel($query, $args,
    //         [
    //             ['id',                     '='],
    //             ['nom',                 'like'],
    //             ['description',         'like'],
    //         ]);

    //     if (isset($args['search']))
    //     {
    //         $search = $args['search'];
    //         $query->where('nom', Outil::getOperateurLikeDB(),'%'. $search . '%');
    //     }

    //     self::getQueryOrQueryPaginated($root, $args, $query);
    // }

    // public static function forBanque($root, $args, $query)
    // ..

    // public static function forBureau($root, $args, $query)
    // ..

    public static function forClient($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
        [
            ['id',                     '='],
            ['nom',                 'like'],
            ['type_client_id',         '='],
            ['status',                 '='],
            ['modalite_paiement_id',   '='],
            ['nomenclature_client_id', '='],
        ]);

        if (isset($args['search']))
        {
            $motRecherche  = $args['search'];
            $query = $query->where(function ($query) use ($motRecherche) {
                return $query->where('nom', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('email', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('telephone', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
            });
        }

        if (isset($args['type_marchandise_id']))
        {
            $ctm =ClientTypeMarchandise::query()->where('type_marchandise_id', $args['type_marchandise_id'])->pluck('client_id');
            $query = $query->whereIn('id', $ctm);
        }
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forContact($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                     '='],
                ['nom',                 'like'],

            ]);

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forChapitreNomenclatureDouaniere($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                                                     '='],
                ['chapitre_nomenclature_douaniere_id',                     '='],
                ['code',                                                   '='],
                ['nom',                                                    'like'],

            ]);

       // dd("here",$args);
        if (isset($args["depth"]))
        {
            $recursiveQuery = ChapitreNomenclatureDouaniere::$recursiveQuery ?? "";
            $query->whereRaw("({$recursiveQuery} SELECT depth FROM RecursiveTable where id = chapitre_nomenclature_douanieres.id) = {$args['depth']}");
        }
        if (isset($args['search']))
        {
            $motRecherche  = $args['search'];
            $query = $query->where(function ($query) use ($motRecherche) {
                return $query->where('nom', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
                    //->orWhere('reference', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
            });
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forDevise($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['taux_change',              '='],
                ['devise_base',              '='],
                ['signe',                    '='],
            ]);

        if (isset($args['search']))
        {
            $search = $args['search'];
            $query->where('nom', Outil::getOperateurLikeDB(),'%'. $search . '%')
                ->orWhere(function ($subquery) use ($search)
                {
                    $subquery->where('signe', Outil::getOperateurLikeDB(),'%'. $search . '%')
                        ->orWhere('cours', Outil::getOperateurLikeDB(), $search)
                        ->orWhere('unite', Outil::getOperateurLikeDB(), $search)
                        ->orWhere('precision', Outil::getOperateurLikeDB(), $search)
                        ->orWhere('taux_change', Outil::getOperateurLikeDB(), $search)
                        ;
                });
        }

        if (isset($args['ordre_transit_id']))
        {
            $res = OrdreTransitFf::query()->where('ordre_transit_id', $args['ordre_transit_id'])->whereNotNull('devise_id')->pluck('devise_id');
            if (count($res) > 0)
            {
                $query->whereIn('id', $res);
            }
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forDossier($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    // public static function forEnergie($root, $args, $query)
    // ..

    public static function forEntrepot($root, $args, $query)
    {
        // Pour n'avoir accès qu'aux données de l'entreprise
        if (Auth::user() && isset(Auth::user()->client_id))
        {
            $query->whereRaw("(client_id is null OR client_id=?", [Auth::user()->client_id]);
        }

        $query->orderBy("id",'asc');
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forFournisseur($root, $args, $query)
    {
        if (isset($args['article_facturation_id']))
        {
            $query->whereRaw("id in (select fournisseur_id from fournisseur_article_facturations where article_facturation_id={$args['article_facturation_id']})");
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forGroupePermission($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                   '='],
                ['name',              'like'],
                ['display_name',      'like']
            ]);

        if (isset($args['search']))
        {
            $search = $args['search'];
            $query->where('name', Outil::getOperateurLikeDB(),'%'. $search . '%');
        }

        $query->has('permissions', '>', 0);

        $query->orderBy('name');

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forLivreur($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                     '='],
                ['nom',                 'like'],
                ['type_client_id',         '='],
                ['status',                 '='],
            ]);

        if (isset($args['search']))
        {
            $motRecherche  = $args['search'];
            $query = $query->where(function ($query) use ($motRecherche) {
                return $query->where('nom', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('email', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('telephone', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
            });
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forMarchandise($root, $args, $query)
    {
       // $query->where('type_marchandise_id', 1);

        if (isset($args['search']))
        {
            $motRecherche  = $args['search'];
            $query = $query->where(function ($query) use ($motRecherche) {
                return $query->where('nom', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('reference', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
            });
        }
        if(isset($args['type_marchandise_id']) )
        {
            //$query = $query->where('type_marchandise_id',$args['type_marchandise_id']);
        }

        if (isset($args['type_marchandise_ids']))
        {
            $t = array_map('intval', explode(",", $args["type_marchandise_ids"]));
            $query = $query->whereIn('type_marchandise_id',$t);
        }

        if(isset($args['nomenclature_douaniere_id']) )
        {
            $query = $query->where('nomenclature_douaniere_id',$args['nomenclature_douaniere_id']);
        }


        if(isset($args['nomenclature_douaniere_id']) )
        {
            $query = $query->where('nomenclature_douaniere_id',$args['nomenclature_douaniere_id']);
        }
        if(isset($args['marque_id']) )
        {
            $query = $query->where('marque_id',$args['marque_id']);
        }
        if(isset($args['modele_id']) )
        {
            $query = $query->where('modele_id',$args['modele_id']);
        }
        if(isset($args['energie_id']) )
        {
            $query = $query->where('energie_id',$args['energie_id']);
        }

        if (isset($args['client_id']))
        {
            $client = Client::query()->find($args['client_id']);
            if (isset($client))
            {
                $query = $query->whereRaw("(select count(marchandise_clients.id) from marchandise_clients where marchandise_clients.marchandise_id = marchandises.id) = 0");

                if ($client->client_marchandises()->count() > 0)
                {
                    $arr = $client->client_marchandises()->get(['marchandise_clients.marchandise_id'])->pluck('marchandise_id')->toArray();
                    //dd($arr);
                    $query = $query->orWhereIn("id",$arr);
                    //$query = $query->whereIn("id",$arr);

                }
            }
        }

        if(isset($args['type_marchandise_id']) )
        {
            $query = $query->where('type_marchandise_id',$args['type_marchandise_id']);
        }

        return  self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forMarque($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forModalitePaiement($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    // public static function forModele($root, $args, $query)
    // ..

    // public static function forModePaiement($root, $args, $query)
    // ..

    // public static function forNavire($root, $args, $query)
    // ..

    public static function forModule($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                      '='],
                ['title',                'like'],
                ['icon',                 'like'],
                ['description',          'like'],
                ['order',                   '='],
                ['module_id',               '='],
                ['mode_link_id',            '='],
            ]);
            $optionals = ['order' => true, 'column_order' => 'order'];

        return self::getQueryOrQueryPaginated($root, $args, $query,$optionals);
    }


    //public static function forNomenclatureDouaniere($root, $args, $query)
    // ..


    // public static function forNomenclatureClient($root, $args, $query)
    // ..


    public static function forNotif($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                             '='],
                ['message',                     'like'],
                ['link',                        'like'],
            ]);

        if (isset($args['search']))
        {
            $query = $query->where('message', Outil::getOperateurLikeDB(),'%'. $args['search'] . '%')
                ->orWhere('link', Outil::getOperateurLikeDB(),'%'. $args['search'] . '%');
        }
        if (isset($args['date_start']) && isset($args['date_end']))
        {
            $from = $args['date_start'];
            $to = $args['date_end'];

            // Eventuellement la date fr
            $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
            $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

            $from = date($from.' 00:00:00');
            $to = date($to.' 23:59:59');

            $query->whereBetween('created_at', array($from, $to));
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forNotifPermUser($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                                   '='],
                ['notif_id',                             '='],
                ['permission_id',                        '='],
                ['user_id',                              '='],
                ['view',                                 '='],
            ]);

        if (isset($args['date_start']) && isset($args['date_end']))
        {
            $from = $args['date_start'];
            $to = $args['date_end'];

            // Eventuellement la date fr
            $from = (strpos($from, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $from)->format('Y-m-d') : $from;
            $to = (strpos($to, '/') !== false) ? Carbon::createFromFormat('d/m/Y', $to)->format('Y-m-d') : $to;

            $from = date($from.' 00:00:00');
            $to = date($to.' 23:59:59');

            $query->whereBetween('created_at', array($from, $to));
        }

        if (Auth::user())
        {
            $query->where('user_id', Auth::user()->id)->where('view', false);
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forNiveauHabilite($root, $args, $query)
    {
        if (Auth::user())
        {
            // $query->where('user_id', Auth::user()->id)->where('view', false);
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forOrdreTransit($root, $args, $query)
    {
        // Pour n'avoir accès qu'aux données de l'entreprise
        if (Auth::user() && isset(Auth::user()->client_id))
        {
            $query->where("client_id", Auth::user()->client_id);
        }
        $can_do =  true;
        if (isset($args['skip_dossier']) && $args['skip_dossier'] === true)
        {
            $can_do =  false;
        }
        if ($can_do)
        {
            $query->whereRaw("(select count(dossiers.id) from dossiers where ordre_transit_id = ordre_transits.id) = 0");
        }
        $query->orderBy("id", 'desc');
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forPage($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                      '='],
                ['title',                'like'],
                ['icon',                 'like'],
                ['description',          'like'],
                ['order',                   '='],
                ['module_id',               '='],
                ['link',                 'like'],
                ['permissions',          'like'],
                ['can_be_managed',          '='],
            ]);

            if (isset($args['autre']))
            {
                if ($args['autre'] == 1)
                {
                    $query = $query->whereNull('module_id');
                }
                else
                {
                    $query = $query->whereNotNull('module_id');
                }
            }

        $optionals = ['order' => true, 'column_order' => 'order'];

        return self::getQueryOrQueryPaginated($root, $args, $query, $optionals);
    }

    // public static function forPort($root, $args, $query)
    // ..

    public static function forPermission($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                   '='],
                ['name',              'like'],
                ['display_name',      'like']
            ]);

        if (isset($args['search']))
        {
            $search = $args['search'];
            $query->where('name', Outil::getOperateurLikeDB(),'%'. $search . '%');
        }

        // Pour n'avoir accès qu'aux permissions de ses profils
        if (Auth::user())
        {
            $user_id = Auth::user()->id;
            $query->whereRaw("id in (select role_has_permissions.permission_id from model_has_roles, role_has_permissions where model_has_roles.model_id={$user_id} and model_has_roles.role_id=role_has_permissions.role_id)");
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forPreference($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                       '='],
                ['nom',                   'like'],
                ['display_name',          'like'],
                ['valeur',                'like'],
                ['description',           'like'],
            ]);

        if (isset($args['search']))
        {
            $search = $args['search'];
            $query->where('nom', Outil::getOperateurLikeDB(),'%'. $search . '%');
        }
        $query->orderBy("id",'asc');
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }


    // public static function forRegime($root, $args, $query)
    // ..


    public static function forRole($root, $args, $query)
    {
        // Pour n'avoir accès qu'aux profils dont toutes les permissions existent bel et bien dans la liste
        // des permissions du client
        if (Auth::user())
        {
            $user_id = Auth::user()->id;
            $query->whereRaw("
                (select count(*) from role_has_permissions where role_has_permissions.role_id=roles.id and role_has_permissions.permission_id NOT IN (select role_has_permissions.permission_id from model_has_roles, role_has_permissions where model_has_roles.model_id={$user_id} and model_has_roles.role_id=role_has_permissions.role_id)) = 0
            ");
        }

        $query->orderBy("id",'asc');
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }


    // public static function forTaxeDouaniere($root, $args, $query)
    // ..


    public static function forTypeClient($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypeDossier($root, $args, $query)
    {
        Outil::addWhereToModel($query, $args,
            [
                ['id',                       '='],
                ['show_for_client',          '='],
            ]);
        // Pour n'avoir accès qu'aux données de l'entreprise
        if (Auth::user() && isset(Auth::user()->client_id) && Auth::user()->client->type_dossiers()->count() > 0)
        {
            $query->whereIn("id", Auth::user()->client->type_dossiers()->get(['type_dossiers.id'])->pluck('id')->toArray());
        }

        if (isset($args['client_id']))
        {
            $client = Client::query()->find($args['client_id']);
            if (isset($client))
            {
                if ($client->type_dossiers()->count() > 0)
                {
                    $query->whereIn("id", $client->type_dossiers()->get(['type_dossiers.id'])->pluck('id')->toArray());
                }
            }
        }

        $query->orderBy("id",'asc');
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypeEntrepot($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypeImportation($root, $args, $query)
    {
        if (isset($args['type_marchandise_id']))
        {

            $query = $query->whereRaw("(select count(id) from type_importation_type_marchandises  where type_importation_type_marchandises.type_importation_id=type_importations.id  and  type_importation_type_marchandises.type_marchandise_id={$args['type_marchandise_id']}) > 0");

        }
        if (isset($args['type_dossier_id']))
        {
            $query = $query->whereRaw("(select count(id) from type_importation_type_dossiers  where type_importation_type_dossiers.type_importation_id=type_importations.id  and  type_importation_type_dossiers.type_dossier_id={$args['type_dossier_id']}) > 0");

        }
        if (isset($args['client_id']))
        {
            $getClient = Client::query()->find($args['client_id']);
            if (isset($getClient))
            {
                if ($getClient->type_marchandises()->count() > 0)
                {
                    $c = $getClient->type_marchandises()->get(['type_marchandises.id'])->pluck('id')->toArray();
                    $u = TypeImportationTypeMarchandise::query()->whereIn('type_marchandise_id' , $c)->get(['type_importation_id'])->pluck('type_importation_id');
                    $query->whereIn("id", $u);
                    //dd($u,$c);
                }
            }
        }
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypeMarchandise($root, $args, $query)
    {
        // Pour n'avoir accès qu'aux données de l'entreprise
        if (Auth::user() && isset(Auth::user()->client_id) && Auth::user()->client->type_marchandises()->count() > 0)
        {
            $query->whereIn("id", Auth::user()->client->type_marchandises()->get(['type_marchandises.id'])->pluck('id')->toArray());
        }

        if (isset($args['client_id']))
        {
            $client = Client::query()->find($args['client_id']);
            if (isset($client))
            {
                if ($client->type_marchandises()->count() > 0)
                {
                    $arr = $client->type_marchandises()->get(['type_marchandises.id'])->pluck('id')->toArray();
                    $query = $query->whereIn("id",$arr);
                }
            }
        }

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypePermission($root, $args, $query)
    {
        $query->orderBy('id');

        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forTypeTransport($root, $args, $query)
    {
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

    // public static function forUniteMesure($root, $args, $query)
    // ..

    public static function forVehicule($root, $args, $query)
    {
        //$query->where('type_marchandise_id', 2);

        $query = $query->whereRaw("(select type from type_marchandises  where marchandises.type_marchandise_id=type_marchandises.id ) = 2");

        if (isset($args['search']))
        {
            $motRecherche  = $args['search'];
            $query = $query->where(function ($query) use ($motRecherche)
            {
                return $query->where('nom', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%')
                    ->orWhere('immatriculation', Outil::getOperateurLikeDB(), '%'.$motRecherche.'%');
            });
        }
        if (isset($args['type_marchandise_id']))
        {
            $query = $query->where('type_marchandise_id',$args['type_marchandise_id']);
        }
        if (isset($args['nomenclature_douaniere_id']))
        {
            $query = $query->where('nomenclature_douaniere_id',$args['nomenclature_douaniere_id']);
        }
        if (isset($args['marque_id']))
        {
            $query = $query->where('marque_id',$args['marque_id']);
        }
        if (isset($args['modele_id']))
        {
            $query = $query->where('modele_id',$args['modele_id']);
        }
        if (isset($args['energie_id']))
        {
            $query = $query->where('energie_id',$args['energie_id']);
        }
        return  self::getQueryOrQueryPaginated($root, $args, $query);
    }

    public static function forUser($root, $args, $query)
    {

        // Pour n'avoir accès qu'aux données de l'entreprise
        if (Auth::user() && isset(Auth::user()->client_id))
        {
            $query->where("client_id", Auth::user()->client_id);
        }

        $query->orderBy("id",'asc');
        //dd($query->toSql());
        return self::getQueryOrQueryPaginated($root, $args, $query);
    }

}







