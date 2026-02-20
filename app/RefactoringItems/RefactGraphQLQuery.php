<?php

namespace App\RefactoringItems;

use App\Models\{Outil};
use ReflectionClass;
use GraphQL\Language\Parser;
use Illuminate\Support\Str;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Database\Eloquent\Builder;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Illuminate\Support\Facades\{Auth, DB, Route, Schema, Validator};

class RefactGraphQLQuery extends Query
{
    protected $attributes = [
        'name' => null,
        'description' => null,
    ];

    protected $name = null;
    protected $model = null;
    protected $modelType = null;
    protected $paginationType = null;
    protected $query = null;



    /**
     * Le namespace dans lequel le système doit aller chercher le fichier
     *
     * @var array
     */
    protected $modelNamespace = '\\App\\Models';

    /**
     * Les champs a regardés lors d'un search
     *
     * @var array
     */

    protected $searchColumns = [
        'code',
        'name',
        'nom',
        'prenom',
        'description',
        'numero_telephone',
        'telephone',
        'email',
        'adresse'
    ];

    public function __construct()
    {
        $this->initClass();
    }

    public function type(): Type
    {
        if ($this->hasPaginationClause())
        {
            return GraphQL::type($this->paginationType);
        }

        return Type::listOf(GraphQL::type($this->modelType));
    }

    /**
     * Permet d'ajouter d'autres filtres que les filtres de base dans le query en cours
     *
     * @param array $addArgs
     * @return array
     */
    public function addArgs(array $addArgs = null): array
    {
        $baseArgs =  [
            'id'                      => ['type' => Type::int()],
            'user_connected_id'       => ['type' => Type::int(), 'description' => "mount id of user connected from mobile..."],
            'search'                  => ['type' => Type::string()],
            'code'                    => ['type' => Type::string()],
            'nom'                     => ['type' => Type::string()],
            'name'                    => ['type' => Type::string()],
            'description'             => ['type' => Type::string()],
            'status'                  => ['type' => Type::boolean()],

            'date_start'              => ['type' => Type::string()],
            'date_end'                => ['type' => Type::string()],

            'count'                   => ['type' => Type::int()],
            'page'                    => ['type' => Type::int()],
        ];

        if (isset($addArgs))
        {
            foreach ($addArgs as $key => $value)
            {
                $baseArgs[$key] = $value;
            }
        }

        return $baseArgs;
    }

    public function args(): array
    {
        return $this->addArgs();
    }

    public function resolve($root, $args)
    {
        if (($this->model instanceof Model) || gettype($this->model) == 'string')
        {
            $refl = new ReflectionClass($this->model);
            $this->query = $refl->getName()::query();
        }
        else
        {
            $this->query = $this->model;
            $refl = new ReflectionClass($this->model->getModel());
        }

        // dd($refl->getName());

        // $functionCall = 'for' . $this->modelType;

        // $functionCall = substr($functionCall, 0, strlen($functionCall) - 4);


        // $refl = new ReflectionClass($this->model);
        // $this->query = $refl->getName()::query();
        // $this->afterQueryDefinition();


        $e = explode("\\", $refl->getName());

        // dd($e);
        $functionCall = 'for' . end($e);

        // dd($refl, $functionCall);

        $this->addQueryWithDefaultArgs($this->query, $args);

        Outil::addWhereToModel($this->query, $args,
            [
                // ['id',                     '='],
                // ['name',                'like'],
                // ['nom',                 'like'],
                // ['description',         'like'],
                // ['status',                 '='],
                ['date',                'date'],
            ]);

        // if (isset($args['search']))
        // {
        //     $search = $args['search'];

        //     $columSearch = Schema::hasColumn($query->getModel()->getTable(), 'nom') ? 'nom' : 'name';
        //     $query->where($columSearch, Outil::getOperateurLikeDB(),'%'. $search . '%');
        // }

        if (method_exists(ModelQuery::class, $functionCall))
        {
            return ModelQuery::{$functionCall}($root, $args, $this->query);
        }

        return ModelQuery::getQueryOrQueryPaginated($root, $args, $this->query);

        // dd(new ReflectionClass($this->model)->getName());
    }


    /**
     * Determine si le query est un query de pagination
     *
     * @return boolean
     */
    protected function hasPaginationClause(): bool
    {
        $all = request()->all();

        if (!isset($all['query']) || empty($all['query'])) {
            return false; // Aucune requête GraphQL en cours
        }

        try {
            [$node] = \GraphQL\Language\Parser::parse($all['query'])->definitions;
            [$node] = $node->selectionSet->selections;

            foreach ($node->arguments as $arg) {
                if (in_array($arg->name->value, ['page'])) {
                    return true;
                }
            }
        } catch (\Throwable $e) {
            return false;
        }

        return false;
    }
    // protected function hasPaginationClause(): bool
    // {
    //     $query = request()->all()['query'];

