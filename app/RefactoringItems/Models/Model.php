<?php

namespace App\RefactoringItems\Models;

use Illuminate\Support\Facades\{Auth, DB, Schema};
use Illuminate\Database\Eloquent\Model as EloquentModel;

class Model extends EloquentModel
{
    /**
     * Pour définir les colonnes de la feuille export et import
     *
     * @var string|null
     */

    public static $columnsExport =  [];

    /**
     * Le prefix du code
     *
     * @var string|null
     */
    protected $codePrefix = null;



    protected $parmettrage = null;

    /**
     * Le champ ou enregistrer le code
     *
     * @var string
     */
    protected $codeField = 'code';

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->bindTrackingEvents();
    }

    /**
     * Permet de generer un code
     *
     * @return string|null
     */
    public static function generateCode(string $prefix, ?string $id = null): ?string
    {
        return  $prefix . str_pad($id ?? substr(randomNumber(5), 0, 5), 5, 0, STR_PAD_LEFT);
    }

    /**
     * Permet de recuperer le prefix du code
     *
     * @return string|null
     */
    public function getCodePrefix(): ?string
    {
        return $this->codePrefix;
    }



    public function getParamettrage()
    {
        return $this->paramettrage;
    }

    /**
     * Permet d'attacher des events pour
     * le tracking
     *
     * @return void
     */
    protected function bindTrackingEvents()
    {
        if (method_exists(get_called_class(), 'trackEvents')) {
            $this->dispatchesEvents = array_merge(
                $this->dispatchesEvents,
                $this->trackEvents()
            );
        }
    }

    protected static function booted()
    {
        parent::booted();

        self::created(function ($model) {
            if (is_null($model->codeField)) {
                if (Schema::hasColumn($model->getTable(), $model->codeField)) {
                    $model->{$model->codeField} = self::generateCode($model->getCodePrefix() ?? '', $model->id);
                    $model->save();
                }
            }
        });
    }


    /**
     * Save the model to the database.
     *
     * @param  array  $options
     * @return bool
     */
    public function save(array $options = [])
    {
        // Code to listening which user setting data
        if (Auth::user())
        {
            // dd(Auth::user()->toArray());
            // dd(array_key_exists('type_client_id', Auth::user()->toArray()), Auth::user());
            if (!isset($this->id))
            {
                $this->created_at_user_id = !array_key_exists('type_client_id', Auth::user()->toArray()) ? Auth::user()->id : null;
            }
            else if (($this->wasChanged() || $this->isDirty()))
            {
                $this->updated_at_user_id = !array_key_exists('type_client_id', Auth::user()->toArray()) ? Auth::user()->id : null;

                //
                $tableDb = $this->getTable();
                //$DataToPopageUpdatedAtUser = DB::select(DB::raw("SELECT distinct confrelid::regclass as parent FROM pg_constraint where contype='f' AND confdeltype = 'c' and conrelid='{$tableDb}'::regclass;"));
                $DataToPopageUpdatedAtUser = DB::select("SELECT distinct confrelid::regclass as parent FROM pg_constraint where contype='f' AND confdeltype = 'c' and conrelid='{$tableDb}'::regclass;");

                foreach ($DataToPopageUpdatedAtUser as $oneTable)
                {
                    $foreignKeyTable = substr($oneTable->parent, 0, (strlen($oneTable->parent) - 1 )) . '_id';
                    DB::table($oneTable->parent)->where('id', $this->$foreignKeyTable)->update(['updated_at_user_id' => $this->updated_at_user_id]);
                }
            }
        }

        $this->mergeAttributesFromClassCasts();

        $query = $this->newModelQuery();

        // If the "saving" event returns false we'll bail out of the save and return
        // false, indicating that the save failed. This provides a chance for any
        // listeners to cancel save operations if validations fail or whatever.
        if ($this->fireModelEvent('saving') === false) {
            return false;
        }

        // If the model already exists in the database we can just update our record
        // that is already in this database using the current IDs in this "where"
        // clause to only update this model. Otherwise, we'll just insert them.
        if ($this->exists) {
            $saved = $this->isDirty() ?
                $this->performUpdate($query) : true;
        }

        // If the model is brand new, we'll insert it into our database and set the
        // ID attribute on the model to the value of the newly inserted row's ID
        // which is typically an auto-increment value managed by the database.
        else {
            $saved = $this->performInsert($query);

            if (! $this->getConnectionName() &&
                $connection = $query->getConnection()) {
                $this->setConnection($connection->getName());
            }
        }

        // If the model is successfully saved, we need to do a few more things once
        // that is done. We will call the "saved" method here to run any actions
        // we need to happen after a model gets successfully saved right here.
        if ($saved) {
            $this->finishSave($options);
        }

        return $saved;
    }
}
