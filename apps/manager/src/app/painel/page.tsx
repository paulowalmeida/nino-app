'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuthUser } from '@/hooks/useAuthUser'

const wrap = 'flex min-h-screen flex-col items-center justify-center gap-2 px-6'
const title = 'font-display text-3xl font-extrabold text-gray-900'
const subtitle = 'text-sm text-gray-500'

export default function Page() {
  const router = useRouter()
  const { user, loading } = useAuthUser()

  useEffect(() => {
    if (user && !user.companyId) router.replace('/onboarding')
  }, [user, router])

  if (loading || !user || !user.companyId) return <FullScreenLoader />

  return (
    <main className={wrap}>
      <h1 className={title}>Olá, {user.name}</h1>
      <p className={subtitle}>Seu painel está a caminho.</p>
    </main>
  )
}
