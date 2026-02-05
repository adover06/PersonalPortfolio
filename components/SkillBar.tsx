"use client"

import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"

type Icon = { src: string; alt: string }

const ICONS: Icon[] = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", alt: "Python" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", alt: "Java" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original-wordmark.svg", alt: "FastAPI" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", alt: "TypeScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", alt: "Git" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original-wordmark.svg", alt: "Arduino" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-plain.svg", alt: "Debian" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", alt: "React" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", alt: "Docker" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-plain-wordmark.svg", alt: "Redis" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlalchemy/sqlalchemy-plain.svg", alt: "SQLAlchemy" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg", alt: "SQLite" },
  {src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", alt: "TailwindCSS" },
  {src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg", alt: "Ubuntu" },
  {src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg", alt: "Windows" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/yaml/yaml-original.svg", alt: "YAML" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-plain.svg", alt: "JSON" },


]

type Props = {
  icons?: Icon[]
}

export default function TechStrip({ icons = ICONS }: Props) {
  const sizeClass = "h-18 w-18 md:h-22 md:w-22"

  const renderIcons = icons.map((icon, i) => (
    <div key={icon.alt + i} className="mx-4 inline-flex">
      <img
        src={icon.src}
        alt={icon.alt}
        className={`${sizeClass} object-contain select-none pointer-events-none`}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,0.08))" }}
      />
    </div>
  ))

  return (
    <section className="bg-black text-white pt-16 pb-28 md:pt-20 md:pb-32" aria-label="Technologies">
      <div className="max-w-4xl mx-auto px-6 md:px-8 mb-8 md:mb-12 ">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">My Tech Stack</h2>
      </div>
      <div className="w-full px-2 sm:px-4">
        <ScrollVelocityContainer className="space-y-8">
          <ScrollVelocityRow baseVelocity={8} direction={1} className="gap-10">
            {renderIcons}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={4} direction={-1} className="gap-10">
            {renderIcons}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  )
}
