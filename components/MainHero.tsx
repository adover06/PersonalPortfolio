import React from "react";
import RollingTitle from "@/components/RollingTitle";
import LinkBar from "@/components/LinkBar";
import { TypingAnimation } from "@/components/ui/typing-animation";

type LinkItem = {
  label: string;
  href: string;
};

export default function MainHero({ links }: { links: readonly LinkItem[] }) {
  return (
    <div className="text-center">
      <h1 className="font-bold leading-tight tracking-tight text-[clamp(2.5rem,6vw,5.75rem)]">
        <span className="block">Hello, I’m</span>
        <div>
          <TypingAnimation showCursor={true} className=" bg-gradient-to-r from-blue-300 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            Andrew Dover.
          </TypingAnimation>
        </div>
        <br />
        <RollingTitle />
      </h1>

      <LinkBar links={links} />
    </div>
  );
}
