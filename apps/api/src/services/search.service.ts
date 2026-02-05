import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function globalSearch(
  userId: string,
  query: string,
  filters?: { category?: string; startDate?: Date; endDate?: Date }
) {
  const q = query.trim().toLowerCase();
  if (!q) return { symptoms: [], medications: [], visits: [], lifestyle: [] };

  const whereBase = { userId };
  const dateFilter = filters?.startDate && filters?.endDate
    ? { gte: filters.startDate, lte: filters.endDate }
    : undefined;

  const [symptoms, medications, visits] = await Promise.all([
    prisma.symptom.findMany({
      where: {
        ...whereBase,
        OR: [
          { symptomName: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { notes: { contains: q, mode: 'insensitive' } },
          { triggers: { contains: q, mode: 'insensitive' } },
        ],
        ...(dateFilter && { startDatetime: dateFilter }),
      },
      take: 20,
      orderBy: { startDatetime: 'desc' },
    }),
    prisma.medication.findMany({
      where: {
        ...whereBase,
        OR: [
          { medicationName: { contains: q, mode: 'insensitive' } },
          { purpose: { contains: q, mode: 'insensitive' } },
          { notes: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    }),
    prisma.doctorVisit.findMany({
      where: {
        ...whereBase,
        OR: [
          { doctorName: { contains: q, mode: 'insensitive' } },
          { chiefComplaint: { contains: q, mode: 'insensitive' } },
          { diagnosis: { contains: q, mode: 'insensitive' } },
          { notes: { contains: q, mode: 'insensitive' } },
        ],
        ...(dateFilter && { visitDate: dateFilter }),
      },
      take: 20,
      orderBy: { visitDate: 'desc' },
    }),
  ]);

  return { symptoms, medications, visits };
}

export async function saveSearch(userId: string, name: string, query: string, filters?: object) {
  return prisma.savedSearch.create({
    data: { userId, searchName: name, searchQuery: query, filters: filters as object },
  });
}

export async function getSavedSearches(userId: string) {
  return prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteSavedSearch(id: string, userId: string) {
  return prisma.savedSearch.deleteMany({
    where: { id, userId },
  });
}
