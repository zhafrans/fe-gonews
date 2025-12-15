"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setupInterceptor } from "@/lib/axios";
import { User } from "@/model/User";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";
import SubmitButtonForm from "../../components/submit-button";
import { updatePassword } from "../lib/action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteCookie } from "cookies-next";


interface FormUserProps {
    defaultValues?: User | null;
}


const FormUserPage: FC<FormUserProps> = ({ defaultValues}) => {
    setupInterceptor();
    const router = useRouter();

    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string[]>([]);

    useEffect(() => {
        if (defaultValues) {
            setName(defaultValues.name);
            setEmail(defaultValues.email);
            setPassword(defaultValues.password);
        }
    }, [defaultValues]);

    const handleUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError([]);

         const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "Password will be changed to new password!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, change it!",
                })

                if (result.isConfirmed) {
                    try {
                        await updatePassword({
                            current_password: password,
                            new_password: newPassword,
                            confirm_password: confirmPassword
                        })
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: "Password has been changed",
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        deleteCookie("access_token");
                        router.push("/login");
                    } catch (error: any) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: error.message,
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500
                        });

                         setError(error instanceof Error ? [error.message] : ["Something went wrong"])
                    }
                }
            }

    return (
        <form onSubmit={handleUser} className="w-[100%] space-y-4">
            {error.length > 0 && (
                <div className="text-red-500">
                    {error?.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nama
                    </Label>
                    <Input name="name" id="name" placeholder="nama.." disabled={true} value={username} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">
                    Email
                </Label>
                <Input name="email" id="email" placeholder="nama.." disabled={true} value={email} />
            </div>

                <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password saat ini
                    </Label>
                    <Input name="password" id="password" placeholder="password.." value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="new_password">
                    Password baru
                </Label>
                <Input name="newPassword" id="newPassword" type="password" placeholder="new password.." value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm_password">
                    Konfirmasi password baru
                </Label>
                <Input name="confirmPassword" id="confirmPassword" type="password" placeholder="confirm password.." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
                <SubmitButtonForm/>
        </form>
    )
}

export default FormUserPage;