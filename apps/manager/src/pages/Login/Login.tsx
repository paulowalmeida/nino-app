import { Box } from '@nino/ds/components/Box'
import { LoginFooter } from '@pages/Login/components/LoginFooter/LoginFooter'
import { LoginForm } from '@pages/Login/components/LoginForm/LoginForm'
import { LoginHeader } from '@pages/Login/components/LoginHeader/LoginHeader'

export const Login = () => (
  <Box direction="column">
    <LoginHeader />
    <LoginForm />
    <LoginFooter />
  </Box>
)
