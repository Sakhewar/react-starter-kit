

import { usePage } from "@inertiajs/react";
import AppSidebar from "@/components/AppSideBar";
import * as CustomPages from "./CustomPages";
import BaseContent from "@/components/BaseContent";
import AppHeader from "@/components/AppHeader";
import { useGlobalStore } from "@/hooks/backoffice";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/authGuard/authguard";
import { useAuthStore } from "@/hooks/authStore";
import { pageWithTabs } from "@/configs/listOfPagesWithTabs";
import { Button } from "@/components/ui/button";
import { cn, PaletteProps } from "@/lib/utils";

  // ----------- Types -----------

type Tab = {
  key            : number;
  attributeName  : string;
  namepage       : string;
  permissionName : string | null;
  icon          ?: React.ReactNode;
};

type PageProps = {
  auth      : { user: { name: string } | null };
  breadcrumb: string[];
  namepage  : string;
  page      : {
    link ?: string;
    title?: string;
  };
};

  // ----------- Composant principal -----------

export default function MainEntry() {
  const { namepage, page, auth } = usePage<PageProps>().props;

  const attributeName = String(page?.link ?? "").replaceAll("/", "");

  const { initialize, reset, scope} = useGlobalStore();
  const { afterLogin }        = useAuthStore();

  const [palette, setPalette] = useState({} as PaletteProps);

  useEffect(()=>
    {
        setPalette(scope?.palette)
        
    },[scope && scope.palette])

  const hasTabs: Tab[] = 
    attributeName in pageWithTabs
      ? pageWithTabs[attributeName as keyof typeof pageWithTabs]
      :  [];

  const [activeTab, setActiveTab] = useState<Tab | null>(
    hasTabs.length > 0 ? hasTabs[0]: null
  );

    // On track la valeur précédente pour éviter les double-initialisations
  const prevQueryRef = useRef<string | null>(null);

  const queryName = 
    hasTabs.length > 0
      ? (activeTab?.attributeName ?? null)
      :  attributeName;

    // Réinitialisation du store quand queryName change réellement
  useEffect(() => {
    if (queryName == null) return;
    if (queryName === prevQueryRef.current) return;

    prevQueryRef.current = queryName;
    reset();
    initialize({ attributeName: queryName, page, onlyPageChange: false, force: true });
  }, [queryName, page, reset, initialize]);

    // Reset de l'onglet actif quand on change de page
  useEffect(() => {
    setActiveTab(hasTabs.length > 0 ? hasTabs[0] : null);
  }, [attributeName]);

    // Auth
  useEffect(() => {
    if (auth.user != null) {
      afterLogin(auth.user);
    }
  }, [auth.user, afterLogin]);

  const DynamicComponent = 
    namepage in CustomPages
      ? CustomPages[namepage as keyof typeof CustomPages]
      :  null;

  return (
    <AuthGuard>
      <div className = "h-screen w-full flex overflow-hidden">
      <div className = "hidden md:block h-full">
          <AppSidebar />
        </div>

        <div className = "flex-1 flex flex-col min-w-0 h-screen">
          <AppHeader palette={palette} />

          <main className = "flex-1 overflow-y-auto">
          <div  className = "p-4 md:p-6 lg:py-6 lg:px-8">

              {hasTabs.length > 0 && (
                <div className = "flex items-center justify-center mb-10">
                  {hasTabs.map((tab) => (
                    <Button
                      key       = {tab.key}
                      type      = "button"
                      size      = "sm"
                      variant   = "ghost"
                      onClick   = {() => setActiveTab(tab)}
                      className = {cn(
                        "flex items-center gap-1.5 h-8 px-3 text-xs font-medium cursor-pointer",
                        activeTab?.key === tab.key
                          ? "border-b-3 border-b-primary rounded-b-none"
                          :  ""
                      )}
                    >
                      {tab.icon && (
                        <span className = "[&>svg]:h-3.5 [&>svg]:w-3.5">
                          {tab.icon}
                        </span>
                      )}
                      {tab.namepage}
                    </Button>
                  ))}
                </div>
              )}

              {DynamicComponent && <DynamicComponent page={page} />}

              {!DynamicComponent && queryName && (
                <BaseContent
                  page           = {page}
                  attributeName  = {queryName}
                  permissionName = {activeTab?.permissionName ?? null}
                  namepage       = {activeTab?.namepage ?? page?.title ?? ""}
                  palette        = {palette}
                />
              )}
            </div>
          </main>
        </div>

        <Toaster richColors />
      </div>
    </AuthGuard>
  );
}