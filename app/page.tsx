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
import ExperienceSection, { Job } from "@/components/Experience";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
import { BlurFade } from "@/components/ui/blur-fade"
const courses: Course[] = data["Courses"]


export default function Home() {

  const links = data["Links"];
  const projects: Project[] = data["Projects"];
  const jobs: Job[] = data["Experience"]; 
  return (
    <>
      <ScrollProgress />
      <RetroGrid />
      <main className="min-h-screen bg-black text-white grid place-items-center p-6 ">
        <MainHero links={links} />
      </main>
      <ScrollHint />
      <Terminal className="center mx-auto my-20 max-w-2xl max-h-220 bg-black transition-all duration-700 overflow-hidden">
        <TypingAnimation duration={30}>$ cd ~/Projects</TypingAnimation>
        <TypingAnimation duration={20}>$ source SJSU/bin/activate</TypingAnimation>
        <TypingAnimation duration={20}>$ python contribute.py --git</TypingAnimation>
        <AnimatedSpan delay={0.5}>
          $ {new Date().toLocaleTimeString()} INFO Application Started
        </AnimatedSpan>
        <AnimatedSpan delay={0.5}>
          $ {new Date().toLocaleTimeString()} INFO Display - GET / 200 in 67ms
        </AnimatedSpan>
        <AnimatedSpan><GithubActivityCard year={2026} /></AnimatedSpan>
      </Terminal>
      <BlurFade delay={0.25} duration={0.5} inView={true}>
      <ProjectsSection projects={projects} />
      </BlurFade>
      <BlurFade delay={0.25} duration={0.5} inView={true}>
      <ExperienceSection jobs={jobs} />
      </BlurFade>
      <TechStrip />
      <BlurFade delay={0.5} duration={0.5} inView={true}>
      <CourseMaterialsSection courses={courses} />
      </BlurFade>
      <StickyFooter />
    </>
  );
}
