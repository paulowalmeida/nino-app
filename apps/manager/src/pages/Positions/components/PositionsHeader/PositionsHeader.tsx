import { Link } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'

import motion from '@styles/motion.module.css'

export const PositionsHeader = () => (
  <Header
    mb={{ mobile: 6, desktop: 8 }}
    className={motion.deal}
    title="Cargos"
    accent="Cargos"
    description={
      'Defina o que cada cargo pode fazer na loja. O Dono sempre tem ' +
      'acesso total e não pode ser alterado.'
    }
    actions={
      <Button asChild className={motion.press}>
        <Link to="novo">
          <Icon name="plus" />
          Novo cargo
        </Link>
      </Button>
    }
  />
)
