import { z } from 'zod'

export const contactFormSchema = z.object({
  studentName: z.string().min(1),
  studentEmail: z.string().email(),
  message: z.string().min(10),
})
