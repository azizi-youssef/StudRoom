import { z } from 'zod';

export const landlordFormSchema = z.object({
  fullName: z.string().min(3, 'Veuillez saisir votre nom complet'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  email: z.string().email('Adresse email invalide'),
  city: z.string().min(2, 'Veuillez préciser la ville du logement'),
  neighborhood: z.string().min(2, 'Veuillez préciser le quartier'),
  propertyType: z.string().min(1, 'Veuillez sélectionner le type de bien'),
  roomsCount: z.number().min(1, 'Au moins 1 chambre'),
  surfaceSqm: z.number().optional(),
  expectedRentDh: z.number().min(500, 'Montant de loyer invalide'),
  availabilityDate: z.string().min(1, 'Veuillez indiquer la date de disponibilité'),
  message: z.string().optional(),
});

export type LandlordFormValues = z.infer<typeof landlordFormSchema>;
