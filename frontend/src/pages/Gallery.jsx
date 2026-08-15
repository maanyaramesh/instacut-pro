import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { getGallery, fileUrl } from "../api";

export default function Gallery() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getGallery().then(({ data }) => setJobs(data));
  }, []);

  return (
    <div className="min-h-screen bg-backdrop text-ink font-body">
      <Nav />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="font-display text-3xl mb-8">Gallery</h1>
        {jobs.length === 0 ? (
          <p className="text-ink/60">
            Nothing here yet — process an image in the Studio and it'll show up here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {jobs.map((j) => (
              <a
                key={j.id}
                href={fileUrl(j.output_path)}
                download
                className="block border border-line rounded-xl overflow-hidden bg-panel hover:border-cutout transition-colors"
              >
                <img src={fileUrl(j.output_path)} alt={j.original_filename} className="w-full aspect-square object-cover" />
                <p className="font-mono text-[10px] uppercase tracking-wider px-2 py-2 truncate">
                  {j.mode}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
