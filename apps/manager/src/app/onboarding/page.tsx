'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { OnboardingForm } from './OnboardingForm'

import { AuthLayout } from '@/components/AuthLayout'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuthUser } from '@/hooks/useAuthUser'

export default function Page() {
  const router = useRouter()
  const { user, loading } = useAuthUser()

  useEffect(() => {
    if (user?.companyId) router.replace('/painel')
  }, [user, router])

  if (loading || !user || user.companyId) return <FullScreenLoader />

  return (
    <AuthLayout>
      <OnboardingForm user={user} />
    </AuthLayout>
  )
}
