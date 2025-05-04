import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import useIsMobile from "@/hooks/useIsMobile";

type FormValues = {
    email: string;
    password: string;
};

export default function SignUp() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const isMobile=useIsMobile()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        setLoading(true);
        console.log(data);
        setTimeout(() => {
            setLoading(false);
            navigate(`/dashboard`);
        }, 3000);
    };

    return (
        <div className="font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-green-50 to-white ">
            {loading ? (
                <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin w-12 h-12 text-green-500" />
                    <p className="mt-4 text-lg font-medium">Get well soon!</p>
                </div>
            ) : (
                <div className="flex h-screen w-full">
                    {!isMobile&&(<div
                        className="hidden lg:block w-4/7"
                        style={{
                            backgroundImage: "url(/doctor.jpg)",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        {/* <Link to={"/"} className="text-green-800 text-2xl font-semibold mt-8">Triple TS Medclinic</Link> */}
                    </div>)}
                    <div className="flex flex-col justify-center items-center w-full lg:w-3/7 sm:px-4">
                        <Card className="w-full shadow-none rounded-none bg-transparent border-none ">
                            <CardHeader>
                                <div className="flex items-center justify-center">
                                    <div className="bg-green-800 p-3 rounded-full shadow-md">
                                        <Lock className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <CardTitle className="text-center mt-4 text-2xl font-bold text-gray-800">
                                    Create an Account
                                </CardTitle>
                                <CardDescription className="text-center">Welcome to Triple TS Medclinic</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="test@test.com"
                                            {...register("email", { required: "Email is required" })}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.email.message}
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
                                                {...register("password", { required: "Password is required" })}
                                                className={errors.password ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-green-800 hover:bg-green-800">
                                        {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                                    </Button>
                                </form>
                                <Separator className="my-4" />
                                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>
                                <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Continue with Facebook
                                </Button>
                                <p className="text-center text-sm mt-4">
                                    Don't have an account?{" "}
                                    <Link to="/signin" className="text-blue-500">
                                        Sign In
                                    </Link>
                                </p>
                                <p className="text-center text-xs mt-2">
                                    By continuing, you agree to our{" "}
                                    <span className="text-green-800">Terms of Service</span> and{" "}
                                    <span className="text-green-800">Privacy Policy</span>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
