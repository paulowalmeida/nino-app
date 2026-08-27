import { useAccountForm } from '@pages/Register/hooks/useAccountForm/useAccountForm'
import { useCompanyForm } from '@pages/Register/hooks/useCompanyForm/useCompanyForm'
import { useRegisterWizardStore } from '@pages/Register/states/register-wizard/register-wizard.store'

export const useRegisterFacade = () => {
  const step = useRegisterWizardStore((state) => state.step)
  const account = useRegisterWizardStore((state) => state.account)
  const goToCompany = useRegisterWizardStore((state) => state.goToCompany)
  const goToAccount = useRegisterWizardStore((state) => state.goToAccount)
  const resetWizard = useRegisterWizardStore((state) => state.reset)

  const accountForm = useAccountForm({
    defaultValues: account,
    onValid: goToCompany,
  })
  const companyForm = useCompanyForm({ account })

  return { step, account, goToAccount, resetWizard, accountForm, companyForm }
}
