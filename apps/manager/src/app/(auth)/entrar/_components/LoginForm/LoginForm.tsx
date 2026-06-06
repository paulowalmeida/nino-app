"use client"

import type { CSSProperties } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button, FormField, Input, PasswordInput } from "@nino/ds"
import type { LoginRequest } from "@nino/lib"

import styles from "../../../authForm.module.css"
import motion from "../../../motion.module.css"

import { login, setTokens } from "@/services/auth.service"

const rise = (delay: number): CSSProperties =>
  ({ ["--d"]: `${delay}ms` }) as CSSProperties

export function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>()

  async function onSubmit(data: LoginRequest) {
    try {
      const { tokens } = await login(data)
      setTokens(tokens.accessToken, tokens.refreshToken)
      router.push("/painel")
    } catch {
      setError("root", { message: "Email ou senha incorretos." })
    }
  }

  return (
    <div>
      <header className={`${motion.rise} ${styles.header}`} style={rise(0)}>
        <h1 className={styles.title}>Bem-vindo</h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className={styles.form}
      >
        <div className={motion.rise} style={rise(120)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register("email", { required: "Informe o email" })}
            />
          </FormField>
        </div>

        <div className={motion.rise} style={rise(200)}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register("password", { required: "Informe a senha" })}
            />
          </FormField>
        </div>

        {errors.root && (
          <p className={styles.errorText}>{errors.root.message}</p>
        )}

        <div className={motion.rise} style={rise(280)}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.submit}
            loadingIndicator="dots"
          >
            Entrar
          </Button>
        </div>
      </form>

      <p className={`${motion.rise} ${styles.footer}`} style={rise(360)}>
        Não tem conta?{" "}
        <Link href="/cadastrar" className={styles.footerLink}>
          Criar conta
        </Link>
      </p>
    </div>
  )
}
