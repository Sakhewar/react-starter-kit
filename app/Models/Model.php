<?php

namespace App\Models;

use App\Traits\HasModelRelationships;
use App\RefactoringItems\Models\Model as SharedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\RefactoringItems\Models\{ModelUtils, Trackable};
use Illuminate\Database\Eloquent\Model as EloquentModel;

class Model extends EloquentModel
{
    use HasFactory;
    use HasModelRelationships;
    use ModelUtils;
    use Trackable;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var string[]|bool
     */
    protected $guarded = ['id'];

    public static $columnsExport =  [
        [
            "column_db"     => "libelle",
            "column_excel"  => "Libellé",
            "column_unique" => true,
            "import"        => true,
            "export"        => true,
        ],
        [
            "column_db"     => "description",
            "column_excel"  => "Description",
            "column_unique" => true,
            "import"        => true,
            "export"        => true,
        ],
    ];

    public static function getDirectoryUploads($model)
    {
        if(!isset($model))
        {
            return null;
        }

        $name_table = (new $model)->getTable();

        return "uploads/" . $name_table;
    }
}
