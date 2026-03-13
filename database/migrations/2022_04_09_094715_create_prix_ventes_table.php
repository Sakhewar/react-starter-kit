<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrixVentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prix_ventes', function (Blueprint $table)
        {
            $table->id();
            $table->foreignId('produit_id')->constrained()->onDelete('cascade');
            $table->foreignId('point_vente_id')->constrained();
            $table->float('prix_achat')->nullable();
            $table->float('frais')->nullable();
            $table->float('prix_revient')->nullable();
            $table->float('prix_vente')->nullable();
          
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
        Schema::dropIfExists('prix_ventes');
    }
}
