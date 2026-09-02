export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-rent-includes',
    question: 'Que comprend le loyer mensuel StudRoom ?',
    answer: 'Chez StudRoom, la transparence est notre priorité. Le loyer comprend le logement entièrement meublé, l’accès à Internet Wi-Fi haute vitesse, l’entretien régulier des parties communes, ainsi que l’assistance et la prise en charge technique StudRoom en cas de problème dans le logement.',
  },
  {
    id: 'faq-furnished',
    question: 'Les logements sont-ils réellement 100% meublés ?',
    answer: 'Oui ! Chaque appartement et studio StudRoom est livré prêt à vivre : lit meublé avec matelas confortable, bureau de travail individuel avec chaise ergonomique, armoire de rangement, cuisine complète (frigo, plaques, ustensiles), machine à laver et sanitaires propres.',
  },
  {
    id: 'faq-visit',
    question: 'Comment puis-je visiter un logement StudRoom ?',
    answer: 'Vous pouvez soit planifier une visite physique sur place à Selouane avec un membre de notre équipe, soit demander une visite virtuelle en vidéo HD guidée directement par WhatsApp si vous êtes actuellement dans une autre ville.',
  },
  {
    id: 'faq-lease-duration',
    question: 'Quelle est la durée minimale du contrat de location ?',
    answer: 'Nos contrats sont adaptés au calendrier universitaire morocain : nous proposons des baux de 10 mois (année académique complète), des baux de 12 mois ou des durées semestrielles selon les disponibilités.',
  },
  {
    id: 'faq-booking-process',
    question: 'Comment fonctionne le processus de réservation ?',
    answer: '1. Vous choisissez votre logement et envoyez votre demande sur notre site. 2. Notre équipe vous recontacte en moins de 24h pour valider vos dates et répondre à vos questions. 3. Vous signez votre contrat et réservez votre chambre. 4. Le jour J, vous récupérez vos clés et vous vous installez !',
  },
  {
    id: 'faq-required-docs',
    question: 'Quels documents sont nécessaires pour louer avec StudRoom ?',
    answer: 'La procédure est très simplifiée : une copie de votre CIN (ou Passeport pour étudiants internationaux), votre attestation d’inscription universitaire ou carte d’étudiant, et les coordonnées d’un garant (parent ou tuteur).',
  },
];
