"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SetupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create admin account");
      } else {
        router.push("/login?setup=success");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/50"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/50"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}
