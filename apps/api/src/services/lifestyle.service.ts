import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getLifestyleLogs(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return prisma.lifestyleLog.findMany({
    where: {
      userId,
      logDate: { gte: startDate, lte: endDate },
    },
    orderBy: { logDate: 'desc' },
  });
}

export async function getLogByDate(userId: string, date: Date) {
  return prisma.lifestyleLog.findFirst({
    where: { userId, logDate: date },
  });
}

export async function createLifestyleLog(userId: string, data: Prisma.LifestyleLogCreateInput) {
  return prisma.lifestyleLog.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export async function updateLifestyleLog(
  id: string,
  userId: string,
  data: Prisma.LifestyleLogUpdateInput
) {
  const log = await prisma.lifestyleLog.findFirst({ where: { id, userId } });
  if (!log) throw new AppError('Log not found', 404);
  return prisma.lifestyleLog.update({ where: { id }, data });
}

export async function deleteLifestyleLog(id: string, userId: string) {
  const log = await prisma.lifestyleLog.findFirst({ where: { id, userId } });
  if (!log) throw new AppError('Log not found', 404);
  return prisma.lifestyleLog.delete({ where: { id } });
}

export async function getLifestyleAnalytics(userId: string, days: number = 30) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const logs = await prisma.lifestyleLog.findMany({
    where: { userId, logDate: { gte: start } },
    orderBy: { logDate: 'asc' },
  });

  const avgSleep = logs.filter((l) => l.sleepHours).reduce((a, l) => a + Number(l.sleepHours!), 0) / (logs.filter((l) => l.sleepHours).length || 1);
  const avgMood = logs.filter((l) => l.moodRating).reduce((a, l) => a + (l.moodRating || 0), 0) / (logs.filter((l) => l.moodRating).length || 1);
  const avgEnergy = logs.filter((l) => l.energyLevel).reduce((a, l) => a + (l.energyLevel || 0), 0) / (logs.filter((l) => l.energyLevel).length || 1);

  return {
    avgSleep: avgSleep.toFixed(1),
    avgMood: avgMood.toFixed(1),
    avgEnergy: avgEnergy.toFixed(1),
    totalLogs: logs.length,
    sleepData: logs.filter((l) => l.sleepHours).map((l) => ({ date: l.logDate, hours: Number(l.sleepHours) })),
    moodData: logs.filter((l) => l.moodRating).map((l) => ({ date: l.logDate, rating: l.moodRating })),
  };
}
