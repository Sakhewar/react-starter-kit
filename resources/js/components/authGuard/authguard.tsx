"use client"

import { useAuthStore } from "@/hooks/authStore"
import Login from "@/pages/Auth/Login"
import { router } from "@inertiajs/react"
import { useEffect, useRef } from "react"

export default function AuthGuard({ children } : { children: React.ReactNode })
{
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    const redirected = useRef(false)

    useEffect(() =>
    {
        if (!isAuthenticated && !redirected.current)
        {
            redirected.current = true
            router.visit("/login")
        }
    }, [isAuthenticated])

    if (!isAuthenticated) return <Login />

    return children
}