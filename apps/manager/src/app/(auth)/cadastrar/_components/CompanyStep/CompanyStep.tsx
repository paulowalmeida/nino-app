"use client"

import type { CSSProperties } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button, FormField, Input } from "@nino/ds"

import styles from "../../../authForm.module.css"
import motion from "../../../motion.module.css"
import type { CompanyFormValues, CompanyStepProps } from "./CompanyStep.types"

import { completeOnboarding } from "@/services/onboarding.service"

const rise = (delay: number): CSSProperties =>
  ({ ["--d"]: `${delay}ms` }) as CSSProperties

export function CompanyStep({ responsible }: CompanyStepProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>()

  async function onSubmit(data: CompanyFormValues) {
    try {
      await completeOnboarding({ company: data.company, responsible })
      router.push("/painel")
    } catch {
      setError("root", {
        message: "Não foi possível concluir. Confira os dados e tente de novo.",
      })
    }
  }

  return (
    <div>
      <header className={`${motion.rise} ${styles.header}`} style={rise(0)}>
        <p className={styles.step}>Passo 2 de 2</p>
        <h1 className={styles.title}>Sua empresa</h1>
        <p className={styles.subtitle}>
          Quase lá, {responsible.name.split(" ")[0]}
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className={styles.form}
      >
        <div className={motion.rise} style={rise(120)}>
          <FormField label="Nome" error={errors.company?.name?.message}>
            <Input
              placeholder="Lanchonete do Zé"
              {...register("company.name", { required: "Informe o nome" })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(180)}>
          <FormField label="CNPJ" error={errors.company?.cnpj?.message}>
            <Input
              placeholder="00.000.000/0000-00"
              {...register("company.cnpj", { required: "Informe o CNPJ" })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(240)}>
          <FormField
            label="Razão social (opcional)"
            error={errors.company?.legalName?.message}
          >
            <Input
              placeholder="Zé Alimentos LTDA"
              {...register("company.legalName")}
            />
          </FormField>
        </div>

        {errors.root && (
          <p className={styles.errorText}>{errors.root.message}</p>
        )}

        <div className={motion.rise} style={rise(300)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.submit}
            loadingIndicator="dots"
          >
            Concluir cadastro
          </Button>
        </div>
      </form>
    </div>
  )
}
