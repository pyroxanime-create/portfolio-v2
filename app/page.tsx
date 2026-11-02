import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import HowIWork from "@/components/HowIWork";
import { About, Contact, Footer, Skills } from "@/components/Sections";

export default function Home() {
  return (
    <div className="shell">
      <Header />
      <main id="main" className="main" tabIndex={-1}>
        <Hero />
        <Work />
        <HowIWork />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
