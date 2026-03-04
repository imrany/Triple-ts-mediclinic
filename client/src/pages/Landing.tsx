import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Clock, Users } from "lucide-react";

const features = [
  { icon: Users, title: "Patient Management", desc: "Complete patient records, medical history, and document management." },
  { icon: Clock, title: "Appointment Scheduling", desc: "Efficient scheduling with reminders and calendar integration." },
  { icon: Shield, title: "Secure & Compliant", desc: "Data security and compliance with healthcare standards." },
  { icon: Activity, title: "Real-time Analytics", desc: "Dashboard with insights into clinic performance." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">Triple TS Mediclinic</span>
          </div>
          <Link to="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Modern Hospital
            <span className="block text-primary">Management System</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Streamline your clinic operations with an integrated system for patients,
            appointments, pharmacy, laboratory, billing and staff management.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/sign-in">
              <Button size="lg" className="font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Triple TS Mediclinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
