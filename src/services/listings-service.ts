import { Listing } from '@prisma/client';
import prisma from '../lib/prisma';

export const addListingService = async (data: Listing) => {
  const listing = await prisma.listing.create({ data });

  return listing;
};