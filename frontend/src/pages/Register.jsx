import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { register } from "../api";
import { useAuth } from "../AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await register(email, password);
      signIn(data.access_token, data.user);
      navigate("/studio");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-backdrop text-ink font-body">
      <Nav />
      <div className="max-w-sm mx-auto mt-20 px-6">
        <h1 className="font-display text-3xl mb-2">Create an account</h1>
        <p className="text-sm text-ink/60 mb-8">Starts with 50 free credits.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line rounded-lg px-4 py-3 bg-panel focus:outline-none focus:border-cutout"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-line rounded-lg px-4 py-3 bg-panel focus:outline-none focus:border-cutout"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="bg-ink text-backdrop rounded-full py-3 font-medium hover:bg-cutout transition-colors">
            Create account
          </button>
        </form>
        <p className="text-sm text-ink/60 mt-6">
          Already have one? <Link to="/login" className="text-cutout">Log in</Link>
        </p>
      </div>
    </div>
  );
}
