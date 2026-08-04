import { Fragment, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@nino/ds/components/Button'

import { KitchenCard } from '@compositions/KitchenCard/KitchenCard'
import { OrderTicket } from '@compositions/OrderTicket/OrderTicket'
import { OrderTimeline } from '@compositions/OrderTimeline/OrderTimeline'
import { NinoLogo } from '@elements/NinoLogo/NinoLogo'
import { useSessionStore } from '@states/useSessionStore'
import { rememberOnboarding } from '@utils/onboarding-seen'

import { demoOrder, demoTimeline } from './demo-order'

import styles from './Welcome.module.css'

const noop = () => {}

type Panel = {
  leg: string
  stage: string
  title: string
  text: string
  screen: string
  demo: ReactNode
}

/**
 * Cada parada mostra o componente que a pessoa vai usar de verdade — a ficha do
 * pedido, a comanda da cozinha, a linha do tempo da entrega —, alimentado por
 * um pedido de mentira. Explicar o painel com desenho genérico seria vender
 * outra coisa; aqui o que aparece é o painel.
 */
const PANELS: Panel[] = [
  {
    leg: 'Balcão',
    stage: 'Primeira parada',
    title: 'O pedido cai no balcão',
    text: 'Chega pelo link da sua loja e aparece na hora, com itens, endereço e o relógio correndo. Você aceita, recusa ou ajusta o tempo.',
    screen: 'Pedidos',
    demo: (
      <OrderTicket
        order={demoOrder('PENDING', 2)}
        onAdvance={noop}
        isBusy={false}
      />
    ),
  },
  {
    leg: 'Cozinha',
    stage: 'Segunda parada',
    title: 'A cozinha já sabe',
    text: 'A comanda abre no painel de parede assim que você aceita, com o número grande e o prazo escorrendo. Ninguém grita pedido nem imprime papel.',
    screen: 'Cozinha',
    demo: (
      <KitchenCard
        order={demoOrder('PREPARING', 6)}
        onAdvance={noop}
        isBusy={false}
      />
    ),
  },
  {
    leg: 'Entrega',
    stage: 'Última parada',
    title: 'Sai para entrega',
    text: 'Cada passo fica registrado com hora. O cliente acompanha pelo mesmo link, e no fim do dia o caixa fecha com o que entrou.',
    screen: 'Pedido #1042',
    demo: (
      <OrderTimeline entries={demoTimeline()} />
    ),
  },
]

/**
 * Boas-vindas de quem acabou de criar a conta. Opcional do começo ao fim:
 * "Pular" sai a qualquer momento, e a loja é cadastrada quando a pessoa
 * quiser, na tela de unidades.
 */
export const Welcome = () => {
  const navigate = useNavigate()
  const user = useSessionStore((state) => state.user)
  const firstName = (user?.name ?? '').split(' ')[0]

  const [index, setIndex] = useState(0)
  const panel = PANELS[index]
  const isLast = index === PANELS.length - 1

  const leave = () => {
    rememberOnboarding()
    void navigate('/unidades')
  }

  const advance = () => (isLast ? leave() : setIndex((current) => current + 1))

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <NinoLogo />

        <button type="button" className={styles.skip} onClick={leave}>
          Pular
        </button>
      </header>

      <main className={styles.page}>
        <div className={styles.body}>
          <div className={styles.copy}>
            <div key={index} className={styles.reveal}>
              <p className={styles.stage}>
                {index === 0 && firstName
                  ? `Bem-vindo, ${firstName}`
                  : panel.stage}
              </p>
              <h1 className={styles.title}>{panel.title}</h1>
              <p className={styles.text}>{panel.text}</p>
            </div>

            <ol className={styles.journey}>
              {PANELS.map(({ leg }, position) => (
                <Fragment key={leg}>
                  {position > 0 && (
                    <span className={styles.legLine} aria-hidden="true" />
                  )}
                  <li className={styles.leg} data-on={position <= index}>
                    <span className={styles.legDot} aria-hidden="true" />
                    <span className={styles.legLabel}>{leg}</span>
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>

          <div key={index} className={`${styles.reveal} ${styles.frame}`}>
            <div className={styles.frameBar}>
              <span className={styles.frameDot} aria-hidden="true" />
              <span className={styles.frameDot} aria-hidden="true" />
              <span className={styles.frameName}>{panel.screen}</span>
            </div>

            <div className={styles.frameBody}>
              <div className={styles.demo} aria-hidden="true" inert>
                {panel.demo}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.foot}>
          {index > 0 && (
            <button
              type="button"
              className={styles.back}
              onClick={() => setIndex((current) => current - 1)}
            >
              Voltar
            </button>
          )}

          <div className={styles.progress} aria-hidden="true">
            {PANELS.map(({ leg }, position) => (
              <span
                key={leg}
                className={styles.tick}
                data-on={position <= index}
              />
            ))}
          </div>

          <div className={styles.advance}>
            <Button onClick={advance}>
              {isLast ? 'Ir para minha loja' : 'Continuar'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
