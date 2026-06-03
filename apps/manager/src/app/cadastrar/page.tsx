import { RegisterForm } from './RegisterForm'

export default function CadastrarPage() {
  const classes = 'min-h-screen flex items-center justify-center bg-gray-50'
  return (
    <main className={classes}>
      <RegisterForm />
    </main>
  )
}
