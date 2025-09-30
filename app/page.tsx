import ScrollProgress from "@/components/ScrollProgress"
import ScrollHint from "@/components/ScrollHint";
import TechStrip from "@/components/SkillBar";
import ProjectsSection, { Project } from "@/components/Projects";
import StickyFooter  from "@/components/StickyFooter";
import RollingTitle from "@/components/RollingTitle";
import CourseMaterialsSection, { Course } from "@/components/CourseMaterialsSection";


const courses: Course[] = [
  {
    code: "CS 146",
    title: "Data Structures and Algorithms",
    description: "Implementations of advanced tree structures, priority queues, heaps, directed and undirected graphs. Advanced searching and sorting techniques (radix sort, heapsort, mergesort, and quicksort). Design and analysis of data structures and algorithms. Divide-and-conquer, greedy, and dynamic programming algorithm design techniques.",
    url: "https://catalog.sjsu.edu/preview_course_nopop.php?catoid=17&coid=157882",
  },
  {
    code: "CMPE 120",
    title: "Computer Organization and Architecture",
    description: "Introduction to computer organization and architecture, system buses, internal memory and external memory, input/output, central processing unit CPU, instruction sets, CPU structure and function, RISC, control unit.",
    url: "https://catalog.sjsu.edu/preview_course_nopop.php?catoid=10&coid=41920",
  },
  {
    code: "MATH 32",
    title: "Calculus 3",
    description: "Functions of more than one variable, partial derivatives, multiple integrals and vector calculus. Graphical, algebraic and numerical methods of solving problems.",
    url: "https://catalog.sjsu.edu/preview_course_nopop.php?catoid=10&coid=41254",
  },
  {
    code: "CMPE 131",
    title: "Software Engineering I",
    description: "Why software engineering? What is software engineering? Software development lifecycle activities: project planning and management requirements analysis, requirement specification. Software design, software testing, verification, validation, and documentation. Software quality assurance and review techniques, software maintenance, team-based projects.",
    url: "https://catalog.sjsu.edu/preview_course_nopop.php?catoid=10&coid=41926",
  },
];


export default function Home() {
  const links = [
    { label: "GitHub", href: "https://github.com/adover06" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/adover06" },
    { label: "Resume", href: "/resume.pdf" }, // place resume.pdf in /public
    { label: "Contact", href:"mailto:andrew.dover@gmail.com?subject=Inquiry" },
  ] as const;

  const projects: Project[] = [
  
  {
    title: "MagicMirror",
    description: "An Asthetic smart mirror to improve productivity",
    image: "/projects/Mirror.png",
    tags: ["Node.js"],
    links: {code: "https://github.com/you/portfolio" },
  },
  
  
  {
    title: "Personal Portfolio",
    description: "Sleek site built on Next.js for optimized CSR",
    image: "/projects/site.png",
    tags: ["Next.js", "React", "Tailwind"],
    links: { code: "https://github.com/you/" },
  },
    {
    title: "Liturgy.Display",
    description: "Realtime slide voice recognition based presentation system.",
    tags: ["FastAPI", "Vosk"],
    links: {code: "https://github.com/adover06/liturgy.display" },
  },
];

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
    <CourseMaterialsSection courses={courses} />
    <ProjectsSection projects={projects} />
    <TechStrip  />
    <StickyFooter/>
    </>
  );
}
