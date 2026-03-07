<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFournisseursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fournisseurs', function (Blueprint $table)
        {
            $table->id();
            $table->string('code')->nullable();
            $table->string('nom')->nullable();
            $table->text('image')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->string('faxe')->nullable();
            $table->string('fixe')->nullable();
            $table->string('ninea')->nullable();
            $table->string('rcc')->nullable();
            $table->string('adresse_postale')->nullable();
            $table->string('adresse_geographique')->nullable();
            $table->string('description')->nullable();
            $table->foreignId('pay_id')->nullable()->constrained();
            $table->string('ville')->nullable();
            $table->integer('status')->default(1);
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
        Schema::dropIfExists('fournisseurs');
    }
}
