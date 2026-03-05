<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');;

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    // Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    // Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});


Route::middleware('auth')->group(function () 
{
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/', [HomeController::class, 'renderPage']);

    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::get('/page/{namepage}', [HomeController::class, 'namepage']);

    //Route::get('/pages/{namepage}/{prefixepermission?}', [HomeController::class, 'namepage']);

    Route::get('/pages/{namepage}/{prefixepermission?}', [HomeController::class, 'renderPage'])->name('page.render');

});



// // Save, Import, Statut, Delete Routes
// Route::post('/{table_name}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}/{id?}', 'ViewController@redirectToController');
//Route::get('/{table_name}.{methode?}/{id?}', 'ViewController@redirectToController');