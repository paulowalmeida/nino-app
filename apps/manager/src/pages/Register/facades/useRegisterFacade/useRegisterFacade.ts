import { useAccountForm } from '@pages/Register/hooks/useAccountForm/useAccountForm'
import { useCompanyForm } from '@pages/Register/hooks/useCompanyForm/useCompanyForm'
import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import { useRegisterWizardStore } from '@pages/Register/states/register-wizard/register-wizard.store'

export const useRegisterFacade = () => {
  const step = useRegisterWizardStore((state) => state.step)
  const account = useRegisterWizardStore((state) => state.account)
  const company = useRegisterWizardStore((state) => state.company)
  const goToCompany = useRegisterWizardStore((state) => state.goToCompany)
  const goToCompanyStep = useRegisterWizardStore(
    (state) => state.goToCompanyStep
  )
  const goToAccount = useRegisterWizardStore((state) => state.goToAccount)
  const goToTenant = useRegisterWizardStore((state) => state.goToTenant)
  const resetWizard = useRegisterWizardStore((state) => state.reset)

  const accountForm = useAccountForm({
    defaultValues: account,
    onValid: goToCompany,
  })
  const companyForm = useCompanyForm({ goToTenant })
  const signup = useSignup()

  return {
    step,
    account,
    company,
    goToAccount,
    goToCompanyStep,
    resetWizard,
    accountForm,
    companyForm,
    signup,
  }
}
