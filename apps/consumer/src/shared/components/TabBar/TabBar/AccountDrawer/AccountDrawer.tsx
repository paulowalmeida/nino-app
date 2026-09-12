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

const since = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

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

  const ready = ACCOUNT_SECTIONS.filter((section) => !section.soon)
  const soon = ACCOUNT_SECTIONS.filter((section) => section.soon)

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
    const className = isOn ? `${styles.item} ${styles.itemOn}` : styles.item

    return (
      <ListRow key={to} divider="none" padding={0}>
        <Button
          variant="ghost"
          onClick={() => go(href)}
          aria-current={isOn ? 'page' : undefined}
          className={`${motion.deal} ${className}`}
          style={riseDelay(120 + index * 45)}
        >
          <Icon name={icon} className={styles.icon} />
          <Text as="span" className={styles.label}>
            {label}
          </Text>
        </Button>
      </ListRow>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement="left"
      size="19.5rem"
      contentClassName={styles.panel}
      bodyClassName={styles.body}
    >
      {/* a gaveta sai por um portal, fora da árvore da página: a cor da loja
          precisa ser declarada de novo aqui para chegar às peças de dentro */}
      <Box
        className={styles.tint}
        style={tint ? ({ '--store-tint': tint } as React.CSSProperties) : {}}
      >
        <Box as="header" className={styles.head}>
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

          <Text
            className={`${motion.deal} ${styles.greeting}`}
            style={riseDelay(60)}
          >
            {greeting()}
            {name ? ',' : ''}
          </Text>

          {name && (
            <Text
              className={`${motion.deal} ${styles.name}`}
              style={riseDelay(90)}
            >
              {name}
            </Text>
          )}

          {consumer && (
            <Text
              className={`${motion.deal} ${styles.since}`}
              style={riseDelay(120)}
            >
              na casa desde {since.format(new Date(consumer.createdAt))}
            </Text>
          )}
        </Box>

        {consumer ? (
          <>
            <nav className={styles.nav} aria-label="Seções da conta">
              <Box as="ul" className={styles.list}>
                {ready.map(({ to, label, icon }, index) =>
                  sectionRow(to, label, icon, index)
                )}
              </Box>

              {/* dito uma vez, no alto do grupo: o selo repetido em cada linha
                  dizia três vezes a mesma coisa e roubava a leitura do nome */}
              <Text className={styles.eyebrow}>em breve</Text>

              <Box as="ul" className={`${styles.list} ${styles.listSoon}`}>
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
                <Icon name="logout" className={styles.icon} />
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
