import { useEffect } from 'react'

import { AccountStep } from '@pages/Register/components/AccountStep/AccountStep'
import { CompanyStep } from '@pages/Register/components/CompanyStep/CompanyStep'
import { RegisterStepper } from '@pages/Register/components/RegisterStepper/RegisterStepper'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

export const Register = () => {
  const { step, resetWizard } = useRegisterFacade()

  /* WHY: o cadastro recomeça a cada visita — reabrir a tela no passo 2 com a
   * conta da sessão anterior deixaria o dono preso num passo sem contexto. */
  useEffect(() => {
    resetWizard()
  }, [resetWizard])

  return (
    <>
      <RegisterStepper />
      {step === 2 ? <CompanyStep /> : <AccountStep />}
    </>
  )
}
