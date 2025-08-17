"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Upload,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Gavel,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Zod and react-hook-form imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// shadcn/ui components for forms
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { lawyerSignUp, SignUp } from "@/actions/authactions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Data for all 36 Nigerian states + FCT
const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
].sort();

// Add specialization options
const specializations = [
  "Family Law",
  "Criminal Law",
  "Civil Litigation",
  "Property Law",
  "Corporate Law",
  "Human Rights",
  "Other",
];

// Define the Zod schema for the entire form
const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Invalid email address."),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters.")
      .optional()
      .or(z.literal("")),
    nbaNumber: z
      .string()
      .min(6, "NBA number is required.")
      .regex(/^SCN\d{6,}$/, "Invalid NBA number format. (e.g., SCN123456)"),
    callToBarYear: z.string().min(4, "Call to Bar Year is required."),
    stateOfCall: z.string().nonempty("Please select your state."),
    location: z.string().nonempty("Location is required."),
    specialization: z.string().nonempty("Specialization is required."),
    Bio: z.string().min(10, "Bio must be at least 10 characters."),
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
    profileImageUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function LawyerSignup() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Personal, 1: Professional, 2: Security
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const totalSteps = 3;

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      nbaNumber: "",
      callToBarYear: "", // <-- revert to string
      stateOfCall: "",
      location: "",
      specialization: "",
      Bio: "",
      password: "",
      confirmPassword: "",
      profileImageUrl: "",
    },
    mode: "onBlur",
  });

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // You should upload the image to your server or a cloud service here
      // For now, just use a local URL for preview
      const url = URL.createObjectURL(file);
      setProfileImage(file);
      form.setValue("profileImageUrl", url);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    switch (currentStep) {
      case 0: // Personal Details
        isValid = await form.trigger(["fullName", "email", "phoneNumber"]);
        break;
      case 1: // Professional Details
        isValid = await form.trigger([
          "nbaNumber",
          "callToBarYear",
          "stateOfCall",
          "location",
          "specialization",
          "Bio",
        ]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    // This function is called by form.handleSubmit only when all fields across all steps are valid
    setLoading(true);
    setError("");

    try {
      // Call the SignUp action with the form values
      // Ensure to pass all required fields as per your SignUp action definition
      const response = await lawyerSignUp(
        values.email,
        values.password,
        values.fullName,
        values.phoneNumber ?? "",
        values.nbaNumber,
        values.callToBarYear,
        values.stateOfCall,
        values.location,
        values.specialization,
        values.Bio,
        values.profileImageUrl ?? ""
      );

      if (response.success) {
        toast.success(response.message || "Sign up successful!");
        router.replace("/signin"); // Redirect to login page after successful signup
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
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                )}
                <label
                  htmlFor="profileImage"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Upload profile picture"
                >
                  <Upload className="h-6 w-6" />
                </label>
              </div>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Label
                htmlFor="profileImage"
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
              >
                Upload Profile Picture (Optional)
              </Label>
            </div>
            {/* Personal Details fields */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="e.g., 08012345678"
                      {...field}
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="nbaNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NBA Number</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Input
                            placeholder="e.g., SCN123456"
                            {...field}
                            className="pl-10"
                          />
                          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your Supreme Court of Nigeria Enrollment Number.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callToBarYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Bar Year</FormLabel>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g., 2010"
                      {...field}
                      className="pl-10"
                    />
                    <Gavel className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateOfCall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State of Call</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Input placeholder="e.g., Lagos" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <Input
                    placeholder="Short bio about your expertise"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...field}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
        <CardHeader className="text-center">
          <Scale className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
            Sign Up as a Lawyer
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Step {currentStep + 1} of {totalSteps}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-6"
            >
              {renderCurrentStep()}
              <div className="flex justify-between gap-4 mt-6">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="flex-1 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Previous
                  </Button>
                )}

                {currentStep < totalSteps - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className={`flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      currentStep === 0 ? "w-full" : ""
                    }`}
                  >
                    Next <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    {loading ? "Signing Up..." : "Sign Up"}{" "}
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in here.
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