    //     [$node] = Parser::parse($query)->definitions;
    //     [$node] = $node->selectionSet->selections;

    //     foreach ($node->arguments as $arg)
    //     {
    //         if (in_array($arg->name->value, ['page']))
    //         {
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    /**
     * Permet d'ajouter des clauses au query avec les filtres par défaut
     *
     * @param Illuminate\Database\Eloquent\Builder $query
     * @param array $args
     * @return Illuminate\Database\Eloquent\Builder
     */
    public function addQueryWithDefaultArgs(Builder &$query, array $args)
    {
        $this->addQuery($query, $args); // pour donner la possibilité de modififer $args

        $argTypes = $this->args();

        foreach ($args as $key => $value)
        {
            if (!isset($argTypes[$key]['default']) || $argTypes[$key]['default']==true)
            {
                //Pour ingorer le traitement d'un argument en base de donnei
                //ajouter un attribut nommei ingoreInDB qui sera true ou false
                // au moment ou on defini les arguments
                $ignoreInDB = isset($argTypes[$key]['ignoreInDB']) && $argTypes[$key]['ignoreInDB'] === true ;

                if (isset($argTypes[$key]) && !in_array($key, ['page', 'count', 'search']) && !$ignoreInDB)
                {
                    if (isColumnInTable($this->model, $key) && !\str_contains($argTypes[$key]['type'], 'date')) // restreindre ce traitement aux columns qui existent dans la table en cours
                    {
                        if ($argTypes[$key]['type'] != Type::string())
                        {
                            $query->where($key, $value);
                        }
                        else
                        {
                            $query->whereRaw("unaccent(".$key.") ". Outil::getOperateurLikeDB() ." unaccent('%".$value."%')");
                            //$query->where($key, Outil::getOperateurLikeDB(), "%{$value}%");
                        }
                    }
                }
                if (Schema::hasColumn($query->getModel()->getTable(), $key))
                {

                }
            }
        }

        if (isset($args['search']))
        {
            $search = strtolower(trim($args['search']));
            if ($search)
            {
                $this->search($search, $query);
            }
        }

        return $query;
    }

    /**
     * Permet d'ajouter des clauses au query avec d'autres filtres spéficiques
     *
     * @param Illuminate\Database\Eloquent\Builder $query
     * @param array $args
     * @return Illuminate\Database\Eloquent\Builder
     */
    public function addQuery(Builder &$query, array &$args)
    {

    }

    /**
     * Permet de faire des recherche text sur
     * les champs specifiê dans $searchColumns
     *
     * @param [type] $value
     * @param Builder $query
     * @return void
     */
    public function search($value, Builder &$query)
    {
        $like = config('database.default') == 'pgsql' ? 'ilike' : 'like';

        $searchColumns = $this->searchColumns;

        $query->where(function($query) use($searchColumns, $like, $value)
        {
            foreach ($searchColumns as $column)
            {
                if (isColumnInTable($this->model, $column))
                {
                    $query->where($column, $like, "%{$value}%", 'or');
                }
            }
        });

        return $query;
    }

    /**
     * Recupere le model a utiliser pour le resolve
     *
     * @return  Illuminate\Database\Eloquent\Model|null;
     */
    protected function setModelParam($get = 'model', $set)
    {
        $this->{$get} = $set;


        // dd($this->{$get});
    }

    /**
     * Permet de resoudre les les champs attributes
     *
     * @return void
     */
    private function initClass()
    {
        $ref = new ReflectionClass(get_called_class());
        $classname = $ref->getShortName();

        /**
         * Nom du query
         */
        if (!isset($this->attributes['name']))
        {
            $name = strtolower(str_ireplace('query', '', $classname));
            $this->attributes['name'] = Str::plural($name);
        }
        $this->name = $this->name ?? $this->attributes['name'];

        /**
         * Le type graphql du model
         */
        if (!isset($this->attributes['modelType']))
        {
            $this->attributes['modelType'] = str_ireplace('query', 'Type', $classname);
        }
        $this->modelType = $this->modelType ?? $this->attributes['modelType'];

        /**
         * Le nom du type pagination
         */
        if (!isset($this->attributes['paginationType']))
        {
            $this->attributes['paginationType'] = str_ireplace('query', 'PaginatedType', $classname);
        }
        $this->paginationType = $this->paginationType ?? $this->attributes['paginationType'];

        /**
         * Le model ei: App\Models\User
         */
        if (!isset($this->attributes['model']))
        {
            $this->attributes['model'] = $this->modelNamespace . '\\' . str_ireplace('query', '', $classname);
        }
        $this->model = $this->model ?? $this->attributes['model'];
    }

    public function name(): string
    {
        return $this->attributes['name'] ?? $this->name ?? class_basename(static::class);
    }
}
