import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getTrackers(userId: string) {
  return prisma.customTracker.findMany({
    where: { userId, isActive: true },
    include: { logs: { take: 30, orderBy: { logDate: 'desc' } } },
  });
}

export async function createTracker(userId: string, data: Prisma.CustomTrackerCreateInput) {
  return prisma.customTracker.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export async function updateTracker(
  id: string,
  userId: string,
  data: Prisma.CustomTrackerUpdateInput
) {
  const t = await prisma.customTracker.findFirst({ where: { id, userId } });
  if (!t) throw new AppError('Tracker not found', 404);
  return prisma.customTracker.update({ where: { id }, data });
}

export async function deleteTracker(id: string, userId: string) {
  const t = await prisma.customTracker.findFirst({ where: { id, userId } });
  if (!t) throw new AppError('Tracker not found', 404);
  return prisma.customTracker.delete({ where: { id } });
}

export async function getTrackerLogs(trackerId: string, userId: string) {
  const t = await prisma.customTracker.findFirst({ where: { id: trackerId, userId } });
  if (!t) throw new AppError('Tracker not found', 404);
  return prisma.customTrackerLog.findMany({
    where: { trackerId },
    orderBy: { logDate: 'desc' },
  });
}

export async function createTrackerLog(
  trackerId: string,
  userId: string,
  data: { logDate: Date; value: string; notes?: string }
) {
  const t = await prisma.customTracker.findFirst({ where: { id: trackerId, userId } });
  if (!t) throw new AppError('Tracker not found', 404);
  return prisma.customTrackerLog.create({
    data: { trackerId, ...data },
  });
}

export async function updateTrackerLog(
  logId: string,
  userId: string,
  data: Prisma.CustomTrackerLogUpdateInput
) {
  const log = await prisma.customTrackerLog.findFirst({
    where: { id: logId },
    include: { tracker: true },
  });
  if (!log || log.tracker.userId !== userId) throw new AppError('Log not found', 404);
  return prisma.customTrackerLog.update({ where: { id: logId }, data });
}

export async function deleteTrackerLog(logId: string, userId: string) {
  const log = await prisma.customTrackerLog.findFirst({
    where: { id: logId },
    include: { tracker: true },
  });
  if (!log || log.tracker.userId !== userId) throw new AppError('Log not found', 404);
  return prisma.customTrackerLog.delete({ where: { id: logId } });
}
