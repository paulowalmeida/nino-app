import { Box } from '@nino/ds/components/Box'
import { ResetPasswordForm } from '@pages/ResetPassword/components/ResetPasswordForm/ResetPasswordForm'
import { ResetPasswordHeader } from '@pages/ResetPassword/components/ResetPasswordHeader/ResetPasswordHeader'

export const ResetPassword = () => (
  <Box direction="column">
    <ResetPasswordHeader />
    <ResetPasswordForm />
  </Box>
)
