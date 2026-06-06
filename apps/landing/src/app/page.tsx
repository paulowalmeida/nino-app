import { GetStarted } from "./_components/get-started"
import { HowItWorks } from "./_components/how-it-works"
import { Demo } from "./_components/demo"
import { Features } from "./_components/features"
import { Footer } from "./_components/footer"
import { Header } from "./_components/header"
import { Hero } from "./_components/hero"
import { ForRestaurants } from "./_components/for-restaurants"
import { Pricing } from "./_components/pricing"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Demo />
      <HowItWorks />
      <ForRestaurants />
      <Pricing />
      <GetStarted />
      <Footer />
    </>
  )
}
