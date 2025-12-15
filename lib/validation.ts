import { z } from "zod";

export const categoryFormSchema = z.object({
    title: z.string().nonempty("Judul harus diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
})