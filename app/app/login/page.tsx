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

// React Hook Form and Zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Assuming this path is correct
import { toast } from "sonner"; // Assuming sonner is installed
import { useRouter } from "next/navigation"; // For redirection

// Import your Login server action
import { Login } from "../../../actions/authactions"; // Adjust path if necessary

// Define the Zod schema for the login form
const SigninformSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(1, "Password is required"), // Basic validation for password presence
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(""); // State for displaying login errors
  const [loading, setLoading] = useState(false); // State for loading indicator

  const router = useRouter(); // Initialize useRouter

  // Initialize react-hook-form for the login form
  const form = useForm<z.infer<typeof SigninformSchema>>({
    resolver: zodResolver(SigninformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Validate on blur
  });

  // This function will be called by react-hook-form on valid submission
  const handleLogin = async (values: z.infer<typeof SigninformSchema>) => {
    setError(""); // Clear previous errors
    setLoading(true); // Show loading indicator

    try {
      // Call your Login server action
      const response = await Login(values.email, values.password); // Assuming "user" role is passed

      if (response.success) {
        toast.success(response.message || "Login successful!");
        router.replace("/dashboard"); // Redirect to dashboard on success
      } else {
        setError(
          response.message || "Login failed. Please check your credentials."
        );
        toast.error(response.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false); // Hide loading indicator
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
          <Form {...form}>
            {" "}
            {/* Wrap the form content with Form provider */}
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        required
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          required
                          className="pr-10" // Padding for the icon
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </Form>{" "}
          {/* Close Form provider */}
          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Don&apos;t have an account?{" "}
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
