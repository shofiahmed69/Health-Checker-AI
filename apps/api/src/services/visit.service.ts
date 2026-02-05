import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getVisits(userId: string, limit = 50) {
  return prisma.doctorVisit.findMany({
    where: { userId },
    orderBy: { visitDate: 'desc' },
    take: limit,
    include: { symptoms: { include: { symptom: true } } },
  });
}

export async function getVisitById(id: string, userId: string) {
  const visit = await prisma.doctorVisit.findFirst({
    where: { id, userId },
    include: { symptoms: { include: { symptom: true } } },
  });
  if (!visit) throw new AppError('Visit not found', 404);
  return visit;
}

export async function createVisit(userId: string, data: Prisma.DoctorVisitCreateInput) {
  return prisma.doctorVisit.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export async function updateVisit(id: string, userId: string, data: Prisma.DoctorVisitUpdateInput) {
  const visit = await prisma.doctorVisit.findFirst({ where: { id, userId } });
  if (!visit) throw new AppError('Visit not found', 404);
  return prisma.doctorVisit.update({ where: { id }, data });
}

export async function deleteVisit(id: string, userId: string) {
  const visit = await prisma.doctorVisit.findFirst({ where: { id, userId } });
  if (!visit) throw new AppError('Visit not found', 404);
  return prisma.doctorVisit.delete({ where: { id } });
}

export async function getUpcomingVisits(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.doctorVisit.findMany({
    where: {
      userId,
      OR: [
        { visitDate: { gte: today } },
        { nextAppointmentDate: { gte: today } },
      ],
    },
    orderBy: { visitDate: 'asc' },
  });
}

export async function linkSymptomsToVisit(
  visitId: string,
  userId: string,
  symptomIds: string[]
) {
  const visit = await prisma.doctorVisit.findFirst({ where: { id: visitId, userId } });
  if (!visit) throw new AppError('Visit not found', 404);

  await prisma.visitSymptom.deleteMany({ where: { visitId } });
  if (symptomIds.length > 0) {
    await prisma.visitSymptom.createMany({
      data: symptomIds.map((symptomId) => ({ visitId, symptomId })),
    });
  }
  return getVisitById(visitId, userId);
}
