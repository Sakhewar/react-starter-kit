<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\{NotifPermUser, Outil};
use App\RefactoringItems\SaveModelController;
use Illuminate\Support\Facades\DB;

class NotifPermUserController extends Controller
{
    public function markview(Request $request)
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                $errors = null;
                $data = 0;
                if (isset($request->id))
                {
                    $item = NotifPermUser::find($request->id);
                    if (!$item->view)
                    {
                       // dd("ici",$item);

                        $item->view = true;
                        $item->save();
                        //dd($item);
                        $data = 1;
                    }
                    else
                    {
                        throw new \Exception(__('customlang.notification_deja_vue'));
                    }
                }
                else
                {
                    throw new \Exception(__('customlang.donnees_manquantes'));
                }

                return response('{"data":' . $data . ' }')->header('Content-Type', 'application/json');
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }

    public function markallview()
    {

        try
        {
            $userId = Auth::user()->id;
            return DB::transaction(function () use ($userId)
            {
                $errors = null;
                $data = 0;
                if (isset($userId))
                {
                    $getAllNotifs = NotifPermUser::where('user_id', $userId)->where('view', false)->get();
                    foreach ($getAllNotifs as $notif)
                    {
                        $notif->view = true;
                        $notif->save();
                    }
                    $data = 1;
                }
                else
                {
                    throw new \Exception(__('customlang.donnees_manquantes'));
                }

                return response('{"data":' . $data . ' }')->header('Content-Type', 'application/json');
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }

    public function deleteallview()
    {
        try
        {
            $userId = Auth::user()->id;
            return DB::transaction(function () use ($userId)
            {
                $errors = null;
                $data = 0;
                if (isset($userId))
                {
                    NotifPermUser::where('user_id', $userId)->delete();
                    NotifPermUser::where('user_id', $userId)->forceDelete();
                    $data = 1;
                }
                else
                {
                    throw new \Exception(__('customlang.donnees_manquantes'));
                }

                return response('{"data":' . $data . ' }')->header('Content-Type', 'application/json');
            });
        }
        catch (\Exception $e)
        {
            return Outil::getResponseError($e);
        }
    }
}
