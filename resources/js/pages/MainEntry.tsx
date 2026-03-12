"use client";

import { usePage } from "@inertiajs/react";


import AppSidebar from "@/components/AppSideBar";

import * as CustomPages from "./CustomPages";
import BaseContent from "@/components/BaseContent";
import AppHeader from "@/components/AppHeader";
import { useGlobalStore } from "@/hooks/backoffice";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/authGuard/authguard";
import { useAuthStore } from "@/hooks/authStore";
import { pageWithTabs } from "@/configs/listOfPagesWithTabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MAinEntry()
{

  const { namepage, page,auth} = usePage<{auth: { user: { name: string } }; breadcrumb: string[]; namepage:string; page : any}>().props;

  const attributeName = String(page?.link || "").replaceAll("/", "");

  const [queryName, setQueryName] = useState<string | null>(null);

  const { initialize, reset, setState, scope} = useGlobalStore();

  //Si dans la page on doit avoir des tabs

  const hasTabs = attributeName in pageWithTabs ? pageWithTabs[attributeName as keyof typeof pageWithTabs] : [];
  const [activeTab, setActiveTab] = useState(hasTabs.length > 0 ? hasTabs[0] : null);
  

  //Pour rediger vers sa propre page si on veux pas utiliser le composant de base
  const DynamicComponent = (namepage in CustomPages ? CustomPages[namepage as keyof typeof CustomPages] : null);  


  const {afterLogin} = useAuthStore(); 

  useEffect(() =>
  {
    if(queryName != null)
    {
      reset();
      initialize({attributeName,page,onlyPageChange:false, force:true});
    }
  }, [queryName, namepage, initialize]);

  useEffect(()=>
  {
    if(hasTabs.length == 0)
    {
      setQueryName(attributeName);
    }
    else
    {
      setQueryName(activeTab!= null ? activeTab.attributeName : null);
    }

  },[attributeName])

  useEffect(()=>
    {
      if(auth.user != null)
      {
        afterLogin(auth.user);
      }
  
    },[auth])
  
  return (
    <AuthGuard>
      <div className="h-screen w-full flex overflow-hidden bg-background">
          <div className="hidden md:block h-full">
            <AppSidebar />
          </div>

        <div className="flex-1 flex flex-col min-w-0 h-screen">
          
          <AppHeader />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:py-6 lg:px-8">
              <div className="flex items-center justify-center mb-10">
                {
                  hasTabs.map((tab)=>
                  {
                    return(
                      <Button
                        key={tab.key}
                        type="button"
                        size="sm"
                        variant={"ghost"}
                        onClick={()=>{setActiveTab(tab);setQueryName(tab.attributeName)}}
                        className={cn(
                          "flex items-center gap-1.5 h-8 px-3 text-xs font-medium cursor-pointer",
                          activeTab?.key === tab.key ? "border-b-3 border-b-primary rounded-b-none" : ""
                        )}
                      >
                        {tab.icon && (
                          <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{tab.icon}</span>
                        )}
                        {tab.namepage}
                      </Button>
                      )
                  })
                }
              </div>

              {DynamicComponent && <DynamicComponent page={page} />}

              {!DynamicComponent && queryName && <BaseContent page={page} attributeName={queryName} permissionName={activeTab ? activeTab.permissionName : null} namepage={activeTab ? activeTab.namepage : page?.title ?? ""} />}
            </div>
          </main>
        </div>
        <Toaster richColors />
      </div>
    </AuthGuard>
  );
}