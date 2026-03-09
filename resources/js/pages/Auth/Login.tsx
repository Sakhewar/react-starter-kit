"use client";

import { useForm, Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // ← Ajout de Loader2
import { route } from "ziggy-js";
import { useAuthStore } from "@/hooks/authStore";

export default function Login({ status, errors: serverErrors }: { status?: string; errors?: Record<string, string> }) {
  const { data, setData, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const {afterLogin, isAuthenticated} = useAuthStore();
  const {auth} = usePage().props;


    const redirected = useRef(false)

    useEffect(() =>
    {
        if (isAuthenticated && !redirected.current)
        {
            redirected.current = true
            //router.visit("/")
        }
    }, [isAuthenticated])

    
    useEffect(()=>
    {
      if(auth.user != null)
      {
        afterLogin(auth.user);
      }
  
    },[auth])
    console.log("diop log", auth);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("login", data,{
      onSuccess : (page) =>
      { 
        afterLogin(page.props.auth?.user);
      }
    });
  };

  const forgotPassword = () => {
    router.visit(route("/forgot-password"));
    //router.post("forgot-password", { email: data.email });
  };

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* Partie gauche : illustration - 70% */}
        <div className="hidden lg:flex lg:w-[60%] md:w-[60%] bg-gradient-to-br from-gray-900 to-gray-700 items-center justify-center p-12 relative overflow-hidden">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl font-bold">Bienvenue sur OSP</h1>
            <p className="text-lg">Votre plateforme de gestion avancée</p>
          </div>
        </div>

        {/* Partie droite : formulaire - 30% */}
        <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-bold">OSP Hope VO 🚀</span>
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-center">Connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

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
                    className="py-6"
                  />
                  {serverErrors?.email && <p className="text-sm text-destructive">{serverErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      disabled={processing}
                      className="py-6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {serverErrors?.password && <span className="text-sm text-destructive">{serverErrors.password}</span>}

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={forgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full py-5"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}