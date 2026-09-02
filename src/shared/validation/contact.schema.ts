import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet est requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  subject: z.string().min(3, 'Veuillez préciser le sujet de votre message'),
  message: z.string().min(10, 'Votre message doit comporter au moins 10 caractères'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
