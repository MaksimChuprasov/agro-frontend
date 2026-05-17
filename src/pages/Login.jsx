import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../store/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setUser = useAuth((s) => s.setUser);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await login({ email, password });

            localStorage.setItem("token", res.data.access_token);
            setUser(res.data.user);

            window.location.href = "/";
        } catch (e) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
                    Login
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Sign in to your account
                </p>
                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-5">

                    <div>
                        <label className="text-gray-600 text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-gray-600 text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </div>

            </div>

        </div>
    );
}
