<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table)
        {
            $table->id();
            $table->string('title');
            $table->text('title_en')->nullable();
            $table->string('icon')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('order')->nullable();
            $table->string('link');
            $table->boolean('can_be_managed')->default(true);
            $table->longText('permissions')->nullable();
            $table->foreignId('module_id')->nullable()->constrained()->nullOnDelete();
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
        Schema::dropIfExists('pages');
    }
}
