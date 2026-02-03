import ScrollHint from "@/components/ScrollHint";
import TechStrip from "@/components/SkillBar";
import ProjectsSection, { Project } from "@/components/Projects";
import StickyFooter from "@/components/StickyFooter";
import CourseMaterialsSection, { Course } from "@/components/CourseMaterialsSection";
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { RetroGrid } from "@/components/ui/retro-grid"
import data from "@/public/data.json"
import MainHero from "@/components/MainHero";
import { GithubActivityCard } from "@/components/Contributions";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
const courses: Course[] = data["Courses"]


export default function Home() {

  const links = data["Links"];
  const projects: Project[] = data["Projects"];

  return (
    <>
      <ScrollProgress />
      <RetroGrid />
      <main className="min-h-screen bg-black text-white grid place-items-center p-6 ">
        <MainHero links={links} />
      </main>
      <ScrollHint />
      <Terminal className="center mx-auto my-20 max-w-2xl max-h-220 bg-black">
        <TypingAnimation duration={30}>$ cd ~/Projects</TypingAnimation>
        <TypingAnimation duration={20}>$ source SJSU/bin/activate</TypingAnimation>
        <TypingAnimation duration={20}>$ python contribute.py</TypingAnimation>
        <AnimatedSpan delay={0.5}>
          $ {new Date().toLocaleTimeString()} INFO Application Started
        </AnimatedSpan>
        <AnimatedSpan delay={0.5}>
          $ {new Date().toLocaleTimeString()} INFO Display
        </AnimatedSpan>
        <AnimatedSpan><GithubActivityCard year={2026} /></AnimatedSpan>
      </Terminal>
      <ProjectsSection projects={projects} />
      <CourseMaterialsSection courses={courses} />
      <TechStrip />
      <StickyFooter />
    </>
  );
}
