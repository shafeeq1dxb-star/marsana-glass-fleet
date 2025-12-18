import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Marsana Rent A Car | Premium Car Rental in Saudi Arabia</title>
        <meta
          name="description"
          content="Experience premium car rental with Marsana. From economy to luxury vehicles, find the perfect car for your journey in Saudi Arabia at competitive rates."
        />
        <meta
          name="keywords"
          content="car rental, rent a car, Saudi Arabia, Riyadh, Marsana, vehicle rental, economy cars, sedan rental"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ParticlesBackground />
        <Header />
        <main>
          <Hero />
          <FleetSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
