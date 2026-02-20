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
    public function findProduit($needle, string $field = 'declinaison_produit_id')
    {
        return $this->produits()->wherePivot($field, $needle)->first();
    }

    public function saveProduits(array $produits, $key = 'declinaison_produit_id')
    {
        $this->produits()->sync(getSyncableArray($produits, $key));
    }

    /**
     * Verifie si le produit est en stock
     *
     * @param integer $produitId
     * @param integer $toSubstract
     * @return void
     */
    public function haveEnoughtInStock(int $produitId, int $toSubstract): bool
    {
        if (method_exists(get_called_class(), 'depot'))
        {
            $produit = get_called_class() == Depot::class ?
                $this->findProduit($produitId) :
                $this->depot->findProduit($produitId);

            if (
                !is_null($produit) &&
                isset($produit->details->qte) &&
                $produit->details->qte >= $toSubstract
            ) {
                return true;
            }
        }

        return false;
    }

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
