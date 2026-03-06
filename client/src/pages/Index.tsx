import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  ArrowRight, 
  ShieldCheck,
  Stethoscope,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    staff: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patients, appointments, staff] = await Promise.all([
          api.get<any[]>("/patients").catch(() => []),
          api.get<any[]>("/appointments").catch(() => []),
          api.get<any[]>("/staff").catch(() => [])
        ]);
        setStats({
          patients: (patients || []).length,
          appointments: (appointments || []).length,
          staff: (staff || []).length
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b px-6 py-16 md:py-24">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="max-w-6xl mx-auto relative">
          <Badge variant="outline" className="mb-4 py-1 px-3 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
            Welcome to Triple Ts Mediclinic
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-3xl leading-[1.1]">
            Modern Healthcare <span className="text-blue-600">Management</span> Simplified.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Streamline your clinic operations, manage patient records, and coordinate 
            staff schedules all in one secure, intuitive platform designed for excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/sign-in")}>
              Sign In to Portal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => navigate("/dashboard")}>
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100">Live</Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stats.patients}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Total Registered Patients</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-slate-500">Active</Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stats.appointments}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Pending Appointments</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-slate-500">Verified</Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stats.staff}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Medical Professionals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Comprehensive Clinic Care</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Everything you need to run a modern medical facility with efficiency and precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm group-hover:shadow-md transition-shadow">
                <Stethoscope className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Patient Records</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Complete digital history for every patient with secure access control.</p>
            </div>
            <div className="group">
              <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm group-hover:shadow-md transition-shadow">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Smart Scheduling</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Efficiently manage doctor availability and patient bookings.</p>
            </div>
            <div className="group">
              <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm group-hover:shadow-md transition-shadow">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Billing & Invoices</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Automated billing generation with professional printable invoices.</p>
            </div>
            <div className="group">
              <div className="mb-4 p-3 rounded-2xl bg-white w-fit shadow-sm group-hover:shadow-md transition-shadow">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Analytics</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Real-time insights into clinic performance and patient health trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">TT</span>
            </div>
            <span className="font-bold text-slate-900">Triple Ts Mediclinic</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 Mediclinic Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
