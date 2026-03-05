<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LogiquePermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groupe_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tag');
            $table->string('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            \App\Models\Outil::listenerUsers($table);
        });

        Schema::create('type_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('couleur')->default('info');
            $table->string('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            \App\Models\Outil::listenerUsers($table);
        });

        Schema::table('permissions', function (Blueprint $table)
        {
            $table->foreignId('groupe_permission_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('type_permission_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groupe_permissions');
        Schema::dropIfExists('type_permissions');
        Schema::table('permissions', function (Blueprint $table)
        {
            $table->dropConstrainedForeignId('groupe_permission_id');
            $table->dropConstrainedForeignId('type_permission_id');
        });
    }
}
