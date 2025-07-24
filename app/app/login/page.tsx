"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Eye, EyeOff } from "lucide-react"; // Importing Eye and EyeOff for password visibility
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(""); // State for displaying login errors
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Show loading indicator

    // --- Placeholder for actual authentication logic ---
    // In a real application, you would send a request to your backend here.
    // Example:
    // try {
    //   const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     // Handle successful login (e.g., store token, redirect to dashboard)
    //     console.log('Login successful:', data);
    //     // Redirect to dashboard
    //     window.location.href = '/dashboard';
    //   } else {
    //     setError(data.message || 'Login failed. Please check your credentials.');
    //   }
    // } catch (err) {
    //   setError('An unexpected error occurred. Please try again.');
    //   console.error('Login error:', err);
    // } finally {
    //   setLoading(false);
    // }

    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    // Basic client-side validation/mock login
    if (email === "user@example.com" && password === "password123") {
      console.log("Login successful!");
      // In a real app, you'd redirect to the dashboard
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md mx-auto p-6 md:p-8 shadow-lg rounded-lg">
        <CardHeader className="text-center mb-6">
          <Link href="/" className="flex justify-center items-center mb-4">
            <Scale className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </Link>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign in to your LegalAid Connect account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {/* START OF EDITED SECTION */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                {" "}
                {/* This div is now the relative parent for Input and button */}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10" // Padding for the icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {/* END OF EDITED SECTION */}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full border bg-blue-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
