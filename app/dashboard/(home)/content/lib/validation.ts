import { z } from "zod";

export const contentFormSchema = z.object({
    title: z.string().nonempty("Judul harus diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
    excerpt: z.string().nonempty("Kutipan harus diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi harus diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
    categoryId: z.string().nonempty("Kategori harus diisi").min(1, "Minimal 1 karakter").max(255, "Maksimal 255 karakter"),
})