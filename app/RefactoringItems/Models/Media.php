<?php

namespace App\RefactoringItems\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    protected $guarded = ['id'];

    protected $table = 'medias';

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    public static function booted()
    {
        static::deleted(function ($model) {
            deleteUploadedFile($model->location);
        });
    }
}
