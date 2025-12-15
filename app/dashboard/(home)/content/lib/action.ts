import axiosInstance from "@/lib/axios";
import { ContentRequest } from "@/model/Content";

export const uploadImage = async (fileUpload: File) => {
    try {
        const formdata = new FormData();
        formdata.append("image", fileUpload);
        
       const response = await axiosInstance.post("/admin/contents/upload-image", formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Upload error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        
        if (error.response?.data) {
            throw new Error(error.response.data.message || "Upload failed");
        }
        throw error;
    }
}

export const createContent = async (contentData: ContentRequest) => {
    try {
        const response = await axiosInstance.post("/admin/contents", contentData);
        return response.data;
    } catch (error: any) {
        console.error("Create content error:", error.response?.data);
        throw error;
    }
}

export const editContent = async (contentData: ContentRequest, id: number) => {
    try {
        const response = await axiosInstance.put(`/admin/contents/${id}`, contentData);
        return response.data;
    } catch (error: any) {
        console.error("Edit content error:", error.response?.data);
        throw error;
    }
}

export const deleteContent = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/contents/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Delete content error:", error.response?.data);
        throw error;
    }
}