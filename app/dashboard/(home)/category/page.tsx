"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import axiosInstance, { setupInterceptor } from "@/lib/axios"
import { ApiResponse } from "@/model/ApiResponse"
import { Category } from "@/model/Category"
import { AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { columns } from "./components/columns-table"

export default function CategoryPage() {
    setupInterceptor();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axiosInstance.get<ApiResponse<Category[]>>("admin/categories");
                setCategories(response.data.data);
                setLoading(false);

            } catch (error: any) {
                setError(error.message || "Error fetching data");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

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
        <>
        <div className="flex flex-row items-center justify-between">
            <h1 className="my-5 text-2xl font-bold">Kategori</h1>
            <Button asChild>
                <Link href={"/dashboard/category/create"}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Data
                </Link>
            </Button>
        </div>
        <DataTable columns={columns} data={categories} />
        </>
    )
}