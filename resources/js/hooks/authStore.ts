

interface AuthState {
    isAuthenticated: any
    user: any | null
    afterLogin: (e: any) => void
    afterLogout: () => void
  }

import { create } from "zustand"

export const useAuthStore = create<AuthState>((set, get) => (
{
    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "null")  : null,

    isAuthenticated: !!localStorage.getItem("user"),

    afterLogin: (user) =>
    { 
        localStorage.setItem("user", JSON.stringify(user))
        set({user : user , isAuthenticated: true })
    },
    afterLogout: () =>
    {
        localStorage.removeItem("user")
        set({ user : null, isAuthenticated: false})
    },
}))