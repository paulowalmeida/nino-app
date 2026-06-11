"use client"

import type { CSSProperties } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { checkAvailability, setTokens, signup } from "@services/auth.service"

import { Button, CnpjInput, FormField, Input, isValidCnpj } from "@nino/ds"

import type { CompanyFormValues, CompanyStepProps } from "./CompanyStep.types"

import styles from "@/app/(auth)/authForm.module.css"
import motion from "@/app/(auth)/motion.module.css"

const rise = (delay: number): CSSProperties =>
  ({ ["--d"]: `${delay}ms` }) as CSSProperties

export function CompanyStep({ account, onBack }: CompanyStepProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>()

  async function onSubmit(data: CompanyFormValues) {
    try {
      const availability = await checkAvailability({
        cnpj: data.company.cnpj,
      })
      if (availability.cnpj === false) {
        setError("company.cnpj", { message: "CNPJ já cadastrado" })
        return
      }

      const { tokens } = await signup({ account, company: data.company })
      setTokens(tokens.accessToken, tokens.refreshToken)
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
          Quase lá, {account.name.split(" ")[0]}
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
            <CnpjInput
              error={!!errors.company?.cnpj}
              {...register("company.cnpj", {
                required: "Informe o CNPJ",
                validate: (value) => isValidCnpj(value) || "CNPJ inválido",
              })}
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
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
            className={styles.submit}
          >
            Voltar
          </Button>
        </div>
      </form>
    </div>
  )
}
