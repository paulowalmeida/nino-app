import { Stepper } from '@nino/ds/components/Stepper'
import { REGISTER_WIZARD_STEPS } from '@pages/Register/constants/register.constants'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import styles from './RegisterStepper.module.css'

export const RegisterStepper = () => {
  const { step, goToAccount } = useRegisterFacade()

  const handleStepChange = (next: number) => {
    if (step === 2 && next === 0) goToAccount()
  }

  return (
    <Stepper
      steps={REGISTER_WIZARD_STEPS}
      step={step - 1}
      onStepChange={handleStepChange}
      className={styles.stepper}
    />
  )
}
