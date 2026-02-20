import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getSymptoms(
  userId: string,
  options: { page?: number; limit?: number; startDate?: Date; endDate?: Date; search?: string } = {}
) {
  const { page = 1, limit = 20, startDate, endDate, search } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.SymptomWhereInput = { userId };
  if (startDate || endDate) {
    where.startDatetime = {};
    if (startDate) (where.startDatetime as Prisma.DateTimeFilter).gte = startDate;
    if (endDate) (where.startDatetime as Prisma.DateTimeFilter).lte = endDate;
  }
  if (search) {
    where.OR = [
      { symptomName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [symptoms, total] = await Promise.all([
    prisma.symptom.findMany({
      where,
      orderBy: { startDatetime: 'desc' },
      skip,
      take: limit,
      include: { tags: { include: { tag: true } } },
    }),
    prisma.symptom.count({ where }),
  ]);

  return { symptoms, total, page, limit };
}

export async function getSymptomById(id: string, userId: string) {
  const symptom = await prisma.symptom.findFirst({
    where: { id, userId },
    include: { tags: { include: { tag: true } } },
  });
  if (!symptom) throw new AppError('Symptom not found', 404);
  return symptom;
}

export async function createSymptom(userId: string, data: Prisma.SymptomCreateInput) {
  return prisma.symptom.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
      severity: data.severity || 5,
    },
  });
}

export async function updateSymptom(id: string, userId: string, data: Prisma.SymptomUpdateInput) {
  const symptom = await prisma.symptom.findFirst({ where: { id, userId } });
  if (!symptom) throw new AppError('Symptom not found', 404);
  return prisma.symptom.update({ where: { id }, data });
}

export async function deleteSymptom(id: string, userId: string) {
  const symptom = await prisma.symptom.findFirst({ where: { id, userId } });
  if (!symptom) throw new AppError('Symptom not found', 404);
  return prisma.symptom.delete({ where: { id } });
}

export async function getSymptomTags(userId: string) {
  return prisma.symptomTag.findMany({
    where: {
      symptoms: {
        some: {
          symptom: {
            userId: userId,
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getSymptomAnalytics(userId: string, startDate: Date, endDate: Date) {
  const symptoms = await prisma.symptom.findMany({
    where: {
      userId,
      startDatetime: { gte: startDate, lte: endDate },
    },
  });

  const byName = symptoms.reduce((acc: Record<string, { count: number; totalSeverity: number }>, s) => {
    if (!acc[s.symptomName]) acc[s.symptomName] = { count: 0, totalSeverity: 0 };
    acc[s.symptomName].count++;
    acc[s.symptomName].totalSeverity += s.severity;
    return acc;
  }, {});

  const frequency = Object.entries(byName).map(([name, data]) => ({
    symptom: name,
    count: data.count,
    avgSeverity: (data.totalSeverity / data.count).toFixed(1),
  }));

  return { frequency, total: symptoms.length };
}

export async function getSymptomCalendar(userId: string, startDate: Date, endDate: Date) {
  return prisma.symptom.findMany({
    where: {
      userId,
      startDatetime: { gte: startDate, lte: endDate },
    },
    select: { id: true, symptomName: true, severity: true, startDatetime: true },
  });
}
