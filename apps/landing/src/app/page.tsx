import { Demo } from "./_components/demo"
import { Features } from "./_components/features"
import { Footer } from "./_components/footer"
import { ForRestaurants } from "./_components/for-restaurants"
import { GetStarted } from "./_components/get-started"
import { Header } from "./_components/header"
import { Hero } from "./_components/hero"
import { HowItWorks } from "./_components/how-it-works"
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
