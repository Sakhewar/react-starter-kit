<?php

namespace App\Models;

class Page extends Model
{
    public function setPermissionsAttribute($value)
    {
        if (is_array($value))
        {
            $this->attributes['permissions'] = implode(",", $value);
        }
    }

    public function getPermissionsAttribute($value)
    {
        return (isset($value) && !empty($value)) ? explode(", ", $value) : [];
    }
}
