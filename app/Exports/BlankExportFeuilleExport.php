<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromView;

class BlankExportFeuilleExport implements FromView
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }

    public function view(): View
    {
        // dd($this->model::$columnsExport);
        $columns = collect($this->model::$columnsExport)->where('import', true)->toArray();
        return view('pdfs.tramemodele', [
            'columns' => $columns
        ]);
    }
}