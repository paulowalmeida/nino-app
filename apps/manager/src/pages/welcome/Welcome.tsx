import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { BrandTopBar } from '@components/BrandTopBar/BrandTopBar'
import { welcomePanelDemo } from '@adapters/welcomePanelDemo.adapter'
import { WELCOME_PANELS } from '@constants/welcome.constants'
import { useSessionStore } from '@states/useSessionStore'
import { rememberOnboarding } from '@utils/onboarding-seen'

import styles from './Welcome.module.css'

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
  const panel = WELCOME_PANELS[index]
  const isLast = index === WELCOME_PANELS.length - 1

  const leave = () => {
    rememberOnboarding()
    void navigate('/unidades')
  }

  const advance = () => (isLast ? leave() : setIndex((current) => current + 1))

  return (
    <div className={styles.shell}>
      <BrandTopBar actionLabel="Pular" onAction={leave} />

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
              {WELCOME_PANELS.map(({ leg }, position) => (
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
                {welcomePanelDemo(panel.demoKey)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.foot}>
          {index > 0 && (
            <Button
              variant="ghost"
              className={styles.back}
              onClick={() => setIndex((current) => current - 1)}
            >
              Voltar
            </Button>
          )}

          <div className={styles.progress} aria-hidden="true">
            {WELCOME_PANELS.map(({ leg }, position) => (
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
