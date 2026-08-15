"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldHalf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-0 px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(700px 400px at 15% 20%, rgba(88,101,242,0.16), transparent 60%), radial-gradient(700px 400px at 85% 80%, rgba(124,92,255,0.14), transparent 60%)",
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M 46 0 L 0 0 0 46" fill="none" stroke="#22b8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="card-surface relative w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary glow-primary">
            <ShieldHalf className="h-6 w-6 text-white" />
          </div>
          <p className="mt-3 text-lg font-bold text-text-1">AegisSOC AI</p>
          <h1 className="mt-4 text-xl font-bold text-text-1">Welcome Back</h1>
          <p className="mt-1 text-sm text-text-2">Login to your Security Operations Center</p>
        </div>

        <form
          className="mt-7 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-2">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              defaultValue="john.doe@aegissoc.ai"
              className="w-full rounded-lg border border-border-1 bg-surface-1 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-2 outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-text-2">Password</label>
              <button type="button" className="text-xs text-primary hover:underline cursor-pointer">Forgot Password?</button>
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                defaultValue="••••••••••"
                className="w-full rounded-lg border border-border-1 bg-surface-1 px-3.5 py-2.5 pr-10 text-sm text-text-1 placeholder:text-text-2 outline-none focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-2 hover:text-text-1 cursor-pointer"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full py-2.5">
            Login
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-1" />
          <span className="text-xs text-text-2">or Login via SSO</span>
          <div className="h-px flex-1 bg-border-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-border-1 bg-surface-1 py-2.5 text-sm text-text-1 hover:bg-white/5 cursor-pointer">
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-border-1 bg-surface-1 py-2.5 text-sm text-text-1 hover:bg-white/5 cursor-pointer">
            Microsoft
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-text-2">
          Don&apos;t have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
