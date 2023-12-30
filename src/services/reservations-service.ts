import { Reservation } from '@prisma/client';
import prisma from '../lib/prisma';

export const addReservationService = async (values: Reservation) => {
  const reservation = await prisma.listing.update({
    where: {
      id: values.listingId,
    },
    data: {
      reservations: {
        create: {
          userId: values.userId,
          startDate: values.startDate,
          endDate: values.endDate,
          totalPrice: values.totalPrice,
        },
      },
    },
  });

  return reservation;
};

type GetReservationsParams = {
  listingId?: string;
  userId?: string;
  authordId?: string;
};

export const getReservations = async ({
  listingId,
  userId,
  authordId,
}: GetReservationsParams) => {
  let query: any = {};

  if (listingId) {
    query.listingId = listingId;
  }

  if (userId) {
    query.userId = userId;
  }

  if (authordId) {
    query.listing = {
      listingId: authordId,
    };
  }

  const reservations = await prisma.reservation.findMany({
    where: query,
    include: {
      listing: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reservations;
};
