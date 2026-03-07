<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModalitePaiementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modalite_paiements', function (Blueprint $table)
        {
            $table->id();
            $table->string('libelle');
            $table->integer('nbre_jour')->nullable();
            $table->string('description')->nullable();
            $table->boolean('findumois')->default(false);
            $table->timestamps();
            $table->softDeletes();
            \App\Models\Outil::listenerUsers($table);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modalite_paiements');
    }
}
