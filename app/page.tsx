// import ScrollProgress from "@/components/ScrollProgress"
import ScrollHint from "@/components/ScrollHint";
import TechStrip from "@/components/SkillBar";
import ProjectsSection, { Project } from "@/components/Projects";
import StickyFooter  from "@/components/StickyFooter";
import CourseMaterialsSection, { Course } from "@/components/CourseMaterialsSection";
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { RetroGrid } from "@/components/ui/retro-grid"
import data from "@/public/data.json"
import MainHero from "@/components/MainHero";
const courses: Course[] = data["Courses"]


export default function Home() {
  const links = [
    { label: "GitHub", href: "https://github.com/adover06" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/adover06" },
    { label: "Resume", href: "/resume.pdf" }, // place resume.pdf in /public
    { label: "Contact", href:"mailto:andrew.dover@gmail.com?subject=Inquiry" },
  ] as const;

  const projects: Project[] = data["Projects"];

  return (
    <>  
    <ScrollProgress/>
    <RetroGrid />
    <main className="min-h-screen bg-black text-white grid place-items-center p-6 ">
      <MainHero links={links} />
    </main>
    
    <ScrollHint/>
    <TechStrip  />
    <ProjectsSection projects={projects} />
    <CourseMaterialsSection courses={courses} />
  
    <StickyFooter/>
    </>
  );
}
