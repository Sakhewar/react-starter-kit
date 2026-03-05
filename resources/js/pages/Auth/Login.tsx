// resources/js/Pages/Auth/Login.tsx
"use client";

import { useForm, Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ status, errors: serverErrors }: { status?: string; errors?: Record<string, string> })
{
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

    const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('login', data);
  };

  console.log("diop log", {status, serverErrors});
  

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* Partie gauche : illustration / dashboard preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-white items-center justify-center p-12 relative overflow-hidden">
          
        </div>

        {/* Partie droite : formulaire de connexion */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">OSP</span>
              </div>
            </div>

            <Separator />

            {/* Formulaire */}
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrer votre adresse email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  disabled={processing}
                />
                {serverErrors && serverErrors.email && <p className="text-sm text-destructive">{serverErrors.email}</p>}
              </div>

              <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                    className="" // espace pour l'icône œil
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1} // évite que le bouton soit focusable au tab
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

              <div className="flex items-center justify-end">
                  <a href="/" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={processing}>
                {"Se connecter"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}