/*
  A survey transect running the full height of the page, in the outer margin.

  The hero is a map; this is the line you'd draw across it. It keeps the
  cartographic language going past the fold instead of letting it stop dead at
  the end of the canvas, and it gives the section rules something to terminate
  against so the page reads as a drawn grid rather than stacked blocks.

  A faint marker descends it on a long loop — slow enough to be noticed only
  once, which is the right amount for something that repeats forever.

  No client JS: the descent is a CSS keyframe on `top`, which is a percentage of
  the containing block and therefore works at any page length.
*/
export default function Transect() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-4 w-px overflow-hidden sm:left-10"
    >
      {/* The line itself, fading in and out at both ends. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--rule) 6%, var(--rule) 94%, transparent 100%)",
        }}
      />
      {/* Two descending markers, offset so the line is rarely empty but never
          reads as a repeating tick. */}
      <div className="trickle absolute left-0 h-28 w-px" />
      {/* Dimmed via its own gradient rather than `opacity`, which the keyframes
          animate and would therefore override. */}
      <div
        className="trickle absolute left-0 h-16 w-px"
        style={{
          animationDelay: "-9500ms",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(217,164,65,0.45) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
