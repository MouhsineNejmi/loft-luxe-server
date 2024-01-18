import { Listing, User } from "@prisma/client";

import prisma from "../lib/prisma";
import { IListingsParams } from "../utils/types";

export const addListingService = async (data: Listing) => {
  const listing = await prisma.listing.create({
    data,
  });

  return listing;
};

export const listAllListings = async (params: IListingsParams) => {
  let query: any = {};
  const {
    userId,
    category,
    roomCount,
    guestCount,
    bathroomCount,
    location,
    startDate,
    endDate,
  } = params;

  if (userId) {
    query.userId = userId;
  }

  if (category) {
    query.category = category;
  }

  if (roomCount) {
    query.roomCount = {
      gte: +roomCount,
    };
  }

  if (guestCount) {
    query.guestCount = {
      gte: +guestCount,
    };
  }

  if (bathroomCount) {
    query.bathroomCount = {
      gte: +bathroomCount,
    };
  }

  if (location) {
    query.location = location;
  }

  if (startDate && endDate) {
    query.NOT = {
      reservations: {
        some: {
          OR: [
            {
              endDate: { gte: startDate },
              startDate: { lte: startDate },
            },
            {
              startDate: { lte: endDate },
              endDate: { gte: endDate },
            },
          ],
        },
      },
    };
  }

  const listings = await prisma.listing.findMany({
    where: query,
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings;
};

export const listingById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      user: true,
    },
  });

  if (!listing) return null;

  return listing;
};

export const listFavoriteListings = async (currentUser: User) => {
  const favoriteListings = await prisma.listing.findMany({
    where: {
      id: {
        in: [...(currentUser.favoriteIds || [])],
      },
    },
  });

  return favoriteListings;
};

export const removeListing = async (listingId: string) => {
  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
    },
  });

  return listing;
};
