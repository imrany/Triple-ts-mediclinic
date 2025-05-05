import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Eye, EyeOff, Unlock } from "lucide-react";
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
import { useState } from "react";

type FormValues = {
    email: string;
    password: string;
    code: string;
};

export default function ForgotPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
        <div className="font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-pink-50 to-white ">
            {loading ? (
                <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
                    <p className="mt-4 text-lg font-medium">Get well soon!</p>
                </div>
            ) : (
                <div className="flex h-screen w-full flex-col justify-center items-center ">
                    <div className="w-full lg:w-3/7 sm:px-4">
                        <Card className="w-full shadow-none rounded-none bg-transparent border-none ">
                            <CardHeader>
                                <div className="flex items-center justify-center">
                                    <div className="bg-pink-800 p-3 rounded-full shadow-md">
                                        <Unlock className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <CardTitle className="text-center mt-4 text-2xl font-bold text-gray-800">
                                    Forgot Password
                                </CardTitle>
                                <CardDescription className="text-center">Reset your password, follow the provided steps</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="email">Enter your account email address</Label>
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
                                    {/* <div className="flex flex-col gap-1">
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
                                    </div> */}
                                    
                                    <Button type="submit" className="w-full bg-pink-800 hover:bg-pink-800">
                                        {loading ? <Loader2 className="animate-spin" /> : "Send Code"}
                                    </Button>
                                </form>
                                <p className="text-center text-sm mt-4">
                                    Do you have an account?{" "}
                                    <Link to="/signin" className="text-blue-500">
                                        Sign In
                                    </Link>
                                </p>
                                <p className="text-center text-xs mt-2">
                                    By continuing, you agree to our{" "}
                                    <span className="text-pink-800">Terms of Service</span> and{" "}
                                    <span className="text-pink-800">Privacy Policy</span>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}