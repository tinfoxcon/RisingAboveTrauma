import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        name,
        email,
        password,
        redirect: true,
      });
    } catch (err) {
      setError("This email may already be registered. Try signing in instead.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: "linear-gradient(to bottom, #4A2D8F, #F0B429)" }}
    >
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🕊️</div>
          <h1 className="text-2xl font-monte-carlo text-[#F0B429] italic">
            Create A Free Account
          </h1>
        </div>

        <div className="space-y-6">
          <input
            required
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-lg border-2 border-[#F0B429] px-4 py-3 text-lg outline-none focus:border-[#4A2D8F]"
          />
          <input
            required
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border-2 border-[#F0B429] px-4 py-3 text-lg outline-none focus:border-[#4A2D8F]"
          />
          <input
            required
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border-2 border-[#F0B429] px-4 py-3 text-lg outline-none focus:border-[#4A2D8F]"
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#F0B429] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#d99f24] disabled:opacity-50"
          >
            {loading ? "Loading..." : "Create Free Account"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/account/signin"
              className="text-[#4A2D8F] hover:text-[#5c3aa8]"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
