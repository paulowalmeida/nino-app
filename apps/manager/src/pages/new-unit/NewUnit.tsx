import { useCallback, useState } from 'react'

import { Breadcrumb } from '@components/Breadcrumb'
import { FirstStoreForm } from '@compositions/FirstStoreForm'
import { StorePreview } from '@compositions/StorePreview'

import styles from './NewUnit.module.css'
import motion from '@styles/motion.module.css'

/**
 * O que a pessoa precisa saber antes de abrir, e não depois. Não é lista de
 * passos — são dois fatos paralelos —, então nada de numeração: fio fino
 * separando, como nos outros blocos do painel.
 */
const FACTS = [
  {
    strong: 'Cardápio, horário e zonas',
    rest: ' são só desta unidade. Nada vem copiado das outras.',
  },
  {
    strong: 'Equipe e assinatura',
    rest: ' continuam da empresa — quem já trabalha com você entra aqui também.',
  },
  {
    strong: 'O link',
    rest: ' é o endereço que seus clientes vão acessar. Depois de criado, mudar quebra o que já foi divulgado.',
  },
]

/**
 * Abrir unidade acontece dentro do painel: quem já opera não sai do ambiente
 * para cadastrar a próxima loja. Ao terminar, o painel abre direto na unidade
 * nova.
 */
export const NewUnit = () => {
  const [name, setName] = useState('')

  /* Referência estável: o formulário chama isto a cada tecla, dentro de um
   * efeito que depende da própria função. */
  const handleChange = useCallback(
    (values: { customName?: string }) => setName(values.customName ?? ''),
    []
  )

  return (
    <div className={styles.page}>
      <Breadcrumb
        trail={[
          { label: 'Configurações', to: '../../configuracoes/empresa' },
          { label: 'Unidades', to: '../../configuracoes/unidade' },
          { label: 'Nova unidade' },
        ]}
      />

      <p className={styles.eyebrow}>Unidades</p>

      <header className={`${motion.deal} ${styles.head}`}>
        <h1 className={styles.title}>Abrir nova unidade</h1>
        <p className={styles.subtitle}>
          Uma unidade é uma loja com endereço próprio. Preencha o que os
          clientes vão ver e onde ela fica — o resto se ajusta depois, no painel
          da unidade.
        </p>
      </header>

      <div className={styles.body}>
        <div className={`${motion.settle} ${styles.form}`}>
          <FirstStoreForm
            onChange={handleChange}
            submitLabel="Abrir unidade"
            onCreated={({ id }) => `/${id}/configuracoes/unidade`}
          />
        </div>

        <aside className={`${motion.settle} ${styles.aside}`}>
          <p className={styles.asideLabel}>Como o cliente vê</p>

          <StorePreview
            name={name}
            placeholder="O nome da unidade"
            placeholderSlug="sua-unidade"
          />

          <div className={styles.facts}>
            {FACTS.map(({ strong, rest }) => (
              <p key={strong} className={styles.fact}>
                <span className={styles.factStrong}>{strong}</span>
                {rest}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
