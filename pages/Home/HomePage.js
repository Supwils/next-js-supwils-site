import IntroCard from "@/components/HomeComponents/IntroCard";
import AboutMe from "@/components/HomeComponents/AboutMeCard";
import Exprience from "@/components/HomeComponents/Experience";
import Contact from "@/components/HomeComponents/Contact";
import ParticleSection from "@/components/CustomComponents/ParticleSection";

export default function HomePage()
{
  return (
    <div>
      <ParticleSection
        particleCount={40}
        lightThemeColor="rgba(255, 0, 0, 0.25)"
        darkThemeColor="rgba(255, 50, 50, 0.35)"
        speed={0.4}
      >
        <IntroCard />
      </ParticleSection>
      <AboutMe />
      <Exprience />
      <Contact />

      {/* <SkillCard /> */}
    </div>
  );
}
