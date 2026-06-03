import { LoginForm } from './LoginForm'

export default function EntrarPage() {
  const classes = 'min-h-screen flex items-center justify-center bg-gray-50'
  return (
    <main className={classes}>
      <LoginForm />
    </main>
  )
}
