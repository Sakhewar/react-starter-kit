<?php

namespace App\Models;

class Preference extends Model
{
    public static $columnName            = 'email_rapport';

    public static function emailrapport()
    {
        return self::where('nom',self::$columnName)->first();
    }
}
