<?php

namespace App\RefactoringItems\Models;

use MnShared\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

trait HasMedia
{
    public function medias()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function media()
    {
        return $this->morphOne(Media::class, 'mediable');
    }

    public function getImagesAttribute()
    {
        return $this->medias()->get()->map(function ($item) {
            return [
                'image' => $item->url,
                'fullname'  => $item->name
            ];
        });
    }

    /* Posait problème pour les utilisateurs
     * public function getImageAttribute()
    {
        $media = $this->media;

        if (!is_null($media)) {
            return $media->url;
        }

        return url('default.png');
    }*/

    public function saveMedias(?array $medias)
    {
        if ($medias && count($medias)) {
            $imgs = $this->medias()->get()->pluck('url')->toArray();
            $toDrop = array_values(array_diff($imgs, $medias));

            if (count($toDrop)) {
                Media::whereIn('url', $toDrop)->delete();
            }

            foreach ($medias as $key => $media) {
                if ($media instanceof UploadedFile) {
                    $this->saveMedia($media, is_string($key) ? $key : null);
                }
            }
        }
    }

    public function saveMedia($media, string $name = null)
    {
        if (!is_null($media) && $media instanceof UploadedFile) {
            if ($name) {
                Media::where('name', $name)->delete();
            }

            $this->media()->create(storeUploadFile($media, $name));
        }
    }
}
