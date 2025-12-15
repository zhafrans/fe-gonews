"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { createContent, editContent } from "@/lib/action";
import { setupInterceptor } from "@/lib/axios";

import { Content } from "@/model/Content";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";
import SubmitButtonForm from "../../components/submit-button";
import { Category } from "@/model/Category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentFormSchema } from "../lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { createContent, editContent, uploadImage } from "../lib/action";


interface FormContentProps {
    type?: "ADD" | "EDIT";
    defaultValues?: Content | null
    categoryList: Category[]
}


const FormContentPage: FC<FormContentProps> = ({type, defaultValues, categoryList}) => {
    setupInterceptor();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [excerpt, setExcerpt] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(defaultValues?defaultValues.category_id.toString() : '');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState(defaultValues?defaultValues.status : '');
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(defaultValues?defaultValues.image : '');
    const [error, setError] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setImage(file);
        }
    }

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
    }

    const handleStatusChange = (value: string) => {
        setStatus(value);
    }

    const statusList = [
        { value: "PUBLISHED", label: "Publish" },
        { value: "DRAFT", label: "Draft" },
    ];

    useEffect(() => {
        if (categoryList) {
            setCategories(categoryList);
        }
    }, [categoryList]);

    useEffect(() => {
        if (categoryList) {
            setCategories(categoryList);
        }
    }, [categoryList]);

    useEffect(() => {
        if (type === 'EDIT' && defaultValues) {
            setTitle(defaultValues.title);
            setExcerpt(defaultValues.excerpt);
            setDescription(defaultValues.description);
            setCategoryId(defaultValues.category_id.toString());
            setTags(defaultValues.tags.toString());
            setStatus(defaultValues.status);
            setPreviewImage(defaultValues.image);
        }
    }, [type, defaultValues]);

    const handleContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError([]);

        try {
            const validation = contentFormSchema.safeParse({
                title,
                categoryId,
                description,
                excerpt
            })

            if (!validation.success) {
                const errorMessage = validation.error.issues.map((issue) => issue.message);
                setError(errorMessage);
                return;
            }

            if (type == "ADD") {
                if (!image) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Image is required",
                        toast: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }

                setIsUploading(true);

                const imageUrl = await uploadImage(image)

                await createContent({
                    title: title,
                    description: description,
                    excerpt: excerpt,
                    image: imageUrl.data.urlImage,
                    category_id: Number(categoryId),
                    tags: tags,
                    status: status,
                })
                Swal.fire({
                icon: "success",
                title: "Success",
                text: "Content has been created",
                toast: true,
                showConfirmButton: false,
                timer: 1500
            });
            router.push("/dashboard/category");
                
            } 

            let imageUrl;
            if (!image) {
                imageUrl = previewImage;
            } else {
                setIsUploading(true);
                imageUrl = await uploadImage(image);
            }

            if (defaultValues?.id) {
                await editContent({
                    title: title,
                    description: description,
                    excerpt: excerpt,
                    image: imageUrl.data? imageUrl.data.urlImage : imageUrl,
                    category_id: Number(categoryId),
                    tags: tags,
                    status: status,
                }, defaultValues.id)

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Content has been updated",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push("/dashboard/content");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "ID kategori wajib diisi",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                });

                window.location.reload();
            }
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                toast: true,
                showConfirmButton: false,
                timer: 1500
            });

            setError(error instanceof Error ? [error.message] : ["Something went wrong"])
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <form onSubmit={handleContent}>
            {error.length > 0 && (
                <div className="text-red-500">
                    {error?.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="title">
                        Pilih Kategori
                    </Label>
                    <Select name="categoryId" value={categoryId} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="categoryId">
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">
                    Judul
                </Label>
                <Input placeholder="Masukkan Judul" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="kutipan">
                        Kutipan
                    </Label>
                    <Input placeholder="Masukkan Kutipan" name="excerpt" id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">
                    Tags
                </Label>
                <Input placeholder="Gunakan (,) untuk pemisah.." name="tags" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="description">
                        Deskripsi
                    </Label>
                    <Textarea placeholder="Masukkan Deskripsi" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">
                    Tags
                </Label>
                <Input placeholder="Gunakan (,) untuk pemisah.." name="tags" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="image">
                        Gambar
                    </Label>
                    <Input type="file" name="image"
                    onChange={handleImageChange} id="image" accept="image/*"/>
                </div>

                <div className="space-y-2">
                <Label htmlFor="tags">
                    Pilih status
                </Label>
                <Select name="status" value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusList.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="previewImage">
                        Preview Image
                    </Label>
                    {previewImage && (
                        <img src={previewImage} alt="Preview Image" className="h-[200px] w-[200px]" />
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-12">
            <SubmitButtonForm/>
            </div>

        </form>
    )
}

export default FormContentPage;