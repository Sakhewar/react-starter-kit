<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddListenerToAllTables extends Migration
{
    private $final_nametables;

    public function __construct()
    {
        $this->final_nametables = \Illuminate\Support\Facades\DB::connection('pgsql')->select("SELECT split_part(replace(migration, '_table', ''),'_create_',2) AS name_table  from migrations where migration ilike '%_create_%_table' order by id");
    }
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->final_nametables as $oneTable)
        {
            if (Schema::hasTable($oneTable->name_table))
            {
                Schema::table($oneTable->name_table, function (Blueprint $table) use ($oneTable)
                {
                    if (!Schema::hasColumn($oneTable->name_table, 'created_at_user_id'))
                    {
                        \App\Models\Outil::listenerUsers($table);
                    }
                    if (!Schema::hasColumn($oneTable->name_table, 'activer'))
                    {
                        $table->integer('activer')->index()->default(1);
                    }
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        foreach ($this->final_nametables as $oneTable)
        {
            if (Schema::hasTable($oneTable->name_table))
            {
                Schema::table($oneTable->name_table, function (Blueprint $table)
                {
                    $table->dropForeign(['created_at_user_id']);
                    $table->dropForeign(['updated_at_user_id']);
                    $table->dropColumn(['created_at_user_id', 'updated_at_user_id']);
                });
            }
        }
    }
}
