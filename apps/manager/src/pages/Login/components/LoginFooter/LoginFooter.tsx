import { Link } from 'react-router'

import { Text } from '@nino/ds/components/Text'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './LoginFooter.module.css'

export const LoginFooter = () => (
  <RiseIn delay={360}>
    <Text size="sm" color="muted" align="center" mt={8}>
      Não tem conta?{' '}
      <Link to="/cadastrar" className={styles.footerLink}>
        Criar conta
      </Link>
    </Text>
  </RiseIn>
)
