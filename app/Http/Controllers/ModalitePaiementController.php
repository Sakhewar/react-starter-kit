<?php

namespace App\Http\Controllers;

class ModalitePaiementController extends EntityTypeController
{
    protected $columStatut = 'findumois';

    public function beforeValidateData(): void
    {
        if($this->request->from_excel)
        {
            //dd($this->request->all());
        }
    }
}
