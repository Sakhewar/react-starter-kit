<?php

namespace App\Models;

class Outil extends Model
{
    public static function listenerUsers(&$table, $add = true)
    {
        if ($add)
        {
            $table->foreignId('created_at_user_id')->nullable()->constrained('users');
            $table->foreignId('updated_at_user_id')->nullable()->constrained('users');
        }
        else
        {
            $table->dropConstrainedForeignId('created_at_user_id');
            $table->dropConstrainedForeignId('updated_at_user_id');
        }
    }
}
