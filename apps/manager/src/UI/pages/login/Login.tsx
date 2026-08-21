import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { RiseIn } from '@atoms/RiseIn/RiseIn'
import { LoginForm } from '@organisms/LoginForm/LoginForm'

import styles from '@styles/authForm.module.css'

export const Login = () => (
  <Box direction="column">
    <RiseIn as="header">
      <Heading level={1} size="2xl" align="center">
        Bem-vindo
      </Heading>
    </RiseIn>

    <LoginForm />

    <RiseIn delay={360}>
      <Text size="sm" color="muted" align="center" mt={8}>
        Não tem conta?{' '}
        <Link to="/cadastrar" className={styles.footerLink}>
          Criar conta
        </Link>
      </Text>
    </RiseIn>
  </Box>
)
