import { create } from 'zustand'

import { goToAccount } from '@pages/Register/states/register-wizard/operations/go-to-account/go-to-account'
import { goToCompany } from '@pages/Register/states/register-wizard/operations/go-to-company/go-to-company'
import { goToCompanyStep } from '@pages/Register/states/register-wizard/operations/go-to-company-step/go-to-company-step'
import { goToTenant } from '@pages/Register/states/register-wizard/operations/go-to-tenant/go-to-tenant'
import { resetWizard } from '@pages/Register/states/register-wizard/operations/reset-wizard/reset-wizard'
import type { RegisterWizardState } from '@pages/Register/types/RegisterWizardState.type'

export const useRegisterWizardStore = create<RegisterWizardState>((set) => ({
  step: 1,
  account: null,
  company: null,
  goToCompany: (account) => goToCompany(set, account),
  goToCompanyStep: () => goToCompanyStep(set),
  goToTenant: (company) => goToTenant(set, company),
  goToAccount: () => goToAccount(set),
  reset: () => resetWizard(set),
}))
