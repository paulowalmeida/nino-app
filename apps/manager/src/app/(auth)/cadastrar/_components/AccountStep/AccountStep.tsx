"use client"

import type { CSSProperties } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"

import { checkAvailability } from "@services/auth.service"

import {
  Button,
  CpfInput,
  FormField,
  Input,
  isValidCpf,
  PasswordInput,
  PasswordStrength,
  PhoneInput,
} from "@nino/ds"

import type { AccountFormValues, AccountStepProps } from "./AccountStep.types"

import styles from "@/app/(auth)/authForm.module.css"
import motion from "@/app/(auth)/motion.module.css"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rise = (delay: number): CSSProperties =>
  ({ ["--d"]: `${delay}ms` }) as CSSProperties

export function AccountStep({ onNext }: AccountStepProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>()

  const password = watch("password")

  async function onSubmit(data: AccountFormValues) {
    try {
      const availability = await checkAvailability({
        email: data.email,
        cpf: data.cpf,
      })

      let taken = false
      if (availability.email === false) {
        setError("email", { message: "E-mail já cadastrado" })
        taken = true
      }
      if (availability.cpf === false) {
        setError("cpf", { message: "CPF já cadastrado" })
        taken = true
      }
      if (taken) return

      onNext({
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
        phone: data.phone,
      })
    } catch {
      setError("root", {
        message: "Não foi possível validar os dados. Tente de novo.",
      })
    }
  }

  return (
    <div>
      <header className={`${motion.rise} ${styles.header}`} style={rise(0)}>
        <p className={styles.step}>Passo 1 de 2</p>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>
          Comece pelos seus dados de responsável
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className={styles.form}
      >
        <div className={motion.rise} style={rise(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              placeholder="Seu nome"
              {...register("name", { required: "Informe o nome" })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(180)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register("email", {
                required: "Informe o email",
                pattern: { value: EMAIL_PATTERN, message: "E-mail inválido" },
              })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(240)}>
          <FormField label="Telefone" error={errors.phone?.message}>
            <PhoneInput
              error={!!errors.phone}
              {...register("phone", { required: "Informe o telefone" })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(300)}>
          <FormField label="CPF" error={errors.cpf?.message}>
            <CpfInput
              error={!!errors.cpf}
              {...register("cpf", {
                required: "Informe o CPF",
                validate: (value) => isValidCpf(value) || "CPF inválido",
              })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(360)}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register("password", {
                required: "Informe a senha",
                minLength: {
                  value: 8,
                  message: "A senha deve ter ao menos 8 caracteres",
                },
                maxLength: {
                  value: 16,
                  message: "A senha deve ter no máximo 16 caracteres",
                },
              })}
            />
          </FormField>
          {password && <PasswordStrength password={password} />}
        </div>

        <div className={motion.rise} style={rise(420)}>
          <FormField
            label="Confirmar senha"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Confirme a senha",
                validate: (value) =>
                  value === getValues("password") || "As senhas não conferem",
              })}
            />
          </FormField>
        </div>

        {errors.root && (
          <p className={styles.errorText}>{errors.root.message}</p>
        )}

        <div className={motion.rise} style={rise(480)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.submit}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
        </div>
      </form>

      <p className={`${motion.rise} ${styles.footer}`} style={rise(540)}>
        Já tem conta?{" "}
        <Link href="/entrar" className={styles.footerLink}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
