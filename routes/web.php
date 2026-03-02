<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

//Route::inertia('/', 'welcome')->name('home');
//Route::inertia('/', [HomeController::class, 'index'])->name('home');

Route::get('/', [HomeController::class, 'index'])->name('home');



// // Save, Import, Statut, Delete Routes
// Route::post('/{table_name}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}/{id?}', 'ViewController@redirectToController');
// Route::get('/{table_name}.{methode?}/{id?}', 'ViewController@redirectToController');