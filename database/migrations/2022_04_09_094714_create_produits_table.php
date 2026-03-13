<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProduitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('produits', function (Blueprint $table)
        {
            $table->id();
            $table->string('image')->nullable();
            $table->string('code')->nullable();
            $table->string('libelle')->nullable();
            $table->boolean('no_impact_stock')->default(false);
            $table->foreignId('marque_id')->nullable()->constrained();
            $table->foreignId('famille_produit_id')->constrained();
            $table->foreignId('sous_famille_produit_id')->nullable()->constrained('famille_produits');
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
        Schema::dropIfExists('produits');
    }
}
