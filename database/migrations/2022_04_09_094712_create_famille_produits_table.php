<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFamilleProduitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('famille_produits', function (Blueprint $table)
        {
            $table->id();
            $table->string('libelle')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('famille_produit_id')->nullable()->constrained();
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
        Schema::dropIfExists('famille_produits');
    }
}
