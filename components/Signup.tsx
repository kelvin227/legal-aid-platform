"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  KeyRound,
  Handshake,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// React Hook Form and Zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
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

// Import your SignUp server action
import { SignUp } from "../actions/authactions"; // Adjust path if necessary

// Define the Zod schema for the entire form
const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must not exceed 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    lastName: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    address: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    city: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    state: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    zipCode: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    isIndigent: z.boolean().default(true), // Default to true as per schema
    proofOfIndigencyUrl: z
      .string()
      .url("Invalid URL format")
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path to the field that caused the error
  });

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Personal, 1: Account, 2: Location, 3: Indigency

  const totalSteps = 4; // Total number of steps in the form
  const router = useRouter(); // Initialize useRouter

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      isIndigent: true,
      proofOfIndigencyUrl: "",
    },
    mode: "onBlur", // Validate on blur for better UX in multi-step forms
  });

  const handleNextStep = async () => {
    let isValid = false;
    setError(""); // Clear previous errors before validating

    switch (currentStep) {
      case 0: // Personal Details
        isValid = await form.trigger([
          "email",
          "firstName",
          "lastName",
          "phoneNumber",
        ]);
        break;
      case 1: // Account Security
        isValid = await form.trigger(["password", "confirmPassword"]);
        break;
      case 2: // Location Information (all optional, so trigger will pass if fields are empty or valid)
        isValid = await form.trigger(["address", "city", "state", "zipCode"]);
        break;
      case 3: // Legal Aid Eligibility (proofOfIndigencyUrl is optional)
        isValid = await form.trigger(["isIndigent", "proofOfIndigencyUrl"]);
        break;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    } else {
      // Get errors from react-hook-form and display them
      const errors = form.formState.errors;
      // Prioritize specific error messages
      if (errors.email) setError(errors.email.message || "Invalid email.");
      else if (errors.password)
        setError(errors.password.message || "Invalid password.");
      else if (errors.confirmPassword)
        setError(errors.confirmPassword.message || "Passwords do not match.");
      else if (errors.phoneNumber)
        setError(errors.phoneNumber.message || "Invalid phone number format.");
      else if (errors.proofOfIndigencyUrl)
        setError(
          errors.proofOfIndigencyUrl.message ||
            "Invalid URL for proof of indigency."
        );
      else setError("Please correct the errors in the current section."); // Generic fallback
    }
  };

  const handlePreviousStep = () => {
    setError(""); // Clear errors when going back
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    // This function is called by form.handleSubmit only when all fields across all steps are valid
    setLoading(true);
    setError("");

    try {
      // Call the SignUp action with the form values
      // Ensure to pass all required fields as per your SignUp action definition
      const response = await SignUp(
        values.email,
        values.password,
        values.firstName || "",
        values.lastName || "",
        values.phoneNumber || "",
        values.address || "",
        values.city || "",
        values.state || "",
        values.zipCode || "",
        values.isIndigent ? "true" : "false",
        values.proofOfIndigencyUrl || ""
      );

      if (response.success) {
        toast.success(response.message || "Sign up successful!");
        router.replace("/login"); // Redirect to login page after successful signup
      } else {
        setError(response.message || "Sign up failed. Please try again.");
        toast.error(response.message || "Sign up failed.");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <User className="h-5 w-5" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName">
                      First Name (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName">
                      Last Name (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                    className="flex items-center gap-1"
                  >
                    <Mail className="h-4 w-4" /> Email{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      required
                      className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="phoneNumber"
                    className="flex items-center gap-1"
                  >
                    <Phone className="h-4 w-4" /> Phone Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+2348012345678"
                      {...field}
                      value={field.value || ""} // Fix: Provide empty string fallback for null
                      className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <KeyRound className="h-5 w-5" /> Account Security
            </h3>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        required
                        className="pr-10 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        required
                        className="pr-10 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
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
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-xl font-semibold mb-2 pt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <MapPin className="h-5 w-5" /> Location (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormControl>
                      <Input
                        id="address"
                        type="text"
                        placeholder="123 Main St"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <FormControl>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Lagos"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="state">State/Region</FormLabel>
                    <FormControl>
                      <Input
                        id="state"
                        type="text"
                        placeholder="Lagos State"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="zipCode">Zip/Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="100001"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-xl font-semibold mb-2 pt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Handshake className="h-5 w-5" /> Legal Aid Eligibility
            </h3>
            <FormField
              control={form.control}
              name="isIndigent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      id="isIndigent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="isIndigent"
                      className="text-base font-medium leading-none text-gray-800 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I identify as an indigent litigant seeking pro bono legal
                      aid.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("isIndigent") && ( // Conditionally render based on form state
              <FormField
                control={form.control}
                name="proofOfIndigencyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="proofOfIndigencyUrl"
                      className="flex items-center gap-1 mt-4"
                    >
                      <FileText className="h-4 w-4" /> Proof of Indigency
                      Document URL (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="proofOfIndigencyUrl"
                        type="url"
                        placeholder="https://example.com/my-document.pdf"
                        {...field}
                        value={field.value || ""} // Fix: Provide empty string fallback for null
                        className="mt-1 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      (e.g., link to an income statement, benefits letter. This
                      can be uploaded later.)
                    </p>
                  </FormItem>
                )}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex w-full items-center justify-center p-4 text-white relative overflow-hidden"
      style={{
        backgroundImage:
          'url("https://placehold.co/1920x1080/1a202c/ffffff?text=City+Skyline")', // Placeholder for a city skyline image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <Card className="w-full max-w-lg mx-auto p-6 md:p-8 shadow-2xl rounded-xl border-2 border-blue-400/50 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 relative z-10">
        <CardHeader className="text-center mb-6">
          <Link href="/" className="flex justify-center items-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-pulse" />
          </Link>
          <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 drop-shadow-md">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Join LegalAid Connect and get the justice you deserve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {" "}
            {/* Wrap the form content with Form provider */}
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-6"
            >
              {renderCurrentStep()}

              {error && (
                <p className="text-red-500 text-sm text-center font-medium mt-4">
                  {error}
                </p>
              )}

              <div className="flex justify-between gap-4 mt-6">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="flex-1 py-3 text-lg font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Previous
                  </Button>
                )}

                {currentStep < totalSteps - 1 && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Next <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                )}

                {currentStep === totalSteps - 1 && (
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                )}
              </div>
            </form>
          </Form>{" "}
          {/* Close Form provider */}
          <div className="mt-8 text-center text-base text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
