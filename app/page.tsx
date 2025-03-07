import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Features from "@/components/features";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";
import Usages from "@/components/usages";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <Usages />
      <CTASection />
      <Footer />
    </main>
  );
}
