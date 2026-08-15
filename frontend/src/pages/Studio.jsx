import { useState } from "react";
import Nav from "../components/Nav";
import { processImage, processBatch, fileUrl } from "../api";
import { useAuth } from "../AuthContext";

const MODES = [
  { id: "transparent", label: "Transparent" },
  { id: "color", label: "Solid color" },
  { id: "gradient", label: "Gradient" },
  { id: "blur", label: "Blurred original" },
];

export default function Studio() {
  const { refresh } = useAuth();
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("transparent");
  const [color, setColor] = useState("#1F8A70");
  const [gradFrom, setGradFrom] = useState("#1F8A70");
  const [gradTo, setGradTo] = useState("#0B3D2E");
  const [blurRadius, setBlurRadius] = useState(24);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const onDrop = (e) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const opts = {
    mode,
    color,
    gradient_from: gradFrom,
    gradient_to: gradTo,
    blur_radius: blurRadius,
  };

  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      if (files.length === 1) {
        const { data } = await processImage(files[0], opts);
        setResults([{ ...data, url: fileUrl(data.output_path), zip: false }]);
      } else {
        const res = await processBatch(files, opts);
        const url = URL.createObjectURL(res.data);
        setResults([{ id: "batch", url, zip: true }]);
      }
      await refresh();
    } catch (err) {
      setError(err.response?.data?.detail || "Processing failed — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-backdrop text-ink font-body">
      <Nav />
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="font-display text-3xl mb-8">Studio</h1>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-line rounded-2xl p-10 text-center bg-panel"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <p className="font-display text-lg mb-1">
              {files.length ? `${files.length} image(s) selected` : "Drop images, or click to browse"}
            </p>
            <p className="text-sm text-ink/60">Up to 20 at once for batch processing</p>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">
              Background
            </p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    mode === m.id
                      ? "bg-ink text-backdrop border-ink"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            {mode === "color" && (
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">Color</p>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10" />
              </div>
            )}
            {mode === "gradient" && (
              <div className="flex gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">From</p>
                  <input type="color" value={gradFrom} onChange={(e) => setGradFrom(e.target.value)} className="w-16 h-10" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">To</p>
                  <input type="color" value={gradTo} onChange={(e) => setGradTo(e.target.value)} className="w-16 h-10" />
                </div>
              </div>
            )}
            {mode === "blur" && (
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">
                  Blur strength: {blurRadius}
                </p>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <button
          onClick={run}
          disabled={!files.length || busy}
          className="mt-8 bg-ink text-backdrop px-6 py-3 rounded-full font-medium hover:bg-cutout transition-colors disabled:opacity-40"
        >
          {busy ? "Processing…" : `Process ${files.length || ""}`}
        </button>

        {results.length > 0 && (
          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-3">Result</p>
            {results.map((r) => (
              <a
                key={r.id}
                href={r.url}
                download={r.zip ? "instacut-batch.zip" : `${r.id}.png`}
                className="inline-block border border-line rounded-xl p-4 bg-panel hover:border-cutout transition-colors"
              >
                {r.zip ? (
                  <p className="font-mono text-sm">⬇ Download instacut-batch.zip</p>
                ) : (
                  <img src={r.url} alt="result" className="max-h-80 rounded-lg" />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
