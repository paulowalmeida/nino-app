import { Box } from '@nino/ds/components/Box'
import { ForgotPasswordFooter } from '@pages/ForgotPassword/components/ForgotPasswordFooter/ForgotPasswordFooter'
import { ForgotPasswordForm } from '@pages/ForgotPassword/components/ForgotPasswordForm/ForgotPasswordForm'
import { ForgotPasswordHeader } from '@pages/ForgotPassword/components/ForgotPasswordHeader/ForgotPasswordHeader'

export const ForgotPassword = () => (
  <Box direction="column">
    <ForgotPasswordHeader />
    <ForgotPasswordForm />
    <ForgotPasswordFooter />
  </Box>
)
