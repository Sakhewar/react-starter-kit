<?php

namespace App\Http\Controllers;

use App\Models\{Outil};
use Illuminate\Http\Request;

class PdfExcelController extends Controller
{
    
    public function generateListQueryName(Request $request, $queryname, $type, $id = null)
    {
        return method_exists($this,$queryname) ? $this->{$queryname}($request) : Outil::generateFilePdfOrExcel($request, $queryname, $type,$id);
    }
}
