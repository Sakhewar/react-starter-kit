<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotifsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifs', function (Blueprint $table)
        {
            $table->id();
            $table->text('message');
            $table->text('title')->nullable();
            $table->text('icon')->default('newnotif');
            $table->text('toast')->default('info');
            $table->text('link')->nullable();
            $table->foreignId('page_id')->nullable()->constrained();
            $table->foreignId('module_id')->nullable()->constrained();
            $table->softDeletes();
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
        Schema::dropIfExists('notifs');
    }
}
