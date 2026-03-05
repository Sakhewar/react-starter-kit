# Mise en place complète : Login + Reset Password + Spatie Permissions + Sanctum + Inertia/React

**Date de création : Mars 2026**
**Stack : Laravel + Inertia + React + Vite + shadcn/ui**

---

# 1. Installation des packages

```bash
composer require laravel/sanctum spatie/laravel-permission inertiajs/inertia-laravel
npm install @inertiajs/react
```

---

# 2. Publication des vendors

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

---

# 3. Migration

```bash
php artisan migrate
```

---

# 4. Configuration `.env`

Ajoute ou modifie :

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,localhost:8000,127.0.0.1:8000
SESSION_DOMAIN=localhost
```

---

# 5. Configuration Sanctum

Dans **config/sanctum.php**

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1,localhost:5173')),
```

---

# 6. Configuration CORS

php artisan config:publish cors

Dans **config/cors.php**

```php
'paths' => [
    'api/*',
    'sanctum/csrf-cookie',
    'login',
    'logout',
    'forgot-password',
    'reset-password',
    'register'
],
```

---

# 7. Création du middleware Permission

```bash
php artisan make:middleware CheckPermission
```

**app/Http/Middleware/CheckPermission.php**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (!Auth::user()->can($permission)) {
            abort(403, "Vous n'avez pas la permission d'accéder à cette ressource.");
        }

        return $next($request);
    }
}
```

---

# 8. Enregistrement du middleware

## Laravel 11

Dans **bootstrap/app.php**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'permission' => \App\Http\Middleware\CheckPermission::class,
    ]);
})
```

## Laravel 10

Dans **app/Http/Kernel.php**

```php
protected $routeMiddleware = [
    'permission' => \App\Http\Middleware\CheckPermission::class,
];
```

---

# 9. Routes

**routes/web.php**

```php
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');

});

Route::middleware('auth')->group(function () {

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
        ->middleware('permission:view-dashboard')
        ->name('dashboard');

    Route::get('/admin/users', fn () => Inertia::render('Admin/Users/Index'))
        ->middleware('permission:view-users')
        ->name('admin.users');

});
```

---

# 10. Contrôleurs (exemple minimal)

## LoginController

**app/Http/Controllers/Auth/LoginController.php**

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($request->only('email','password'), $request->boolean('remember'))) {

            $request->session()->regenerate();

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Identifiants incorrects.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
```

---

# 11. Passer les permissions à Inertia (Recommandé)

Modifier :

**app/Http/Middleware/HandleInertiaRequests.php**

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [

        'auth' => [
            'user' => $request->user(),
            'permissions' => $request->user()?->getAllPermissions()->pluck('name')->toArray() ?? [],
        ],

    ]);
}
```

---

# 12. Utilisation dans React

```jsx
import { usePage } from '@inertiajs/react';

function can(permission) {
  const { auth } = usePage().props;
  return auth.permissions?.includes(permission) ?? false;
}

// Exemple
if (!can('view-users')) {
  return <div>Accès refusé</div>;
}
```

---

# 13. Création de permissions (test)

Via **tinker** ou **seeder**

```php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

$admin = Role::create(['name' => 'admin']);

Permission::create(['name' => 'view-dashboard']);
Permission::create(['name' => 'view-users']);

$admin->givePermissionTo([
    'view-dashboard',
    'view-users'
]);

$user = User::find(1);
$user->assignRole('admin');
```

---

# 14. Tester l'application

Lancer le projet :

```bash
php artisan serve
npm run dev
```

Puis tester :

* `/login`
* login / logout
* reset password
* routes protégées par permission

---

# Architecture finale

```
Laravel
 ├── Sanctum (auth)
 ├── Spatie Permission (roles / permissions)
 ├── Inertia
 ├── React
 └── shadcn/ui
```

---

# Bonnes pratiques

* Toujours **protéger les routes côté backend**
* Vérifier les permissions **côté frontend uniquement pour l'affichage**
* Utiliser des **seeders pour les rôles et permissions**
* Centraliser les permissions dans une **enum ou constante**
