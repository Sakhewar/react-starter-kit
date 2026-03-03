"use client";

import { usePage } from "@inertiajs/react";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // si besoin ailleurs

import MobileSidebar from "@/components/MobileSideBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import AppSidebar from "@/components/AppSideBar";

import * as Views from "./views";
import DashboardPage from "@/components/DashboardPage";

export default function MAinEntry() {
  const { namepage, page } = usePage().props;
  const { auth, breadcrumb } = usePage<{
    auth: { user: { name: string } };
    breadcrumb: string[];
  }>().props;


  const DynamicComponent = Views[namepage] || null;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Sidebar fixe à gauche – scroll interne */}
      <div className="hidden md:block h-full">
        <AppSidebar />
      </div>

      {/* Colonne droite : header fixe + contenu scrollable */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header – hauteur fixe, reste en haut */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
          {/* Gauche */}
          <div className="flex items-center gap-4">
            <MobileSidebar />
            {/* Breadcrumb ou titre rapide si tu veux */}
          </div>

          {/* Droite */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Input placeholder="Rechercher..." className="w-64" />
            </div>

            <ThemeToggle />

            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{auth?.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/logout">Déconnexion</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Zone de contenu principale – scroll ici */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {DynamicComponent && <DynamicComponent page={page} />}

            {!DynamicComponent && <DashboardPage page={page} namepage={page?.title ?? ""} />}
          </div>
        </main>
      </div>
    </div>
  );
}