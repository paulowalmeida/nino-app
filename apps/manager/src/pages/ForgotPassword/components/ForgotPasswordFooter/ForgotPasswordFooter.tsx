import { Link } from 'react-router'

import { Text } from '@nino/ds/components/Text'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './ForgotPasswordFooter.module.css'

export const ForgotPasswordFooter = () => (
  <RiseIn delay={280}>
    <Text size="sm" color="muted" align="center" mt={8}>
      Lembrou a senha?{' '}
      <Link to="/entrar" className={styles.footerLink}>
        Entrar
      </Link>
    </Text>
  </RiseIn>
)
