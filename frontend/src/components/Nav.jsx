import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Nav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-line">
      <Link to="/" className="font-display text-xl tracking-tight">
        InstaCut <span className="text-cutout">Pro</span>
      </Link>
      <div className="flex items-center gap-6 font-body text-sm">
        {user ? (
          <>
            <Link to="/studio" className="hover:text-cutout transition-colors">Studio</Link>
            <Link to="/gallery" className="hover:text-cutout transition-colors">Gallery</Link>
            <span className="font-mono text-xs px-2 py-1 bg-panel border border-line rounded">
              {user.credits} credits
            </span>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="hover:text-tape transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-cutout transition-colors">Log in</Link>
            <Link
              to="/register"
              className="bg-ink text-backdrop px-4 py-2 rounded-full hover:bg-cutout transition-colors"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
