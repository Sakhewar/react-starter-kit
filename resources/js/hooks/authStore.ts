

interface AuthState {
    isAuthenticated: any
    user: any | null
    afterLogin: (e: any) => void
    afterLogout: () => void
  }

import { create } from "zustand"

export const useAuthStore = create<AuthState>((set, get) => (
{
    user: typeof window !== "undefined" ? localStorage.getItem("user") : null,

    isAuthenticated: !!localStorage.getItem("user"),

    afterLogin: (user) =>
    {
        console.log("afterLogin", user);
        
        localStorage.setItem("user", user)
        set({ user, isAuthenticated: true })
    },
    afterLogout: () =>
    {
        localStorage.removeItem("user")
        set({ user : null, isAuthenticated: false})
    },
}))