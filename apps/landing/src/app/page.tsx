import { Comecar } from '@/components/Comecar'
import { ComoFunciona } from '@/components/ComoFunciona'
import { Demo } from '@/components/Demo'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { ParaRestaurantes } from '@/components/ParaRestaurantes'
import { Precos } from '@/components/Precos'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Demo />
      <ComoFunciona />
      <ParaRestaurantes />
      <Precos />
      <Comecar />
      <Footer />
    </>
  )
}
