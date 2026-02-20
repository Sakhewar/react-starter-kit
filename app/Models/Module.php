<?php

namespace App\Models;

class Module extends Model
{
    public function sub_pages()
    {
        return $this->hasManyThrough(Page::class, Module::class)->orderBy('pages.order');
    }


    public function pages()
    {
        return $this->hasMany(Page::class)->orderBy('order');
    }

    public function all_pages()
    {
        $pages = $this->sub_pages->toArray();
        foreach ($this->pages as $page)
        {
            array_push($pages, $page);
        }
        return $pages;
    }

    public function permissions()
    {
        $all_permissions = array();
        $getPermissions = $this->pages->pluck('permissions')->toArray();
        if (count($getPermissions) > 0)
        {
            array_push($all_permissions, $getPermissions);
        }
        $getPermissions = $this->sub_pages->pluck('permissions')->toArray();
        if (count($getPermissions) > 0)
        {
            array_push($all_permissions, $getPermissions);
        }

        $permissions = array();
        $permissionStr = "";
        foreach ($all_permissions as $keyTab => $permissionTab)
        {
            $permissionStr .= ($keyTab>0 ? "," : "");
            foreach ($permissionTab as $key => $permission)
            {
                $permissionStr .= ($key>0 ? "," : "") . $permission[0];
            }
        }
        return explode(",", $permissionStr);
    }
}
