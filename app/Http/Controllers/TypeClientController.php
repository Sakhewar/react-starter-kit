<?php

namespace App\Http\Controllers;

class TypeClientController extends EntityTypeController
{
    public function beforeValidateData(): void
    {
        if ($this->request->from_excel)
        {
           
        }
    }
}
