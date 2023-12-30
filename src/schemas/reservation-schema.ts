import { InferType, number, object, string } from 'yup';

export const addReservationSchema = object({
  body: object({
    userId: string().required(),
    listingId: string().required(),
    startDate: string(),
    endDate: string(),
    totalPrice: number().required(),
  }),
});

export type ReservationSchema = InferType<typeof addReservationSchema>;
