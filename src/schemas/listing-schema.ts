import { InferType, array, number, object, string } from 'yup';

export const addListingSchema = object({
  body: object({
    title: string().required(),
    description: string().required(),
    images: array(),
    category: string().required(),
    roomCount: number().min(1),
    bathroomCount: number().min(1),
    guestCount: number().min(1),
    location: array(),
    price: number().min(1),
  }),
});

export type ListingSchema = InferType<typeof addListingSchema>;
