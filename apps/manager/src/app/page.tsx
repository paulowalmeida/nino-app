import { LogoutButton } from '@/components/LogoutButton'
import { NinoLogo } from '@/components/NinoLogo'

const page = 'min-h-screen bg-gray-50'
const header =
  'flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4'
const main = 'mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center'
const badge =
  'mb-6 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand'
const title = 'font-display text-4xl font-extrabold tracking-tight text-gray-900'
const subtitle = 'mt-3 max-w-md text-base text-gray-500'

export default function HomePage() {
  return (
    <div className={page}>
      <header className={header}>
        <NinoLogo size="md" />
        <LogoutButton />
      </header>

      <main className={main}>
        <span className={badge}>Você está autenticado 🎉</span>
        <h1 className={title}>Painel em construção</h1>
        <p className={subtitle}>
          Em breve você vai gerir pedidos, cardápio e configurações da sua loja
          por aqui.
        </p>
      </main>
    </div>
  )
}
