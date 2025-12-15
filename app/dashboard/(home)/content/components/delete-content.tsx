"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { FC } from "react"
import Swal from "sweetalert2"
import { deleteContent } from "../lib/action"


interface DeleteContentPageProps {
    id: number
}

const DeleteContent: FC<DeleteContentPageProps> = ({id}) => {
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        })

        if (result.isConfirmed) {
            try {
                await deleteContent(id);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Content has been deleted",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                });

                window.location.reload();
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.message,
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        };

       
    }
    return (
        <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Hapus
        </Button>
    )
}

export default DeleteContent;