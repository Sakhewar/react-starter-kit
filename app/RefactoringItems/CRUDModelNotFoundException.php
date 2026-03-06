<?php

namespace App\RefactoringItems;

use Exception;

class CRUDModelNotFoundException extends Exception
{
    private $controller = null;

    private $model = null;

    public function setController(string $controllerName)
    {
    }

    public function setModel(string $modelName)
    {
    }


    public function getController()
    {
    }

    public function getModel()
    {
    }


    public function __construct($message = null, $code = 500, Exception $previous = null)
    {
        if (is_null($message)) {
            $message =  "Le model pour " . debug_backtrace()[1]['class'] . " n'est pas défini.";
        }
        parent::__construct($message, $code, $previous);
    }
}
