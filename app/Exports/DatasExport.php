<?php

namespace App\Exports;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;
use Illuminate\Support\Str;

class DatasExport implements FromView
{
    use Exportable;

    private $data = null;
    protected $queryName = null;
    private $id = null;

    public function __construct($data, $queryName, $id = null)
    {
        $this->data = $data;
        $this->queryName = $queryName;
        $this->id = $id;
    }
     
    public function view(): View
    {
        
        $FileName = (isset($this->id) ? "detail-" : "") . "{$this->queryName}";
        
        $data = [
            'data'            => isset($this->data["data"]) ?$this->data["data"] : null,
            'details'         => isset($this->data["details"]) ?$this->data["details"]  : null,
            'titre'           => isset($this->data["titre"]) ?$this->data["titre"]  : null,
            'is_excel'        => true,
        ];

        $fileName = "pdfs." . $FileName;

        if (!view()->exists($fileName))
        {
            $fileName = "pdfs.default_export";

            $className = 'App\\Models\\' . Str::studly(Str::singular($FileName));
            if (class_exists($className)) 
            {
                $data['columns'] = collect($className::$columnsExport)->where('export', true)->toArray();
            }
        }
        
        return view($fileName, $data);
    }
}
