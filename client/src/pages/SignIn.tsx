import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import useIsMobile from "@/hooks/useIsMobile";
import { useState } from "react";
import { useAppContext } from "@/context";
import { toast } from "sonner";

type FormValues = {
    email: string;
    password: string;
};

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isMobile=useIsMobile()
    const { api_url }=useAppContext()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const onSubmit = async(data: FormValues) => {
        try{
            setLoading(true);
            const response=await fetch(`${api_url}/api/signin`,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:data.email,
                    password:data.password
                })
            })
            const parseRes=await response.json()
            if(parseRes.error){
                console.log(parseRes.error)
                setLoading(false);
                toast(`Something went wrong!`, {
                    description: `${parseRes.error}`,
                    action: {
                        label: "Retry",
                        onClick: () => onSubmit(data)
                    },
                })
            }else{
                const authData={
                    email:parseRes.email,
                    token:parseRes.token,
                    user_id:parseRes.user_id
                }
                localStorage.setItem('authData',JSON.stringify(authData))
                window.location.href=(`/dashboard`);
            }
        }catch(error:any){
            console.log(error.message)
            setLoading(false);
            toast(`Something went wrong!`, {
                description: `${error.message}`,
                action: {
                    label: "Retry",
                    onClick: () => onSubmit(data)
                },
            })
        }
    };

    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
            {loading ? (
                <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white ">
                    <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
                    <p className="mt-4 text-lg font-medium">Verifying credentials...</p>
                </div>
            ) : (
                <div className="flex h-screen w-full">
                    {!isMobile&&(<img
                        src="/doctor.jpg"
                        className="hidden lg:block w-4/7 object-cover"
                        // style={{
                        //     backgroundImage: "url(/doctor.jpg)",
                        //     backgroundRepeat: "no-repeat",
                        //     backgroundSize: "cover",
                        //     backgroundPosition: "center"
                        // }}
                    />)}
                    <div className="flex flex-col py-10 w-full lg:w-3/7 sm:px-4">
                        <div className="flex w-full items-center px-4">
                            {/* <Button title={"Return to Landing page"} className="ml-auto bg-white hover:bg-gray-50 rounded-[100px] h-[40px] w-[40px] shadow-md">
                                <X width={25} height={25} className="text-red-500 cursor-pointer" onClick={()=>navigate("/")}/>
                            </Button> */}
                            <X width={25} height={25} className="ml-auto text-red-500 cursor-pointer" onClick={()=>navigate("/")}/>
                        </div>
                        <div className="flex flex-col flex-grow justify-center items-center w-full">
                            <Card className="w-full shadow-none rounded-none bg-transparent border-none">
                                <CardHeader>
                                    <div className="flex items-center justify-center">
                                        <div className="bg-pink-800 p-3 rounded-full shadow-md">
                                            <Lock className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-center mt-4 text-2xl font-bold text-gray-800">
                                        Sign in
                                    </CardTitle>
                                    <CardDescription className="text-center">Welcome to Triple TS Mediclinic for better healthcare</CardDescription>
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
                                                    minLength={8}
                                                    maxLength={24}
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <Checkbox id="remember" />
                                                <Label htmlFor="remember">Remember me</Label>
                                            </div>
                                            <Link to="/forgot-password" className="text-sm text-pink-800 hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Button type="submit" className="w-full bg-pink-800 hover:bg-pink-700">
                                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                                        </Button>
                                    </form>
                                    
                                    <p className="text-center text-xs mt-2">
                                        By continuing, you agree to our{" "}
                                        <span className="text-pink-800">Terms of Service</span> and{" "}
                                        <span className="text-pink-800">Privacy Policy</span>.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
