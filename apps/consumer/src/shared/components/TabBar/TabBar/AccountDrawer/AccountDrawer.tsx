import { useLocation, useNavigate } from 'react-router'

import { Drawer } from '@nino/ds/components/Drawer'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { ACCOUNT_SECTIONS } from '@shared/constants/account-sections'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'
import {
  consumerInitials,
  firstName,
} from '@shared/utils/consumer-name/consumer-name'
import { greeting } from '@shared/utils/greeting/greeting'
import { riseDelay } from '@utils/rise-delay'

import styles from './AccountDrawer.module.css'
import motion from '@styles/motion.module.css'

type AccountDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Prefixo de rota da loja: `/slug` no atalho local, vazio no subdomínio. */
  base: string
}

/**
 * A caderneta do freguês — a gaveta que o "Perfil" da barra abre no celular.
 *
 * Caderneta e não "menu de configurações": é o caderninho do balcão, onde a
 * casa anota quem é de casa. Por isso ela abre com a pessoa (azulejo, nome,
 * desde quando é freguesa) e só depois lista as gavetas — um menu que começa
 * por "Dados pessoais" trata o dono da conta como item de formulário.
 *
 * O azulejo rima com o da loja na vitrine de propósito: a mesma peça, a mesma
 * moldura branca. De um lado o balcão se apresenta, do outro o freguês.
 *
 * O que ainda não existe fica num segundo grupo sob um "em breve" dito uma
 * vez, em vez de repetir o selo em cada linha. A lista não tem seta: seta em
 * toda linha de menu é ruído que não diz nada que o toque já não diga.
 *
 * Abre pela esquerda porque a direita é da sacola — duas gavetas chegando do
 * mesmo lado viram a mesma coisa na memória da mão.
 */
export const AccountDrawer = ({
  open,
  onOpenChange,
  base,
}: AccountDrawerProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { consumer } = useConsumerSession()
  const tint = useStoreTint()
  const logout = useLogout()

  /* conta aberta por telefone nasce sem nome de verdade: até a pessoa dizer
     como se chama, a saudação vai sozinha e o azulejo fica sem iniciais */
  const named = consumer?.profileCompletedAt ? consumer.name : null
  const name = firstName(named)
  const mark = consumerInitials(named)

  /* WHY: na vitrine os avisos já têm entrada própria (sino no topo, Avisos na
     barra); repetir na gaveta da conta seria o mesmo destino duas vezes. */
  const sections = ACCOUNT_SECTIONS.filter(({ to }) => to !== 'conversas')
  const ready = sections.filter((section) => !section.soon)
  const soon = sections.filter((section) => section.soon)

  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  const sectionRow = (
    to: string,
    label: string,
    icon: IconName,
    index: number
  ) => {
    const href = `${base}/conta/${to}`
    const isOn = pathname === href
    const className = isOn
      ? `${styles.accountDrawerItem} ${styles.itemOn}`
      : styles.accountDrawerItem

    return (
      <ListRow key={to} divider="none" padding={0}>
        <Button
          variant="ghost"
          onClick={() => go(href)}
          aria-current={isOn ? 'page' : undefined}
          className={`${motion.deal} ${className}`}
          style={riseDelay(120 + index * 45)}
        >
          <Icon name={icon} className={styles.accountDrawerIcon} />
          <Text as="span" className={styles.accountDrawerLabel}>
            {label}
          </Text>
        </Button>
      </ListRow>
    )
  }

  /* WHY: avatar, saudação e nome são o título da gaveta — um "Perfil" em cima
     de um bloco que já diz quem é seria eco. O título sai do portal sem a cor
     da loja, por isso a declara de novo. */
  const head = (
    <Box
      direction="row"
      className={styles.head}
      style={tint ? ({ '--store-tint': tint } as React.CSSProperties) : {}}
    >
      <Box className={`${motion.land} ${styles.tile}`}>
        {consumer?.photoUrl ? (
          <img
            src={consumer.photoUrl}
            alt=""
            className={styles.tilePhoto}
            referrerPolicy="no-referrer"
          />
        ) : (
          (mark ?? <Icon name="user" className={styles.tileIcon} />)
        )}
      </Box>
      <Box className={styles.headText}>
        <Text as="span" className={styles.greeting}>
          {greeting()}
          {name ? ',' : ''}
        </Text>
        {name && (
          <Text as="span" className={styles.name}>
            {name}
          </Text>
        )}
      </Box>
    </Box>
  )

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement="right"
      size="26rem"
      fullOnMobile
      title={head}
      contentClassName={styles.accountDrawerPanel}
      bodyClassName={styles.accountDrawerBody}
    >
      {/* a gaveta sai por um portal, fora da árvore da página: a cor da loja
          precisa ser declarada de novo aqui para chegar às peças de dentro */}
      <Box
        className={styles.tint}
        style={tint ? ({ '--store-tint': tint } as React.CSSProperties) : {}}
      >
        {consumer ? (
          <>
            <nav
              className={styles.accountDrawerNav}
              aria-label="Seções da conta"
            >
              <Box as="ul" className={styles.accountDrawerList}>
                {ready.map(({ to, label, icon }, index) =>
                  sectionRow(to, label, icon, index)
                )}
              </Box>

              {/* dito uma vez, no alto do grupo: o selo repetido em cada linha
                  dizia três vezes a mesma coisa e roubava a leitura do nome */}
              <Text className={styles.eyebrow}>em breve</Text>

              <Box
                as="ul"
                className={`${styles.accountDrawerList} ${styles.listSoon}`}
              >
                {soon.map(({ to, label, icon }, index) =>
                  sectionRow(to, label, icon, ready.length + index)
                )}
              </Box>
            </nav>

            <Box className={styles.foot}>
              <Button
                variant="ghost"
                className={`${motion.press} ${styles.logout}`}
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <Icon name="logout" className={styles.accountDrawerIcon} />
                {logout.isPending ? 'Saindo…' : 'Sair da conta'}
              </Button>
            </Box>
          </>
        ) : (
          /* visitante é estado normal aqui: a loja inteira funciona sem conta,
             então a gaveta diz o que a conta guarda em vez de barrar caminho */
          <Box className={styles.guest}>
            <Text className={styles.guestText}>
              Entre para acompanhar seus pedidos e guardar seus endereços de
              entrega.
            </Text>
            <Button
              variant="ghost"
              className={`${motion.press} ${styles.enter}`}
              onClick={() => go(`${base}/entrar`)}
            >
              Entrar
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
