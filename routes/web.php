<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PdfExcelController;
use App\Http\Controllers\ViewController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');;

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.reset');

    // Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    // Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});


Route::middleware('auth')->group(function () 
{
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/', [HomeController::class, 'renderPage']);

    Route::get('/pages/{namepage}/{prefixepermission?}', [HomeController::class, 'renderPage'])->name('page.render');

    Route::get('/generate-{queryname}-{type}', [PdfExcelController::class, 'generateListQueryName']);
    Route::get('/generate-{queryname}-{type}/{id}', [PdfExcelController::class, 'generateListQueryName']);

    // Save, Import, Statut, Delete Routes
    Route::post('/{table_name}', [ViewController::class, 'redirectToController']);
    Route::post('/{table_name}/{methode?}', [ViewController::class, 'redirectToController']);
    Route::post('/{table_name}/{methode?}/{id?}', [ViewController::class, 'redirectToController']);
    Route::get('/{table_name}.{methode?}/{id?}', [ViewController::class, 'redirectToController']);

});



