import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, GraduationCap, Users, BookOpen, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/[0.02] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Academic Timetable Management System
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Manage Your Academic
              <span className="block text-primary mt-2">Schedule with Ease</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline timetable management for students, staff, and administrators.
              Access schedules, book rooms, and coordinate academic activities - all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-base px-8">
                <Link to="/signin">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                <Link to="/register">
                  Create Account
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-base px-8">
                <Link to="/timetable">
                  View Timetable
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 max-w-3xl mx-auto">
              {[
                { label: "Active Users", value: "1,200+" },
                { label: "Degrees", value: "50+" },
                { label: "Classrooms", value: "100+" },
                { label: "Daily Bookings", value: "500+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for modern academic institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Timetable Management",
                description: "Create and manage comprehensive timetables for all degree programs with conflict detection.",
              },
              {
                icon: Building2,
                title: "Room Booking",
                description: "Book classrooms and laboratories efficiently with real-time availability tracking.",
              },
              {
                icon: GraduationCap,
                title: "Student Portal",
                description: "Students can view their schedules, upcoming classes, and academic calendar.",
              },
              {
                icon: Users,
                title: "Staff Management",
                description: "Assign courses to staff members and manage teaching schedules seamlessly.",
              },
              {
                icon: BookOpen,
                title: "Course Management",
                description: "Organize modules, credits, and course dependencies across all programs.",
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "Instant notifications for schedule changes, room allocations, and important updates.",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Sign In",
                  description: "Access your account as student, staff, or administrator",
                },
                {
                  step: "02",
                  title: "Select Degree",
                  description: "Choose your degree program, level, and semester",
                },
                {
                  step: "03",
                  title: "View Schedule",
                  description: "Access your complete weekly timetable instantly",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-primary mx-auto -ml-12" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of users managing their academic schedules efficiently
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto px-8">
              <Link to="/signin">
                Sign In Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">
              <Link to="/register">
                Create Free Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}