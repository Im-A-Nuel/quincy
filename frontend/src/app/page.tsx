import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustPoints } from "@/components/landing/TrustPoints";
import { CallToAction } from "@/components/landing/CallToAction";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustPoints />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
