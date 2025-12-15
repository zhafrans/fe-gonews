import { z } from "zod";

export const formSchema = z.object({
  email: z.string()
           .nonempty("Email harus diisi")
           .email("Email tidak valid"),

  password: z.string()
             .nonempty("Password harus diisi")
             .min(8, "Password minimal 8 karakter"),
});
