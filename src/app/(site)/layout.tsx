import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import LavaBackground from '@/components/LavaBackground'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LavaBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
