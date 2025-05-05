import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Eye, EyeOff, User, Mail, Phone, Stethoscope, User2, Calendar, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner"
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
    const [showPatientPassword, setShowPatientPassword] = React.useState(false);
    const [showPatientConfirmPassword, setShowPatientConfirmPassword] = React.useState(false);
    const [showDoctorPassword, setShowDoctorPassword] = React.useState(false);
    const [showDoctorConfirmPassword, setShowDoctorConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("patient");
    const navigate = useNavigate();
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
                toast(`Something went wrong!`, {
                    description: `${parseRes.error}`,
                    action: {
                      label: "Undo",
                      onClick: () => onSubmitPatient(data)
                    },
                })
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
            toast(`Something went wrong!`, {
                description: `${error.message}`,
                action: {
                  label: "Undo",
                  onClick: () => onSubmitPatient(data)
                },
            })
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
                toast(`Something went wrong!`, {
                    description: `${parseRes.error}`,
                    action: {
                      label: "Undo",
                      onClick: () => onSubmitDoctor(data)
                    },
                })
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
            toast(`Something went wrong!`, {
                description: `${error.message}`,
                action: {
                  label: "Undo",
                  onClick: () => onSubmitDoctor(data)
                },
            })
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
        <div className="font-[family-name:var(--font-geist-sans)]">
            {loading ? (
                <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white">
                    <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
                    <p className="mt-4 text-lg font-medium">Creating your account...</p>
                </div>
            ) : (
                <div className="flex min-h-screen w-full">
                    <div className="flex flex-col justify-center items-center w-full py-6 overflow-auto no-scrollbar">
                        <Card className="w-full max-w-md shadow-none rounded-none bg-none border-none">
                            <CardHeader>
                                <div className="flex items-center justify-center">
                                    <div className="bg-pink-800 p-3 rounded-full shadow-md">
                                        <User className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <CardTitle className="text-center mt-4 text-2xl font-bold text-gray-800">
                                    Create your Account
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Join Triple TS Medclinic for better healthcare
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="patient" value={activeTab} onValueChange={handleTabChange}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="patient" className="flex items-center gap-2">
                                            <User2 className="h-4 w-4" />
                                            Patient
                                        </TabsTrigger>
                                        <TabsTrigger value="doctor" className="flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4" />
                                            Doctor
                                        </TabsTrigger>
                                    </TabsList>
                                    
                                    {/* Patient Registration Form */}
                                    <TabsContent value="patient">
                                        <form onSubmit={handleSubmitPatient(onSubmitPatient)} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="patientFirstName">First Name</Label>
                                                    <Input
                                                        id="patientFirstName"
                                                        placeholder="John"
                                                        {...registerPatient("firstName", { 
                                                            required: "First name is required",
                                                            minLength: {
                                                                value: 2,
                                                                message: "First name must be at least 2 characters"
                                                            }
                                                        })}
                                                        className={patientErrors.firstName ? "border-red-500" : ""}
                                                    />
                                                    {patientErrors.firstName && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {patientErrors.firstName.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="patientLastName">Last Name</Label>
                                                    <Input
                                                        id="patientLastName"
                                                        placeholder="Doe"
                                                        {...registerPatient("lastName", { 
                                                            required: "Last name is required",
                                                            minLength: {
                                                                value: 2,
                                                                message: "Last name must be at least 2 characters"
                                                            }
                                                        })}
                                                        className={patientErrors.lastName ? "border-red-500" : ""}
                                                    />
                                                    {patientErrors.lastName && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {patientErrors.lastName.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientEmail">Email Address</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="patientEmail"
                                                        type="email"
                                                        placeholder="john.doe@example.com"
                                                        {...registerPatient("email", { 
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: "Invalid email address"
                                                            }
                                                        })}
                                                        className={patientErrors.email ? "border-red-500 pl-10" : "pl-10"}
                                                    />
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                </div>
                                                {patientErrors.email && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.email.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientPhone">Phone Number</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="patientPhone"
                                                        type="tel"
                                                        placeholder="254745678990"
                                                        {...registerPatient("phone", { 
                                                            required: "Phone number is required",
                                                            pattern: {
                                                                value: /^(?:254|0)?7\d{8}$/,
                                                                message: "Invalid phone number. Use format 254703733390 or 0703733390"
                                                            }
                                                        })}
                                                        className={patientErrors.phone ? "border-red-500 pl-10" : "pl-10"}
                                                    />
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                </div>
                                                {patientErrors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.phone.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="patientGender">Gender</Label>
                                                    <Select onValueChange={handlePatientGenderChange}>
                                                        <SelectTrigger className={patientErrors.gender ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {patientErrors.gender && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {patientErrors.gender.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="patientDateOfBirth">Date of Birth</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="patientDateOfBirth"
                                                            type="date"
                                                            {...registerPatient("dateOfBirth", { 
                                                                required: "Date of birth is required" 
                                                            })}
                                                            className={patientErrors.dateOfBirth ? "border-red-500" : ""}
                                                        />
                                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    </div>
                                                    {patientErrors.dateOfBirth && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {patientErrors.dateOfBirth.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientAddress">Address</Label>
                                                <Textarea
                                                    id="patientAddress"
                                                    placeholder="Your full address"
                                                    {...registerPatient("address", { 
                                                        required: "Address is required" 
                                                    })}
                                                    className={patientErrors.address ? "border-red-500" : ""}
                                                />
                                                {patientErrors.address && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.address.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientEmergencyContact">Emergency Contact</Label>
                                                <Input
                                                    id="patientEmergencyContact"
                                                    placeholder="Name and phone number"
                                                    {...registerPatient("emergencyContact", { 
                                                        required: "Emergency contact is required" 
                                                    })}
                                                    className={patientErrors.emergencyContact ? "border-red-500" : ""}
                                                />
                                                {patientErrors.emergencyContact && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.emergencyContact.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientPassword">Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="patientPassword"
                                                        type={showPatientPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...registerPatient("password", { 
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
                                                        className={patientErrors.password ? "border-red-500" : ""}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-3 flex items-center"
                                                        onClick={() => setShowPatientPassword(!showPatientPassword)}
                                                    >
                                                        {showPatientPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                                    </button>
                                                </div>
                                                {patientErrors.password && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.password.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="patientConfirmPassword">Confirm Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="patientConfirmPassword"
                                                        type={showPatientConfirmPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...registerPatient("confirmPassword", { 
                                                            required: "Please confirm your password",
                                                            validate: value => 
                                                                value === patientPassword || "Passwords do not match"
                                                        })}
                                                        className={patientErrors.confirmPassword ? "border-red-500" : ""}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-3 flex items-center"
                                                        onClick={() => setShowPatientConfirmPassword(!showPatientConfirmPassword)}
                                                    >
                                                        {showPatientConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                                    </button>
                                                </div>
                                                {patientErrors.confirmPassword && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {patientErrors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="patientTermsAccepted" 
                                                    onCheckedChange={handlePatientTermsChange}
                                                    required
                                                />
                                                <label
                                                    htmlFor="patientTermsAccepted"
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
                                                {loading ? <Loader2 className="animate-spin" /> : "Create Patient Account"}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                    
                                    {/* Doctor Registration Form */}
                                    <TabsContent value="doctor">
                                        <form onSubmit={handleSubmitDoctor(onSubmitDoctor)} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorFirstName">First Name</Label>
                                                    <Input
                                                        id="doctorFirstName"
                                                        placeholder="John"
                                                        {...registerDoctor("firstName", { 
                                                            required: "First name is required",
                                                            minLength: {
                                                                value: 2,
                                                                message: "First name must be at least 2 characters"
                                                            }
                                                        })}
                                                        className={doctorErrors.firstName ? "border-red-500" : ""}
                                                    />
                                                    {doctorErrors.firstName && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.firstName.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorLastName">Last Name</Label>
                                                    <Input
                                                        id="doctorLastName"
                                                        placeholder="Doe"
                                                        {...registerDoctor("lastName", { 
                                                            required: "Last name is required",
                                                            minLength: {
                                                                value: 2,
                                                                message: "Last name must be at least 2 characters"
                                                            }
                                                        })}
                                                        className={doctorErrors.lastName ? "border-red-500" : ""}
                                                    />
                                                    {doctorErrors.lastName && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.lastName.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorEmail">Email Address</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="doctorEmail"
                                                        type="email"
                                                        placeholder="dr.john.doe@example.com"
                                                        {...registerDoctor("email", { 
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: "Invalid email address"
                                                            }
                                                        })}
                                                        className={doctorErrors.email ? "border-red-500 pl-10" : "pl-10"}
                                                    />
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                </div>
                                                {doctorErrors.email && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.email.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorPhone">Phone Number</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="doctorPhone"
                                                        type="tel"
                                                        placeholder="254703733495"
                                                        {...registerDoctor("phone", { 
                                                            required: "Phone number is required",
                                                            pattern: {
                                                                value: /^(?:254|0)?7\d{8}$/,
                                                                message: "Invalid phone number. Use format 254703733390 or 0703733390"
                                                            }
                                                        })}
                                                        className={doctorErrors.phone ? "border-red-500 pl-10" : "pl-10"}
                                                    />
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                </div>
                                                {doctorErrors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.phone.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorGender">Gender</Label>
                                                    <Select onValueChange={handleDoctorGenderChange}>
                                                        <SelectTrigger className={doctorErrors.gender ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {doctorErrors.gender && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.gender.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorSpecialization">Specialization</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="doctorSpecialization"
                                                            placeholder="e.g., Cardiology"
                                                            {...registerDoctor("specialization", { 
                                                                required: "Specialization is required" 
                                                            })}
                                                            className={doctorErrors.specialization ? "border-red-500 pl-10" : "pl-10"}
                                                        />
                                                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    </div>
                                                    {doctorErrors.specialization && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.specialization.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorLicenseNumber">License Number</Label>
                                                    <Input
                                                        id="doctorLicenseNumber"
                                                        placeholder="e.g., MD123456"
                                                        {...registerDoctor("licenseNumber", { 
                                                            required: "License number is required" 
                                                        })}
                                                        className={doctorErrors.licenseNumber ? "border-red-500" : ""}
                                                    />
                                                    {doctorErrors.licenseNumber && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.licenseNumber.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="doctorYearsOfExperience">Years of Experience</Label>
                                                    <Input
                                                        id="doctorYearsOfExperience"
                                                        type="number"
                                                        placeholder="e.g., 5"
                                                        {...registerDoctor("yearsOfExperience", { 
                                                            required: "Years of experience is required" 
                                                        })}
                                                        className={doctorErrors.yearsOfExperience ? "border-red-500" : ""}
                                                    />
                                                    {doctorErrors.yearsOfExperience && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {doctorErrors.yearsOfExperience.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorEducation">Education</Label>
                                                <div className="relative">
                                                    <Textarea
                                                        id="doctorEducation"
                                                        placeholder="Your educational background"
                                                        {...registerDoctor("education", { 
                                                            required: "Education details are required" 
                                                        })}
                                                        className={doctorErrors.education ? "border-red-500 pl-8" : "pl-8"}
                                                    />
                                                    <GraduationCap className="absolute left-3 top-[11px] h-4 w-4 text-gray-500" />
                                                </div>
                                                {doctorErrors.education && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.education.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorBiography">Professional Biography</Label>
                                                <Textarea
                                                    id="doctorBiography"
                                                    placeholder="A brief description of your professional background"
                                                    {...registerDoctor("biography", { 
                                                        required: "Biography is required" 
                                                    })}
                                                    className={doctorErrors.biography ? "border-red-500" : ""}
                                                />
                                                {doctorErrors.biography && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.biography.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="doctorAvailableForEmergency" 
                                                    onCheckedChange={handleDoctorEmergencyChange}
                                                />
                                                <label
                                                    htmlFor="doctorAvailableForEmergency"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Available for emergency consultations
                                                </label>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorPassword">Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="doctorPassword"
                                                        type={showDoctorPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...registerDoctor("password", { 
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
                                                        className={doctorErrors.password ? "border-red-500" : ""}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-3 flex items-center"
                                                        onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                                                    >
                                                        {showDoctorPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                                    </button>
                                                </div>
                                                {doctorErrors.password && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.password.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="doctorConfirmPassword">Confirm Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="doctorConfirmPassword"
                                                        type={showDoctorConfirmPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...registerDoctor("confirmPassword", { 
                                                            required: "Please confirm your password",
                                                            validate: value => 
                                                                value === doctorPassword || "Passwords do not match"
                                                        })}
                                                        className={doctorErrors.confirmPassword ? "border-red-500" : ""}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-3 flex items-center"
                                                        onClick={() => setShowDoctorConfirmPassword(!showDoctorConfirmPassword)}
                                                    >
                                                        {showDoctorConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                                    </button>
                                                </div>
                                                {doctorErrors.confirmPassword && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {doctorErrors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="doctorTermsAccepted" 
                                                    onCheckedChange={handleDoctorTermsChange}
                                                    required
                                                />
                                                <label
                                                    htmlFor="doctorTermsAccepted"
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
                                                {loading ? <Loader2 className="animate-spin" /> : "Create Doctor Account"}
                                            </Button>

                                        </form>
                                    </TabsContent>
                                </Tabs>
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
)}
