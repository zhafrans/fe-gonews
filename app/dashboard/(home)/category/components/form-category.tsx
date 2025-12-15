"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, editCategory } from "@/lib/action";
import { setupInterceptor } from "@/lib/axios";
import { categoryFormSchema } from "@/lib/validation";
import { Category } from "@/model/Category";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";
import SubmitButtonForm from "../../components/submit-button";


interface FormCategoryProps {
    type?: "ADD" | "EDIT";
    defaultValues?: Category | null;
}


const FormCategoryPage: FC<FormCategoryProps> = ({type, defaultValues}) => {
    setupInterceptor();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [error, setError] = useState<string[]>([]);

    useEffect(() => {
        if (type == "EDIT" && defaultValues) {
            setTitle(defaultValues.title);
        }
    }, [defaultValues, type]);

    const handleCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setError([]);

        try {
            const validation = categoryFormSchema.safeParse({
                title,
            })

            if (!validation.success) {
                const errorMessage = validation.error.issues.map((issue) => issue.message);
                setError(errorMessage);
                return;
            }

            if (type == "ADD") {
                await createCategory({
                    title,
                })
                Swal.fire({
                icon: "success",
                title: "Success",
                text: "Category has been created",
                toast: true,
                showConfirmButton: false,
                timer: 1500
            });
            router.push("/dashboard/category");
                
            } else {
                if (defaultValues?.id) {
                    await editCategory({
                        title,
                    }, defaultValues.id)
                    Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Category has been updated",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push("/dashboard/category");
                } else {
                    Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Category not found",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                })

             
            }
        }

            
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

    return (
        <form onSubmit={handleCategory}>
            {error.length > 0 && (
                <div className="text-red-500">
                    {error?.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">
                    Judul
                </Label>
                <Input placeholder="Masukkan Judul" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <SubmitButtonForm/>
        </form>
    )
}

export default FormCategoryPage;