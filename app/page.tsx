"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Callback to update the state when the carousel scrolls or resizes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  const onInit = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onInit, onScroll, onSelect]);

  // Functions to handle carousel navigation
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  // Data for the feature cards, making it easy to add or remove features
  const featureCards = [
    {
      icon: Users,
      title: "Verified Pro Bono Network",
      text: "Access a curated network of compassionate and experienced pro bono lawyers and paralegals committed to serving the indigent.",
      color: "border-blue-500",
    },
    {
      icon: ShieldCheck,
      title: "Secure Case Tracking",
      text: "Track your case progress securely with updates sourced directly from court data or input from your legal counsel.",
      color: "border-green-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Accessibility",
      text: "Our platform is flexible and can be accessed on any device, including your itel smartphone, ensuring you're always connected.",
      color: "border-purple-500",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      text: "Communicate directly and securely with your assigned legal representative within the app.",
      color: "border-yellow-500",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      text: "Supporting local languages like Hausa, Igbo, and Yoruba to ensure clarity and ease of use for all.",
      color: "border-red-500",
    },
    {
      icon: Handshake,
      title: "NGO Integration (Bonus)",
      text: "Seamless collaboration with key organizations like the Legal Aid Society, the Legal Services Corporation, and the Legal Defense and Assistance Project (LEDAP) in Nigeria.",
      color: "border-orange-500",
    },
  ];

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
            <Link href="/login">
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
            Justice for All: Where Indigent Litigants Through Probono Services
            experience quality legal representation.
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in-up delay-100">
            Affordable Justice made accessible by just about any Nigerian.
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
            The Obstacles to an efficient justice system in Nigeria.
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

      {/* Detailed Features Section - New Carousel Design */}
      <section
        id="features"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">
            Features Designed for You
          </h2>
          <div className="relative">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex -ml-4">
                {featureCards.map((card, index) => (
                  <div
                    key={index}
                    className="embla__slide flex-shrink-0 w-full px-4"
                  >
                    <Card
                      className={`h-full border-2 transform hover:scale-105 transition-all duration-300 ease-in-out relative group ${card.color} shadow-lg dark:shadow-2xl dark:shadow-gray-700 bg-white dark:bg-gray-900`}
                    >
                      <div
                        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${
                            card.color.split("-")[1] === "blue"
                              ? "#3b82f6"
                              : card.color.split("-")[1] === "green"
                              ? "#22c55e"
                              : card.color.split("-")[1] === "purple"
                              ? "#a855f7"
                              : card.color.split("-")[1] === "yellow"
                              ? "#f59e0b"
                              : card.color.split("-")[1] === "red"
                              ? "#ef4444"
                              : "#f97316"
                          }, transparent)`,
                        }}
                      ></div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-3 text-primary">
                          <card.icon className="h-6 w-6" />
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-700 dark:text-gray-300 relative z-10">
                        {card.text}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Buttons */}
            <Button
              className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full hidden md:block transition-all duration-300 hover:bg-blue-600 hover:text-white"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              variant="secondary"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-2 rounded-full hidden md:block transition-all duration-300 hover:bg-blue-600 hover:text-white"
              onClick={scrollNext}
              disabled={!canScrollNext}
              variant="secondary"
              size="icon"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Carousel Dots */}
          <div className="embla__dots flex justify-center mt-8">
            {featureCards.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`embla__dot w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></button>
            ))}
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
