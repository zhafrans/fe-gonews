"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axiosInstance, { setupInterceptor } from "@/lib/axios"
import { ApiResponse } from "@/model/ApiResponse"
import { Content } from "@/model/Content"
import { AlertCircle } from "lucide-react"
import React, { FC, use, useEffect, useState } from "react"

import { Category } from "@/model/Category"
import FormContentPage from "../../components/form-content"

type Params = {
    id: string
}

interface EditContentPageProps {
    params: Promise<Params>
}

const EditContentPage: FC<EditContentPageProps> = ({ params }) => {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams; 

    setupInterceptor()
    
    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<ApiResponse<Content>>(`admin/contents/${id}`);
                setContent(response.data.data);
                setLoading(false);

            } catch (error: any) {
                setError(error.message || "Error fetching data");
            } finally {
                setLoading(false);
            }
        }

        const fetchDataCategory = async() => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<ApiResponse<Category[]>>(`admin/categories`);
                setCategories(response.data.data);
                setLoading(false);

            } catch (error: any) {
                setError(error.message || "Error fetching data");
        }
    }

        fetchData();
        fetchDataCategory();
    }, [resolvedParams.id]);

    if (loading) {
        return <div>Loading ...</div>
    }

    if (error)  {
        return <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        }

    return (    
        <div>
            <div className="flex flex-row items-center justify-between">
                <div className="my-5 text-2xl font-bold">Ubah Kontent</div>
            </div>

            <FormContentPage type="EDIT" categoryList={categories} defaultValues={content} />
        </div>
        
    )

}
export default EditContentPage
