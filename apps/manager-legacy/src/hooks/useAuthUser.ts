"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { clearTokens, me } from "@services/auth.service"

import type { User } from "@nino/lib"

import type { AuthUserState } from "./auth-user-state"

export function useAuthUser(): AuthUserState {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => {
        // token invalido/expirado: limpa a sessao para o middleware
        // nao redirecionar de volta e criar loop com /entrar
        clearTokens()
        router.replace("/entrar")
      })
      .finally(() => setLoading(false))
  }, [router])

  return { user, loading }
}
