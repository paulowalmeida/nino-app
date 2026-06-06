"use client"

import { createContext, type ReactNode,useContext } from "react"

import type { User } from "@nino/lib"

const PainelAuthContext = createContext<User | null>(null)

export function PainelAuthProvider({
  user,
  children,
}: {
  user: User
  children: ReactNode
}) {
  return (
    <PainelAuthContext.Provider value={user}>
      {children}
    </PainelAuthContext.Provider>
  )
}

export function usePainelUser(): User {
  const user = useContext(PainelAuthContext)
  if (!user) {
    throw new Error(
      'usePainelUser deve ser usado dentro de PainelAuthProvider',
    )
  }
  return user
}
