import { CADASTRO_URL } from '@/config'

export function Comecar() {
  return (
    <section id="comecar" className="cta">
      <div className="cta-circle tl" />
      <div className="cta-circle br" />
      <div className="cta-inner">
        <h2>
          Comece hoje,
          <br />
          de graça
        </h2>
        <p className="cta-lead">
          30 dias grátis pra testar tudo — o dobro do que a maioria oferece.<br />
          Sem cartão, sem compromisso.
        </p>
        <a className="cta-btn" href={CADASTRO_URL}>
          Criar minha loja grátis →
        </a>
        <p className="cta-fine">Sem cartão. Sem contrato. Cancela quando quiser.</p>
      </div>
    </section>
  )
}
