"use client"

import { useRouter } from "next/navigation"

import { clearTokens, logout } from "@services/auth.service"

import { Button } from "@nino/ds"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // mesmo se a API falhar (token expirado), encerra a sessão local
    }
    clearTokens()
    router.push("/entrar")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Sair
    </Button>
  )
}
