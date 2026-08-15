import { useRef, useState } from "react";

// The signature element: drag the divider to reveal the cutout. Built with
// an inline SVG subject so the demo works with zero image assets/hosting.
export default function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  const subject = (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <ellipse cx="200" cy="150" rx="70" ry="80" fill="#15181C" />
      <path d="M90 400 C90 260 130 220 200 220 C270 220 310 260 310 400 Z" fill="#15181C" />
    </svg>
  );

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-line select-none cursor-ew-resize"
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* "before" layer: subject on a studio-photo gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9C3B3] to-[#E7E4DC] flex items-end justify-center pb-0">
        {subject}
      </div>

      {/* "after" layer: subject cut out on a transparency checkerboard */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-0"
        style={{
          clipPath: `inset(0 0 0 ${pos}%)`,
          backgroundImage:
            "repeating-conic-gradient(#F0EEE7 0% 25%, #DCD8CC 0% 50%)",
          backgroundSize: "20px 20px",
        }}
      >
        {subject}
      </div>

      {/* divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-tape"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-tape flex items-center justify-center font-mono text-[10px] text-ink">
          ⇔
        </div>
      </div>

      <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider bg-ink/80 text-backdrop px-2 py-1 rounded">
        Original
      </span>
      <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-wider bg-cutout text-backdrop px-2 py-1 rounded">
        Cut out
      </span>
    </div>
  );
}
