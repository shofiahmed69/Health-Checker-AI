import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getMedications(userId: string, activeOnly?: boolean) {
  const where: Prisma.MedicationWhereInput = { userId };
  if (activeOnly) where.isActive = true;
  return prisma.medication.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMedicationById(id: string, userId: string) {
  const med = await prisma.medication.findFirst({
    where: { id, userId },
    include: { medicationLogs: { take: 30, orderBy: { scheduledDatetime: 'desc' } } },
  });
  if (!med) throw new AppError('Medication not found', 404);
  return med;
}

export async function createMedication(userId: string, data: Prisma.MedicationCreateInput) {
  return prisma.medication.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export async function updateMedication(id: string, userId: string, data: Prisma.MedicationUpdateInput) {
  const med = await prisma.medication.findFirst({ where: { id, userId } });
  if (!med) throw new AppError('Medication not found', 404);
  return prisma.medication.update({ where: { id }, data });
}

export async function deleteMedication(id: string, userId: string) {
  const med = await prisma.medication.findFirst({ where: { id, userId } });
  if (!med) throw new AppError('Medication not found', 404);
  return prisma.medication.delete({ where: { id } });
}

export async function getMedicationLogs(medicationId: string, userId: string) {
  const med = await prisma.medication.findFirst({ where: { id: medicationId, userId } });
  if (!med) throw new AppError('Medication not found', 404);
  return prisma.medicationLog.findMany({
    where: { medicationId },
    orderBy: { scheduledDatetime: 'desc' },
    take: 100,
  });
}

export async function logMedication(
  medicationId: string,
  userId: string,
  data: { scheduledDatetime: Date; status: string; notes?: string }
) {
  const med = await prisma.medication.findFirst({ where: { id: medicationId, userId } });
  if (!med) throw new AppError('Medication not found', 404);
  return prisma.medicationLog.create({
    data: {
      medicationId,
      scheduledDatetime: data.scheduledDatetime,
      actualDatetime: data.status === 'taken' ? new Date() : undefined,
      status: data.status,
      notes: data.notes,
    },
  });
}

export async function getTodaySchedule(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const medications = await prisma.medication.findMany({
    where: { userId, isActive: true },
    include: {
      medicationLogs: {
        where: {
          scheduledDatetime: { gte: today, lt: tomorrow },
        },
      },
    },
  });

  return medications;
}

export async function getAdherenceAnalytics(userId: string, days: number = 30) {
  const start = new Date();
  start.setDate(start.getDate() - days);

  const logs = await prisma.medicationLog.findMany({
    where: {
      medication: { userId },
      scheduledDatetime: { gte: start },
    },
  });

  const taken = logs.filter((l) => l.status === 'taken').length;
  const total = logs.length;
  const rate = total > 0 ? ((taken / total) * 100).toFixed(1) : '0';

  return { total, taken, missed: total - taken, adherenceRate: parseFloat(rate) };
}
