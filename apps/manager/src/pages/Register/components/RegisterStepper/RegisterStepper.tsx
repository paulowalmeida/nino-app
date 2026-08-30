import { Stepper } from '@nino/ds/components/Stepper'
import { REGISTER_WIZARD_STEPS } from '@pages/Register/constants/register.constants'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import styles from './RegisterStepper.module.css'

export const RegisterStepper = () => {
  const { step } = useRegisterFacade()

  return (
    <Stepper
      steps={REGISTER_WIZARD_STEPS}
      step={step - 1}
      className={styles.stepper}
    />
  )
}
