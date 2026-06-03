import { RegisterWizard } from './RegisterWizard'

import { AuthLayout } from '@/components/AuthLayout'

export default function CadastrarPage() {
  return (
    <AuthLayout>
      <RegisterWizard />
    </AuthLayout>
  )
}
