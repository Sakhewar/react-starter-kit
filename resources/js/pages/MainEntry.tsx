"use client";

import { usePage } from "@inertiajs/react";


import AppSidebar from "@/components/AppSideBar";

import * as Views from "./views";
import BaseContent from "@/components/BaseContent";
import AppHeader from "@/components/AppHeader";

export default function MAinEntry()
{
  const { namepage, page } = usePage().props;
  const { auth, breadcrumb } = usePage<{
    auth: { user: { name: string } };
    breadcrumb: string[];
  }>().props;

  const attributeName = String(page?.link || "").replaceAll("/", "");
  const DynamicComponent = Views[namepage] || null;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
        <div className="hidden md:block h-full">
          <AppSidebar />
        </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        
        <AppHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {DynamicComponent && <DynamicComponent page={page} />}

            {!DynamicComponent && <BaseContent page={page} attributeName={attributeName} namepage={page?.title ?? ""} />}
          </div>
        </main>
      </div>
    </div>
  );
}