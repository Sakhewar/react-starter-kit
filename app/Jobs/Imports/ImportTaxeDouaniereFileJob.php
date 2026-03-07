<?php

namespace App\Jobs\Imports;

use App\Models\{Assurance, Categorie, Model, Outil, User};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\{InteractsWithQueue,SerializesModels};
use Illuminate\Support\Facades\{DB, File};
use Maatwebsite\Excel\Facades\Excel;

class ImportTaxeDouaniereFileJob implements ShouldQueue
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
    public function __construct($model, $generateLink, string $file, $userId, $pathFile)
    {
        $this->model = $model;
        $this->generateLink = $generateLink;
        $this->file = $file;
        $this->userId = $userId;
        $this->pathFile = $pathFile;
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
            $data = $data[0]; // 0 => à la feuille 1

            $report = array();

            $totalToUpload = count($data) - 1;
            $totalUpload = 0;
            $lastItem = null;
            DB::transaction(function () use (&$totalUpload, &$data, &$report, &$lastItem)
            {
                for ($i=1; $i < count($data); $i++)
                {
                    $myRequest = new \Illuminate\Http\Request(['executer' => 'modereglement', 'code' => null, 'date_debut' => null, 'date_fin' => null]);

                    dd('here am i', $data);

                    $errors = null;
                    $is_save = 0;
                    $row = $data[$i];
                    try
                    {
                        $nom                        = trim($row[0]);
                        $email                      = trim($row[1]);
                        $telephone                  = trim($row[2]);
                    }
                    catch (\Exception $e)
                    {
                        $errors = $e->getMessage();
                        $report[] = [
                            'ligne' => ($i),
                            'libelle' => "Assurance",
                            'erreur' => $errors,
                            'is_save' => $is_save,
                        ];
                        break;
                    }

                    if (empty($nom))
                    {
                        $errors = "La colonne nom est obligatoire";
                    }
                    else if (empty($email))
                    {
                        $errors = "La colonne email est obligatoire";
                    }
                    else if (empty($telephone))
                    {
                        $errors = "La colonne téléphone est obligatoire";
                    }
                    else
                    {
                        $newAssurance = Assurance::query()->whereRaw('TRIM(lower(nomcomplet)) = TRIM(lower(?))',[$nom])->first();

                    }

                    if (!isset($errors))
                    {
                        if (!isset($newAssurance))
                        {
                            $ass = Assurance::all()->last();
                            if ($ass!=null)
                            {
                                $id_ass = $ass->id + 1;
                            }
                            else
                            {
                                $id_ass = 1;
                            }
                            $mat = substr(strtoupper(uniqid().rand(1000,10000)), 8,4).$id_ass;
                            $newAssurance = new Assurance();
                            $newAssurance->matricule = $mat;
                        }

                        $newAssurance->nomcomplet                = $nom;
                        $newAssurance->email              = $email;
                        $newAssurance->telephone          = $telephone;

                        $is_save                                    = $newAssurance->save();
                        $lastItem                                   = $newAssurance;
                    }

                    if($is_save)
                    {
                        $totalUpload ++;
                    }
                    if (!empty($nom) && !$is_save)
                    {
                        $report[] = [
                            'ligne' => ($i + 1),
                            'libelle' => $nom,
                            'erreur' => $errors,
                            'is_save' => $is_save,
                        ];
                    }
                }
            });
            Outil::atEndUploadData($this->pathFile, $this->generateLink, $report, $this->user, $totalToUpload, $totalUpload, " des assurances");

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
}
