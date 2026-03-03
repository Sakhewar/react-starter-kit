<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

//Route::inertia('/', 'welcome')->name('home');
//Route::inertia('/', [HomeController::class, 'index'])->name('home');

Route::get('/', [HomeController::class, 'renderPage']);

Route::get('/home', [HomeController::class, 'index'])->name('home');

Route::get('/page/{namepage}', [HomeController::class, 'namepage']);

//Route::get('/pages/{namepage}/{prefixepermission?}', [HomeController::class, 'namepage']);

Route::get('/pages/{namepage}/{prefixepermission?}', [HomeController::class, 'renderPage'])->name('page.render');



// // Save, Import, Statut, Delete Routes
// Route::post('/{table_name}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}', 'ViewController@redirectToController');
// Route::post('/{table_name}/{methode?}/{id?}', 'ViewController@redirectToController');
//Route::get('/{table_name}.{methode?}/{id?}', 'ViewController@redirectToController');