import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      bloodType: true,
      height: true,
      weight: true,
      profilePictureUrl: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateProfile(userId: string, data: Prisma.UserUpdateInput) {
  const updateData: Prisma.UserUpdateInput = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName ?? null;
  if (data.lastName !== undefined) updateData.lastName = data.lastName ?? null;
  if (data.gender !== undefined) updateData.gender = data.gender ?? null;
  if (data.bloodType !== undefined) updateData.bloodType = data.bloodType ?? null;

  if (data.dateOfBirth !== undefined) {
    updateData.dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth as string | Date)
      : null;
  }
  if (data.height !== undefined) {
    updateData.height = data.height != null && data.height !== '' ? data.height : null;
  }
  if (data.weight !== undefined) {
    updateData.weight = data.weight != null && data.weight !== '' ? data.weight : null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      bloodType: true,
      height: true,
      weight: true,
      profilePictureUrl: true,
    },
  });
  return user;
}

export async function getEmergencyContacts(userId: string) {
  return prisma.emergencyContact.findMany({ where: { userId } });
}

export async function addEmergencyContact(userId: string, data: Prisma.EmergencyContactCreateInput) {
  return prisma.emergencyContact.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export async function updateEmergencyContact(
  id: string,
  userId: string,
  data: Prisma.EmergencyContactUpdateInput
) {
  const contact = await prisma.emergencyContact.findFirst({ where: { id, userId } });
  if (!contact) throw new AppError('Contact not found', 404);
  return prisma.emergencyContact.update({ where: { id }, data });
}

export async function deleteEmergencyContact(id: string, userId: string) {
  const contact = await prisma.emergencyContact.findFirst({ where: { id, userId } });
  if (!contact) throw new AppError('Contact not found', 404);
  return prisma.emergencyContact.delete({ where: { id } });
}
