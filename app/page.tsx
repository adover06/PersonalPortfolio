// import ScrollProgress from "@/components/ScrollProgress"
import ScrollHint from "@/components/ScrollHint";
import TechStrip from "@/components/SkillBar";
import ProjectsSection, { Project } from "@/components/Projects";
import StickyFooter  from "@/components/StickyFooter";
import RollingTitle from "@/components/RollingTitle";
import CourseMaterialsSection, { Course } from "@/components/CourseMaterialsSection";
import { ScrollProgress } from "@/components/ui/scroll-progress"
import data from "@/public/data.json"

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
    <main className="min-h-screen bg-black text-white grid place-items-center p-6 ">
      <div className="text-center">
        <h1 className="font-bold leading-tight tracking-tight text-[clamp(2.5rem,6vw,5.75rem)]">
          <span className="block">Hello, I’m</span>
          <span className="block mt-3 bg-gradient-to-r from-blue-400 via-fuchsia-500 to-amber-400 text-transparent bg-clip-text ">Andrew Dover.</span>
          <RollingTitle/>
        </h1>
      
        <nav aria-label="Primary" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {links.map(({ label, href }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-block px-3 py-1 rounded-md text-lg sm:text-xl hover:opacity-30 underline underline-offset-8 decoration-2 transition-all"
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </main>
    <ScrollHint/>
    <ProjectsSection projects={projects} />
    <CourseMaterialsSection courses={courses} />
    <TechStrip  />
    <StickyFooter/>
    </>
  );
}
