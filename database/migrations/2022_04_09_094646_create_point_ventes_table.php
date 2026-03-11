<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePointVentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('point_ventes', function (Blueprint $table)
        {
            $table->id();
            $table->string('image')->nullable();
            $table->string('libelle')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('rccm')->nullable();
            $table->string('ninea')->nullable();
            $table->text('description')->nullable();
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
        Schema::dropIfExists('point_ventes');
    }
}
