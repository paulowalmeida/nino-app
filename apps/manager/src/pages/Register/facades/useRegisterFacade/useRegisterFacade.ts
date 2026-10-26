import { useAccountForm } from '@pages/Register/hooks/useAccountForm/useAccountForm'
import { useCompanyForm } from '@pages/Register/hooks/useCompanyForm/useCompanyForm'
import { useUnitForm } from '@pages/Register/hooks/useUnitForm/useUnitForm'
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
  const goToUnit = useRegisterWizardStore((state) => state.goToUnit)
  const resetWizard = useRegisterWizardStore((state) => state.reset)

  const accountForm = useAccountForm({
    defaultValues: account,
    onValid: goToCompany,
  })
  const companyForm = useCompanyForm({ goToUnit })
  const unitForm = useUnitForm({ account, company })

  return {
    step,
    account,
    company,
    goToAccount,
    goToCompanyStep,
    resetWizard,
    accountForm,
    companyForm,
    unitForm,
  }
}
