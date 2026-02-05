import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export async function getPreferences(userId: string) {
  let prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });
  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: { userId },
    });
  }
  return prefs;
}

export async function updatePreferences(
  userId: string,
  data: Prisma.UserPreferencesUpdateInput
) {
  const existing = await prisma.userPreferences.findUnique({
    where: { userId },
  });
  if (!existing) {
    return prisma.userPreferences.create({
      data: {
        userId,
        theme: typeof data.theme === 'string' ? data.theme : undefined,
        language: typeof data.language === 'string' ? data.language : undefined,
        timezone: typeof data.timezone === 'string' ? data.timezone : undefined,
        dateFormat: typeof data.dateFormat === 'string' ? data.dateFormat : undefined,
        timeFormat: typeof data.timeFormat === 'string' ? data.timeFormat : undefined,
        measurementSystem: typeof data.measurementSystem === 'string' ? data.measurementSystem : undefined,
        notificationEnabled: typeof data.notificationEnabled === 'boolean' ? data.notificationEnabled : undefined,
        reminderTime: typeof data.reminderTime === 'string' ? data.reminderTime : undefined,
        weeklySummaryEnabled: typeof data.weeklySummaryEnabled === 'boolean' ? data.weeklySummaryEnabled : undefined,
        dataRetentionDays: typeof data.dataRetentionDays === 'number' ? data.dataRetentionDays : undefined,
      },
    });
  }
  return prisma.userPreferences.update({
    where: { userId },
    data,
  });
}

export async function deleteAccount(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
