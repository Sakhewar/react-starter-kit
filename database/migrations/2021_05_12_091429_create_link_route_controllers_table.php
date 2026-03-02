<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLinkRouteControllersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('link_route_controllers', function (Blueprint $table)
        {
            $table->id();
            $table->string('route_name');
            $table->string('controller_name');
            $table->timestamps();
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
        Schema::dropIfExists('link_route_controllers');
    }
}
