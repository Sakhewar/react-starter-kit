"use client";

import { usePage } from "@inertiajs/react";


import AppSidebar from "@/components/AppSideBar";

import * as Views from "./views";
import BaseContent from "@/components/BaseContent";
import AppHeader from "@/components/AppHeader";
import { useGlobalStore } from "@/hooks/backoffice";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/authGuard/authguard";

export default function MAinEntry()
{

  const { namepage, page } = usePage<{auth: { user: { name: string } }; breadcrumb: string[]; namepage:string; page : any}>().props;

  const attributeName = String(page?.link || "").replaceAll("/", "");
  const DynamicComponent = (namepage in Views ? Views[namepage as keyof typeof Views] : null);

  const { initialize, reset} = useGlobalStore();

  useEffect(() =>
  {
    reset();
    initialize({attributeName,page,onlyPageChange:false, force:true});
  }, [attributeName, namepage, initialize]);
  
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
              {DynamicComponent && <DynamicComponent page={page} />}

              {!DynamicComponent && <BaseContent page={page} attributeName={attributeName} namepage={page?.title ?? ""} />}
            </div>
          </main>
        </div>
        <Toaster richColors />
      </div>
    </AuthGuard>
  );
}