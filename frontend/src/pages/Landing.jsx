import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

export default function Landing() {
  return (
    <div className="min-h-screen bg-backdrop text-ink font-body">
      <Nav />

      <section className="max-w-6xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-cutout">
            AI photo studio
          </span>
          <h1 className="font-display text-5xl leading-[1.05] mt-4 mb-6">
            Cut it out.
            <br />
            Drop it anywhere.
          </h1>
          <p className="text-base text-ink/70 max-w-md mb-8">
            Remove backgrounds in one pass, then place your subject on a solid
            color, a gradient, or a blurred scene — batches at a time, with a
            gallery and API to match.
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-ink text-backdrop px-6 py-3 rounded-full font-medium hover:bg-cutout transition-colors"
            >
              Start cutting — free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-full font-medium border border-line hover:border-ink transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
        <BeforeAfterSlider />
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-24 grid sm:grid-cols-3 gap-8">
        {[
          {
            k: "01",
            t: "Remove or replace",
            d: "Transparent PNG, a flat color, a gradient backdrop, or a blurred version of the original.",
          },
          {
            k: "02",
            t: "Batch it",
            d: "Drop up to 20 images at once and get a zip back — built for product catalogs.",
          },
          {
            k: "03",
            t: "Call it from code",
            d: "Every account gets an API key. Same pipeline, no browser required.",
          },
        ].map((f) => (
          <div key={f.k} className="border-t border-line pt-4">
            <span className="font-mono text-xs text-cutout">{f.k}</span>
            <h3 className="font-display text-xl mt-2 mb-2">{f.t}</h3>
            <p className="text-sm text-ink/70">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
