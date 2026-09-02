import { z } from 'zod';

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(10, 'Numéro de téléphone marocain invalide (+212 / 06 / 07)'),
  university: z.string().min(2, 'Veuillez indiquer votre université ou école'),
  studyLevel: z.string().min(1, "Veuillez sélectionner votre niveau d'étude"),
  desiredArrivalDate: z.string().min(1, "Veuillez indiquer la date d'arrivée souhaitée"),
  durationMonths: z.number().min(1, 'Durée minimale de 1 mois'),
  propertySlug: z.string().optional(),
  roomId: z.string().optional(),
  roomName: z.string().optional(),
  message: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
