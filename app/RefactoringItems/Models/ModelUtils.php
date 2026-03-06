<?php

namespace App\RefactoringItems\Models;

use ErrorException;
use ReflectionClass;
use App\Models\Depot;
use ReflectionMethod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

trait ModelUtils
{
    /**
     * Permet de recuperer les relations d'un model
     *
     * @return void
     */
    public function relationships()
    {
        $model = new static();
        $relationships = [];

        foreach ((new ReflectionClass($model))->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
            if (
                $method->class != get_class($model) ||
                !empty($method->getParameters()) ||
                $method->getName() == __FUNCTION__
            ) {
                continue;
            }

            try
            {
                $return = $method->invoke($model);

                if ($return instanceof Relation) {
                    $relationships[$method->getName()] = [
                        'type' => (new ReflectionClass($return))->getShortName(),
                        'model' => (new ReflectionClass($return->getRelated()))->getName(),
                    ];
                }
            } catch (ErrorException $e) {}
        }

        return $relationships;
    }

    /**
     * Permet de enregistrer les hasManyRelation
     *
     * @param array|null $data
     * @param [type] $relatedModel
     * @param string $relationName
     * @return void
     */
    public function saveHasManyRelation($data, $relatedModel, string $relationName = null, $whereRawQuery = "1=1")
    {
        if (true)
        {
            $tableName = (new $relatedModel())->getTable();
            $relationName = $relationName ?: $tableName;

            $toDeletes = array_values(array_diff(
                $this->{$relationName}()
                    ->whereRaw($whereRawQuery)
                    ->get()->pluck('id')->toArray(),
                collect($data)->pluck('id')->toArray()
            ));

            if (count($toDeletes))
            {
                DB::table($tableName)->whereIn('id', $toDeletes)->delete();
            }

            foreach ($data as $item)
            {
                $item = (array) $item;

                $id = isset($item['id']) ? $item['id'] : null;

                if ($id && !in_array($id, $toDeletes))
                {
                    $itemDB = $relatedModel::find($id);
                    $itemDB && $itemDB->update($item);
                    continue;
                }

                if (!$id)
                {
                    $this->{$relationName}()->create($item);
                }
            }
        }
    }

    /**
     * Permet d'enregistrer les belongsToMany
     *
     * @param array|Illuminate\Support\Collection $data
     * @param string $relationName
     * @param string $relatedKey
     * @param boolean $isUnique
     * @param string $pivot
     * @return void
     */
    public function saveBelongsToManyRelation($data, string $relationName, string $foreignKey, string $relatedKey, bool $isUnique = true, string $pivot = null)
    {
        if ($isUnique) {
            $this->{$relationName}()->sync(
                getSyncableArray($data, $relatedKey)
            );

            return;
        }

        if ($data instanceof Collection) {
            $data = $data->toArray();
        }

        if (!$isUnique && $pivot) {
            $toDeletes = array_values(array_diff(
                $this->{$relationName}()->get()->pluck('id')->toArray(),
                collect($data)->pluck('id')->toArray()
            ));

            $tableName = (new $pivot())->getTable();
            if (count($toDeletes)) {
                DB::table($tableName)->whereIn('id', $toDeletes)->delete();
            }

            $data = array_filter($data, function ($item) use ($toDeletes) {
                $id = isset($item['id']) ? $item['id'] : null;
                return !in_array($id, $toDeletes);
            });

            foreach ($data as $item) {
                $item = arrayWithOnly($item, $pivot);
                $item[$foreignKey] = $this->id;
                $id = isset($item['id']) ? $item['id'] : null;


                $r = $pivot::find($id);
                if ($r) {
                    $r->update($item);
                } else {
                    $pivot::create($item);
                }
            }
        }
    }
}
