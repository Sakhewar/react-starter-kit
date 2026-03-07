<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as BaseHandler;
use Illuminate\Support\Str;
use ReflectionClass;
use Throwable;

class Handler extends BaseHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        // Ici on ne fait rien car Laravel 12 recommande d'utiliser app.php
    }

    /**
     * Formate une réponse JSON pour toutes les exceptions
     */
    public static function formatResponseError(Throwable $e)
    {
        $response = [
            'errors' => $e->getMessage() ?? "Une erreur est survenue",
            'line' => $e->getLine(),
            'trace' => $e->getTrace(),
        ];

        if ($e instanceof QueryException) {
            $response['errors'] = $e->getMessage() ?? "Erreur base de donnée";
        }

        if ($e instanceof ValidationException) {
            $errors = null;
            if ($e->errors()) {
                $messages = array_values($e->errors());
                [$errors] = array_shift($messages);
            }
            $response['errors'] = $errors;
        }

        if ($e instanceof NotFoundHttpException) {
            $previous = $e->getPrevious();
            if ($previous instanceof ModelNotFoundException) {
                $modelRefl = new ReflectionClass($previous->getModel());
                $response['message'] = "Donnée introuvable";
                $response['errors'] = "L'élement recherché n'existe pas dans "
                    . str_replace('-', ' ', Str::kebab($modelRefl->getShortName()));
                return response()->json(['data' => $response], 200);
            }
        }

        if (!($e instanceof AuthenticationException) && !($e instanceof NotFoundHttpException)) {
            return response()->json(['data' => $response], 200);
        }
    }
}