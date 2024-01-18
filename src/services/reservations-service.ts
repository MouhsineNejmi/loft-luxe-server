import { Reservation, User } from "@prisma/client";
import prisma from "../lib/prisma";

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

export const getReservations = async ({ listingId, userId, authorId }: any) => {
  let query: any = {};

  if (listingId) {
    query.listingId = listingId;
  }

  if (userId) {
    query.userId = userId;
  }

  if (authorId) {
    query.listing = {
      listingId: authorId,
    };
  }

  const reservations = await prisma.reservation.findMany({
    where: query,
    include: {
      listing: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reservations;
};

export const deleteReservation = async (
  reservationId: string,
  currentUser: User
) => {
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return reservation;
};
