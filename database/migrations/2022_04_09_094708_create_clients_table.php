<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table)
        {
            $table->id();
            $table->string('code')->nullable();
            $table->string('nom_complet')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->text('image')->nullable();
            $table->string('adresse')->nullable();
            $table->text('description')->nullable();
            $table->integer('status')->default(1);
            $table->float('remise')->nullable();
            $table->float('plafond')->nullable();
            $table->foreignId('type_client_id')->nullable()->constrained();
            $table->foreignId('modalite_paiement_id')->nullable()->constrained();
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
        Schema::dropIfExists('clients');
    }
}
