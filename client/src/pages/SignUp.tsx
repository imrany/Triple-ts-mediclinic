import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Eye, EyeOff, User, Mail, Phone, Stethoscope, User2, Calendar, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useIsMobile from "@/hooks/useIsMobile";
import { useAppContext } from "@/context";

type PatientFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    emergencyContact: string;
    termsAccepted: boolean;
};

type DoctorFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    gender: string;
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: string;
    education: string;
    biography: string;
    availableForEmergency: boolean;
    termsAccepted: boolean;
};

export default function SignUp() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("patient");
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { api_url } = useAppContext();
    
    // Patient form
    const {
        register: registerPatient,
        handleSubmit: handleSubmitPatient,
        watch: watchPatient,
        setValue: setValuePatient,
        formState: { errors: patientErrors }
    } = useForm<PatientFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            address: "",
            emergencyContact: "",
            termsAccepted: false
        }
    });

    // Doctor form
    const {
        register: registerDoctor,
        handleSubmit: handleSubmitDoctor,
        watch: watchDoctor,
        setValue: setValueDoctor,
        formState: { errors: doctorErrors }
    } = useForm<DoctorFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            gender: "",
            specialization: "",
            licenseNumber: "",
            yearsOfExperience: "",
            education: "",
            biography: "",
            availableForEmergency: false,
            termsAccepted: false
        }
    });

    const patientPassword = watchPatient("password");
    const doctorPassword = watchDoctor("password");

    const onSubmitPatient = async(data: PatientFormValues) => {
        if (data.password !== data.confirmPassword) {
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`${api_url}/api/sign-up/patient`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    address: data.address,
                    emergencyContact: data.emergencyContact,
                    userType: "patient"
                })
            });
            
            const parseRes = await response.json();
            if (parseRes.error) {
                console.log(parseRes.error);
                setLoading(false);
            } else {
                console.log(parseRes);
                setTimeout(() => {
                    setLoading(false);
                    navigate(`/signin`);
                }, 2000);
            }
        } catch (error: any) {
            console.log(error.message);
            setLoading(false);
        }
    };
    
    const onSubmitDoctor = async(data: DoctorFormValues) => {
        if (data.password !== data.confirmPassword) {
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`${api_url}/api/sign-up/doctor`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                    gender: data.gender,
                    specialization: data.specialization,
                    licenseNumber: data.licenseNumber,
                    yearsOfExperience: data.yearsOfExperience,
                    education: data.education,
                    biography: data.biography,
                    availableForEmergency: data.availableForEmergency,
                    userType: "doctor"
                })
            });
            
            const parseRes = await response.json();
            if (parseRes.error) {
                console.log(parseRes.error);
                setLoading(false);
            } else {
                console.log(parseRes);
                setTimeout(() => {
                    setLoading(false);
                    navigate(`/signin`);
                }, 2000);
            }
        } catch (error: any) {
            console.log(error.message);
            setLoading(false);
        }
    };

    const handlePatientGenderChange = (value: string) => {
        setValuePatient("gender", value);
    };

    const handleDoctorGenderChange = (value: string) => {
        setValueDoctor("gender", value);
    };
    
    const handlePatientTermsChange = (checked: boolean) => {
        setValuePatient("termsAccepted", checked);
    };
    
    const handleDoctorTermsChange = (checked: boolean) => {
        setValueDoctor("termsAccepted", checked);
    };
    
    const handleDoctorEmergencyChange = (checked: boolean) => {
        setValueDoctor("availableForEmergency", checked);
    };
    
    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <div className="font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-pink-50 to-white">
            {loading ? (
                <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
                    <p className="mt-4 text-lg font-medium">Creating your account...</p>
                </div>
            ) : (
                <div className="flex h-screen w-full">
                    {!isMobile && (
                        <div
                            className="hidden lg:block w-1/2"
                            style={{
                                backgroundImage: "url(/doctor.jpg)",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        />
                    )}
                    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 py-6 overflow-auto">
                        <Card className="w-full max-w-md shadow-none rounded-lg bg-transparent border-none">
                            <CardHeader>
                                <div className="flex items-center justify-center">
                                    <div className="bg-pink-800 p-3 rounded-full shadow-md">
                                        <User className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <CardTitle className="text-center mt-4 text-2xl font-bold text-gray-800">
                                    Create your Patient Account
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Join Triple TS Medclinic for better healthcare
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                {...register("firstName", { 
                                                    required: "First name is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "First name must be at least 2 characters"
                                                    }
                                                })}
                                                className={errors.firstName ? "border-red-500" : ""}
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                {...register("lastName", { 
                                                    required: "Last name is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "Last name must be at least 2 characters"
                                                    }
                                                })}
                                                className={errors.lastName ? "border-red-500" : ""}
                                            />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                {...register("email", { 
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                className={errors.email ? "border-red-500 pl-10" : "pl-10"}
                                            />
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="(123) 456-7890"
                                                {...register("phone", { 
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[0-9()-\s+]{10,15}$/,
                                                        message: "Invalid phone number"
                                                    }
                                                })}
                                                className={errors.phone ? "border-red-500 pl-10" : "pl-10"}
                                            />
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select onValueChange={handleGenderChange}>
                                            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...register("password", { 
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password must be at least 8 characters"
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                        message: "Password must contain uppercase, lowercase, number and special character"
                                                    }
                                                })}
                                                className={errors.password ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...register("confirmPassword", { 
                                                    required: "Please confirm your password",
                                                    validate: value => 
                                                        value === password || "Passwords do not match"
                                                })}
                                                className={errors.confirmPassword ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="termsAccepted" 
                                            onCheckedChange={handleTermsChange}
                                            required
                                        />
                                        <label
                                            htmlFor="termsAccepted"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I agree to the{" "}
                                            <Link to="/terms" className="text-pink-800 hover:underline">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link to="/privacy" className="text-pink-800 hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-pink-800 hover:bg-pink-700 text-white"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                                    </Button>
                                </form>
                                
                                <Separator className="my-4" />
                                
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Sign up with Google
                                    </Button>
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Sign up with Facebook
                                    </Button>
                                </div>
                                
                                <p className="text-center text-sm mt-4">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="text-pink-800 hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}