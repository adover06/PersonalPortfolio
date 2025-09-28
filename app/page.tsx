import ScrollProgress from "@/app/components/ScrollProgress"
import ScrollHint from "@/app/components/ScrollHint";




export default function Home() {
  const links = [
    { label: "GitHub", href: "https://github.com/adover06" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/adover06" },
    { label: "Resume", href: "/resume.pdf" }, // place resume.pdf in /public
    { label: "Contact", href: "mailto:you@example.com" },
  ] as const;

  return (
    <>  
    <ScrollProgress/>
    <main className="min-h-screen bg-black text-white grid place-items-center p-6">
      <div className="text-center">
        <h1 className="font-bold leading-tight tracking-tight text-[clamp(2.5rem,6vw,5.75rem)]">
          <span className="block">Hello, I’m</span>
          <span className="block mt-3 bg-gradient-to-r from-blue-400 via-fuchsia-500 to-amber-400 text-transparent bg-clip-text">Andrew Dover.</span>
          <p className="block text-lg">&lt;Full Stack Developer/&gt;</p>
        </h1>
      
        <nav aria-label="Primary" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {links.map(({ label, href }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-block px-3 py-1 rounded-md text-lg sm:text-xl underline underline-offset-8 decoration-2 transition-all focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
    
    </>
  );
}
