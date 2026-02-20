<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('title_en')->nullable();
            $table->string('icon');
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('order')->nullable();
            $table->foreignId('mode_link_id')->nullable()->constrained();
            $table->foreignId('module_id')->nullable()->constrained()->cascadeOnDelete();
            \App\Models\Outil::listenerUsers($table);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modules');
    }
}
