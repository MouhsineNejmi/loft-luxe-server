import { Listing } from '@prisma/client';
import prisma from '../lib/prisma';

export const addListingService = async (data: Listing) => {
  const listing = await prisma.listing.create({
    data,
  });

  return listing;
};

export const listAllListings = async () => {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: 'desc',
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
