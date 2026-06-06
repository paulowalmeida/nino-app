"use client"

import { FloatingNotification } from "@hero/_components/FloatingNotification"
import { PhoneMockup } from "@hero/_components/PhoneMockup"
import { proof } from "./hero.constants"
import styles from "./Hero.module.css"

import { CADASTRO_URL } from "@/config"

function scrollToDemo() {
  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <h1 className={styles.headline}>
              Seu delivery,
              <br />
              <span className={styles.underline}>todo seu.</span>
            </h1>

            <p className={styles.subtitle}>
              App, site e WhatsApp com a sua marca — não a de um marketplace.
              Mensalidade fixa, seus entregadores e nenhuma fatia das suas
              vendas.
            </p>

            <div className={styles.actions}>
              <a className={styles.createButton} href={CADASTRO_URL}>
                Criar minha loja grátis
              </a>

              <button className={styles.demoLink} onClick={scrollToDemo}>
                Ver demonstração →
              </button>
            </div>

            <div className={styles.proof}>
              {proof.map((item) => (
                <div key={item.label} className={styles.proofItem}>
                  <span className={styles.proofValue}>{item.value}</span>

                  <span className={styles.proofLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.stage}>
            <FloatingNotification
              icon="💬"
              iconVariant="whatsapp"
              placement="top"
              title="Novo pedido no WhatsApp"
              subtitle="Burgão do Zé · R$ 48,90"
            />

            <FloatingNotification
              icon="🛵"
              iconVariant="delivery"
              placement="bottom"
              title="Saiu pra entrega"
              subtitle="Seu entregador · 12 min"
            />

            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
