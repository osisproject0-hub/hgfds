'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

export async function submitContactForm(values: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(values);
    
    // Di sini Anda akan menambahkan logika untuk mengirim email atau menyimpan ke database.
    // Untuk saat ini, kita hanya akan mensimulasikan keberhasilan.
    console.log("Contact form submitted:", validatedData);
    
    // Simulasi penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Data yang Anda masukkan tidak valid." };
    }
    return { success: false, error: "Terjadi kesalahan server." };
  }
}
