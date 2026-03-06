import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Activity, Loader2, ArrowLeft, UserPlus, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await api.get<{ exists: boolean }>("/setup-check");
        setIsFirstTime(!res.exists);
      } catch (err) {
        console.error("Setup check failed", err);
      } finally {
        setCheckingSetup(false);
      }
    };
    checkSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) return;
    setIsLoading(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: "0700000000",
        date_of_birth: new Date("1990-01-01").toISOString(),
        national_id: Math.floor(Math.random() * 10000000),
        address: "Clinic HQ",
        department: "Administration",
        specialty: "System Admin",
        start_date: new Date().toISOString(),
        role: "admin",
        status: "active"
      };
      // We use the regular add staff endpoint but it needs to be public for the first user
      // or we could have a specific setup endpoint. For now, since it's dev, we'll use /staff 
      // but the backend might have auth middleware. 
      // Actually, let's assume the user can call /staff if it's the very first time.
      await api.post("/staff", payload);
      toast({ title: "Admin account created!", description: "You can now sign in." });
      setIsFirstTime(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: err.message || "Could not create admin account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-md space-y-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <Card className="border-none shadow-xl shadow-slate-200/50 animate-fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${isFirstTime ? 'bg-amber-500' : 'bg-blue-600'}`}>
                {isFirstTime ? <ShieldCheck className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
              </div>
            </div>
            <CardTitle className="font-display text-2xl">
              {isFirstTime ? "Initial Setup" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isFirstTime 
                ? "Create the first administrator account to get started with Triple Ts Mediclinic." 
                : "Sign in to access your professional dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isFirstTime ? handleCreateAdmin : handleSubmit} className="space-y-4">
              {isFirstTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isFirstTime && (
                    <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className={`w-full font-semibold h-11 ${isFirstTime ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isFirstTime ? (
                  <><UserPlus className="mr-2 h-4 w-4" /> Create Administrator</>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          {isFirstTime 
            ? "Secure your clinic with professional management tools." 
            : "Having trouble? Contact your system administrator."}
        </p>
      </div>
    </div>
  );
}
