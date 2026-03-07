<?php

namespace App\Jobs\Imports;

use App\Models\{Outil, Model, UniteMesure, User, ChapitreNomenclatureDouaniere, NomenclatureDouaniere};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\{InteractsWithQueue,SerializesModels};
use Illuminate\Support\Facades\{DB, File, Log};
use Maatwebsite\Excel\Facades\Excel;
use ReflectionClass;

class ImportDefaultFileJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var string
     */
    private $file;

    /**
     * @var string
     */
    private $pathFile;

    /**
     * @var string
     */
    private $generateLink;


    /**
     * @var Controller
     */
    private $controllerName;

    /**
     * @var Model
     */
    private $model;

    /**
     * @var User
     */
    private $user;
    private $userId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($controllerName, $model, $generateLink, string $file, $userId, $pathFile)
    {
        $this->controllerName      = $controllerName;
        $this->model               = $model;
        $this->generateLink        = $generateLink;
        $this->file                = $file;
        $this->userId              = $userId;
        $this->pathFile            = $pathFile;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Outil::setParametersExecution();

        try
        {
            $this->user = User::find($this->userId);

            $filename = $this->file;
            $data = ExceL::toArray(null, $filename);

            if (count($data) > 1)
            {
                $data1 = $data[1] ;
            }
            $data = $data[0]; // 0 => à la feuille 1



            $report = array();

            $totalToUpload = count($data) - 1;
            $totalUpload = 0;
            $lastItem = null;
            //dd($data);
            DB::transaction(function () use (&$totalUpload, &$data, &$report, &$lastItem, &$data1)
            {
                $columnsExport = $this->model::$columnsExport;

                foreach($columnsExport as $key => $columnExport)
                {
                    $columnsExport[$key]['position'] = array_search(strtolower($columnExport['column_excel']), array_map('strtolower', $data[0]));
                }

                $this->request                  = request();

                $this->request['return_object'] = true;
                $this->request['from_excel']    = true;

                $libelleFileColumn = '';
                $nb_ligne = count($data);

                $tabToSave = [] ;

                for ($i=1; $i < $nb_ligne; $i++)
                {

                    $ligne = $i + 1;
                    $errors = null;
                    $is_save = 0;
                    $row = $data[$i];
                    try
                    {
                        $libelleFileValue = "";

                        if (isset($data[$i][0]) && !empty(trim($data[$i][0])))
                        {
                            $requestData                    = [];

                            // on vide les id pour éviter que certaines lignes ne repartent avec l'id de la précédente ligne
                            $requestData['id']              = null;
                            $this->request['id']            = null;

                            foreach ($columnsExport as $key => $columnExport)
                            {
                                $requestData[$columnsExport[$key]['column_db']] = trim($row[$columnsExport[$key]['position']]);
                                $this->request[$columnsExport[$key]['column_db']] = trim($row[$columnsExport[$key]['position']]);

                                if ((isset($columnsExport[$key]['column_unique']) && $columnsExport[$key]['column_unique']))
                                {
                                    if ($i==1)
                                    {
                                        $libelleFileColumn .= (!empty($libelleFileColumn) ? " - " : "") . $columnsExport[$key]['column_excel'];
                                    }
                                    $libelleFileValue .= (!empty($libelleFileValue) ? " - " : "") . trim($row[$columnsExport[$key]['position']]);
                                }
                            }

                            $this->afterLoadRequest($data,$i,$nb_ligne, $tabToSave,$data1,$columnsExport);
                            //dd($this->request->all());
                            $result = app()->make("{$this->controllerName}")->callAction('save', $parameters = array($this->request));
                            if ($result->status() === 200 || $result->status() === 302)
                            {
                                $is_save = 1;
                            }
                        }
                    }
                    catch (\Exception $e)
                    {
                        $errors = $e->getMessage();
                        //$errors = $e->getMessage() ." \n fichier ==> " .  $e->getFile() . " \n Ligne ==> ".$e->getLine() ;
                    }

                    if (!isset($errors))
                    {
                        $totalUpload ++;
                    }
                    if (!$is_save)
                    {
                        $report[] = [
                            'ligne' => $ligne,
                            $libelleFileColumn => $libelleFileValue,
                            'cause' => $errors,
                            // 'is_save' => $is_save,
                        ];
                    }
                }
            });
            //dd("here");
            Outil::atEndUploadData($this->pathFile, $this->generateLink, $report, $this->user, $totalToUpload, $totalUpload, " des données");

        }
        catch (\Exception $e)
        {
            try
            {
                File::delete($this->pathFile);
            }
            catch (\Exception $eFile) {};
            throw new \Exception($e);
        }

    }


    public function afterLoadRequest(&$data, &$i, &$nb_ligne, &$tabToSave,&$data1, &$columnsExport)
    {
        if (str_contains(strtolower($this->model), "familletaxedouaniere"))
        {
            $liaisons = [];
            while (($i+1) <= $nb_ligne && !isset($data[$i+1][0]))
            {
                $i++;
                if (isset($data[$i][1]))
                {
                    $liaisons[] = [
                        "code" => $data[$i][1],
                        "nom" => $data[$i][2],
                        "taux" => $data[$i][3]
                    ];
                }
            }
            $this->request['liaisons'] = $liaisons;
        }
        if (str_contains(strtolower($this->model), "fournisseur"))
        {
            $liaisons = [];
            while (($i+1) <= $nb_ligne && !isset($data[$i+1][0]))
            {
                $i++;
                if (isset($data[$i][1]))
                {
                    $liaisons[] = $data[$i][1];
                }
            }
            $this->request['liaisons'] = $liaisons;
        }
        if (str_contains(strtolower($this->model), "chapitrenomenclaturedouaniere"))
        {
            $codeChapitre = trim(str_replace(['.'], '',$data[$i][0]));
            $allData = [];
            $specific = !empty($data[$i][0]) && !empty($data[$i][1]) && !empty($data[$i][2]);

            if ($specific)
            {
                $this->request['all_data'] = [];
                $y = [
                    0               => null,
                    1               => $data[$i][1],
                    2               =>"- ". $data[$i][2],
                    "unite_mesure"  => $data[$i][3],
                ];

                $otherData = $this->getCorrespondantValue($data1,$codeChapitre);
                if (count($otherData) > 0)
                {
                    $y["originefr"] = $otherData[2] ;
                    $y["origineetr"] = $otherData[3] ;
                    $y["export"] = $otherData[4] ;
                    $y["remise"] = $otherData[5] ;
                }

                $taxes = $this->getTaxesRow($columnsExport);
                $details = [] ;

                foreach ($taxes as $t)
                {
                    $words = explode(' ', $t["column_excel"]);
                    $nom = implode(' ', array_slice($words, 0, -1));
                    $codeFamille = end($words);
                    $details[] = [
                        "nom" => $nom,
                        "codeFamille" => $codeFamille,
                        "taux" => $data[$i][$t["position"]]

                    ];
                }

                $y["details"] = $details;

                $allData[] = $y ;
            }

            while (($i) <= $nb_ligne && empty($data[$i+1][0]))
            {
                $i++;

                if (!empty($data[$i][2]))
                {
                    if (empty($data[$i][1]))
                    {
                        $allData[] = $data[$i] ;
                    }
                    else
                    {
                        $y = [
                            0               => $data[$i][0],
                            1               => $data[$i][1],
                            2               => $data[$i][2],
                            "unite_mesure"  => $data[$i][3],
                        ];

                        $otherData = $this->getCorrespondantValue($data1,$codeChapitre);
                        if (count($otherData) > 0)
                        {
                            $y["originefr"] = $otherData[2] ;
                            $y["origineetr"] = $otherData[3] ;
                            $y["export"] = $otherData[4] ;
                            $y["remise"] = $otherData[5] ;
                        }

                        $taxes = $this->getTaxesRow($columnsExport);
                        $details = [] ;

                        foreach ($taxes as $t)
                        {
                            $words = explode(' ', $t["column_excel"]);
                            $nom = implode(' ', array_slice($words, 0, -1));
                            $codeFamille = end($words);
                            $details[] = [
                                "nom" => $nom,
                                "codeFamille" => $codeFamille,
                                "taux" => $data[$i][$t["position"]]

                            ];
                        }

                        $y["details"] = $details;

                        $allData[] = $y ;
                    }
                }


            }

            $this->request['all_data'] = [];
            if (count($allData) > 0)
            {
                $this->request['all_data'] = $allData;
            }
        }
    }

    public function getTaxesRow($array): array
    {
        $isTaxeTrueRows = [];

        foreach ($array as $row)
        {
            if (isset($row['is_taxe']) && $row['is_taxe'] === true)
            {
                $isTaxeTrueRows[] = $row;
            }
        }
        return $isTaxeTrueRows ;
    }



    //Cette fonction permet de recuperer les valeurs de chaque ligne dans l'autre feuille
    public function getCorrespondantValue(&$data1,&$code): array
    {
        $rtr = [] ;
        //enlever
        if (isset($data1))
        {
            $nb_ligne = count($data1) ;
            for ($i = 1; $i < $nb_ligne; $i++)
            {
                $row = $data1[$i];

                if (trim($row[0]) === $code || strpos($code, trim($row[0])) === 0) //Si le code a une correspondance directe
                {
                    $rtr = $row ;
                    break;
                }
            }
        }
        return $rtr;
    }

}
