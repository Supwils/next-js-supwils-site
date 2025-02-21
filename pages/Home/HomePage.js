import IntroCard from "@/components/HomeComponents/IntroCard";
import AboutMe from "@/components/HomeComponents/AboutMeCard";
import Exprience from "@/components/HomeComponents/Experience";
import Contact from "@/components/HomeComponents/Contact";
export default function HomePage() {
  return (
    <div>
      <IntroCard />
      <AboutMe />
      <Exprience />
      <Contact />
      {/* <SkillCard /> */}
    </div>
  );
}
