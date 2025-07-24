// app/page.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  Menu,
  X,
  Scale,
  Users,
  FileText,
  Bell,
  CheckCircle,
  Gavel,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  CalendarDays,
  Globe,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Just in case for future contact forms etc.
import { Textarea } from "@/components/ui/textarea"; // Just in case for future contact forms etc.

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // You can add smooth scrolling later if needed, but for now,
  // we'll just link to IDs on the page.

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-50">
              LegalAid Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#problem"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              The Problem
            </Link>
            <Link
              href="#solution"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Our Solution
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link href="/app/login">
              <Button variant="outline">Login / Dashboard</Button>
            </Link>
          </nav>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    LegalAid Connect
                  </span>
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>

              <nav className="flex flex-col gap-4 p-4">
                <Link
                  href="#problem"
                  className="py-2 text-lg text-gray-700 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  The Problem
                </Link>
                <Link
                  href="#solution"
                  className="py-2 text-lg text-gray-700 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Solution
                </Link>
                <Link
                  href="#features"
                  className="py-2 text-lg text-gray-700 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#contact"
                  className="py-2 text-lg text-gray-700 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link href="/app/login" className="w-full">
                  <Button
                    className="w-full mt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Dashboard
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle background pattern */}
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles)"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Justice for All: Empowering Indigent Litigants in Nigeria
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in-up delay-100">
            Connecting indigent citizens with timely pro bono legal aid,
            providing real-time case tracking, and delivering crucial alerts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 shadow-lg px-8 py-3 text-lg font-semibold"
              >
                Get Legal Help Now
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 shadow-lg px-8 py-3 text-lg font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section
        id="problem"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">
            The Hurdle to Justice in Nigeria
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-gray-900 shadow-md border-t-4 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-600">
                  <Handshake className="h-6 w-6" />
                  Unaffordable Representation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Millions of Nigerians cannot afford legal representation,
                  leading to unjust outcomes and prolonged pretrial detentions.
                  The promise of justice remains out of reach for many.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 shadow-md border-t-4 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-600">
                  <FileText className="h-6 w-6" />
                  Lack of Case Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Those who receive legal aid often lack visibility into their
                  case progress, especially in overburdened state and magistrate
                  courts. This absence of transparency leaves them feeling
                  forgotten.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 shadow-md border-t-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-600">
                  <CalendarDays className="h-6 w-6" />
                  Missed Updates & Delays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Crucial alerts regarding hearings or procedural changes are
                  often missed, leading to further delays and disempowerment,
                  trapping individuals in procedural limbo.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 shadow-md border-t-4 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <Gavel className="h-6 w-6" />
                  Erosion of Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The systemic barriers lead to a profound loss of trust in the
                  judicial system for those most vulnerable, undermining the
                  very foundation of justice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Overview / How It Works Section */}
      <section
        id="solution"
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-50">
            Introducing LegalAid Connect
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
            Your bridge to justice. LegalAid Connect empowers indigent citizens
            by providing a simple, accessible solution to legal representation
            and transparent case management.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-b-4 border-blue-500">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                  <Handshake className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  Connect with Experts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Easily find and connect with verified pro bono lawyers and
                  paralegal support tailored to your needs.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-b-4 border-green-500">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="p-4 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  Track Your Case
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Monitor the real-time status of your legal proceedings with
                  updates from courts or your legal counsel.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-b-4 border-purple-500">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="p-4 bg-purple-100 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  Receive Timely Alerts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Get instant notifications for upcoming hearings, filings, and
                  procedural changes to avoid delays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">
            Features Designed for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Users className="h-6 w-6" />
                  Verified Pro Bono Network
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Access a curated network of compassionate and experienced pro
                bono lawyers and paralegals committed to serving the indigent.
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                  Secure Case Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Track your case progress securely with updates sourced directly
                from court data or input from your legal counsel.
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Smartphone className="h-6 w-6" />
                  Mobile Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Our platform is designed to be mobile-first, ensuring you can
                access crucial information anytime, anywhere, even with basic
                smartphones.
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <MessageCircle className="h-6 w-6" />
                  Direct Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Communicate directly and securely with your assigned legal
                representative within the app.
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Globe className="h-6 w-6" />
                  Multilingual Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Supporting local languages like Hausa, Igbo, and Yoruba to
                ensure clarity and ease of use for all.
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Handshake className="h-6 w-6" />
                  NGO Integration (Bonus)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Seamless integration with existing legal aid organizations to
                streamline referrals and support.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-blue-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Seek Justice?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Take the first step towards transparency and effective legal
            support.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 shadow-xl px-10 py-4 text-xl font-semibold"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">
            Contact Us
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Name
              </label>
              <Input type="text" id="name" placeholder="John Doe" />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Email
              </label>
              <Input type="email" id="email" placeholder="you@example.com" />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Message
              </label>
              <Textarea
                id="message"
                rows={5}
                placeholder="How can we help you?"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} LegalAid Connect. All rights
            reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white">
              About Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
