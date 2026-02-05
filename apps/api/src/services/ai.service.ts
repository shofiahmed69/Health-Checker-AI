import { PrismaClient } from '@prisma/client';
import { chatWithOllama, generateWithOllama } from './ollama.service';

const prisma = new PrismaClient();

export async function analyzePatterns(userId: string, dateRange?: { start: Date; end: Date }) {
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 100,
  });
  const meds = await prisma.medication.findMany({
    where: { userId, isActive: true },
  });
  const lifestyle = await prisma.lifestyleLog.findMany({
    where: { userId },
    orderBy: { logDate: 'desc' },
    take: 50,
  });

  const prompt = `Analyze this health data and identify patterns. Respond in natural language with insights.

Symptoms (recent): ${JSON.stringify(symptoms.slice(0, 20).map((s) => ({
    name: s.symptomName,
    severity: s.severity,
    date: s.startDatetime,
    triggers: s.triggers,
  })))}

Medications: ${JSON.stringify(meds.map((m) => ({
    name: m.medicationName,
    dosage: m.dosageAmount,
    frequency: m.frequency,
    startDate: m.startDate,
  })))}

Lifestyle (recent): ${JSON.stringify(lifestyle.slice(0, 15).map((l) => ({
    date: l.logDate,
    sleep: l.sleepHours,
    mood: l.moodRating,
    energy: l.energyLevel,
  })))}

Identify: symptom-medication correlations, symptom-lifestyle correlations, temporal patterns, or trigger patterns. Be concise.`;

  const systemPrompt =
    'You are a health data analyst. Provide insights in plain language. Do not give medical advice.';
  return generateWithOllama(prompt, systemPrompt);
}

export async function generateAppointmentPrep(
  userId: string,
  visitId?: string,
  dateRange?: { start: Date; end: Date }
) {
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 50,
  });
  const meds = await prisma.medication.findMany({
    where: { userId, isActive: true },
  });
  const medLogs = await prisma.medicationLog.findMany({
    where: { medication: { userId } },
    orderBy: { scheduledDatetime: 'desc' },
    take: 100,
  });
  const visits = visitId
    ? await prisma.doctorVisit.findFirst({ where: { id: visitId, userId } })
    : null;

  const taken = medLogs.filter((l) => l.status === 'taken').length;
  const total = medLogs.length;
  const adherence = total > 0 ? ((taken / total) * 100).toFixed(0) : '0';

  const prompt = `Generate an appointment preparation summary for a doctor visit.

Symptoms since last visit: ${JSON.stringify(symptoms.slice(0, 15).map((s) => ({
    name: s.symptomName,
    severity: s.severity,
    date: s.startDatetime,
    duration: s.endDatetime ? 'ongoing' : 'single episode',
    notes: s.notes,
  })))}

Current medications and adherence: ${JSON.stringify(meds.map((m) => ({
    name: m.medicationName,
    dosage: m.dosageAmount,
    frequency: m.frequency,
  })))}. Overall adherence: ${adherence}%

${visits ? `Previous visit context: ${JSON.stringify(visits)}` : ''}

Provide:
1. Symptom summary
2. Medication adherence report
3. Key concerns to discuss (prioritized)
4. Suggested questions to ask the doctor
5. Timeline of significant events`;
  const systemPrompt =
    'You are preparing a patient for a doctor visit. Be professional and concise.';
  return generateWithOllama(prompt, systemPrompt);
}

export async function generateMedicalSummary(
  userId: string,
  options: { dateRange?: { start: Date; end: Date }; format?: string }
) {
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 100,
  });
  const meds = await prisma.medication.findMany({
    where: { userId },
  });
  const visits = await prisma.doctorVisit.findMany({
    where: { userId },
    orderBy: { visitDate: 'desc' },
    take: 20,
  });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, dateOfBirth: true, gender: true, bloodType: true },
  });

  const prompt = `Generate a formal medical summary for healthcare professionals.

Patient (anonymize if requested): ${JSON.stringify(user)}

Chief complaints (chronological): ${JSON.stringify(symptoms.slice(0, 30).map((s) => ({
    symptom: s.symptomName,
    severity: s.severity,
    onset: s.startDatetime,
    duration: s.endDatetime,
    notes: s.notes,
  })))}

Current medications: ${JSON.stringify(meds.filter((m) => m.isActive).map((m) => ({
    name: m.medicationName,
    dosage: m.dosageAmount,
    unit: m.dosageUnit,
    frequency: m.frequency,
    purpose: m.purpose,
  })))}

Previous diagnoses/visits: ${JSON.stringify(visits.slice(0, 10).map((v) => ({
    date: v.visitDate,
    doctor: v.doctorName,
    diagnosis: v.diagnosis,
    chiefComplaint: v.chiefComplaint,
  })))}

Format as a professional medical summary suitable for a doctor to read quickly. Include: Chief Complaints, Symptom History, Current Medications, Relevant History, Patient Concerns.`;

  const systemPrompt =
    'You are generating a medical summary for healthcare providers. Use formal medical language. Do not include medical advice.';
  return generateWithOllama(prompt, systemPrompt);
}

export async function chat(userId: string, question: string) {
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 50,
  });
  const meds = await prisma.medication.findMany({
    where: { userId },
    take: 30,
  });
  const visits = await prisma.doctorVisit.findMany({
    where: { userId },
    orderBy: { visitDate: 'desc' },
    take: 10,
  });
  const lifestyle = await prisma.lifestyleLog.findMany({
    where: { userId },
    orderBy: { logDate: 'desc' },
    take: 30,
  });

  const context = `
User's health data (use only to answer questions about their data):

Symptoms: ${JSON.stringify(symptoms.slice(0, 25).map((s) => ({ name: s.symptomName, severity: s.severity, date: s.startDatetime, notes: s.notes })))}
Medications: ${JSON.stringify(meds.map((m) => ({ name: m.medicationName, dosage: m.dosageAmount, frequency: m.frequency })))}
Doctor visits: ${JSON.stringify(visits.slice(0, 5).map((v) => ({ date: v.visitDate, doctor: v.doctorName, diagnosis: v.diagnosis })))}
Lifestyle: ${JSON.stringify(lifestyle.slice(0, 10).map((l) => ({ date: l.logDate, sleep: l.sleepHours, mood: l.moodRating })))}
`;

  const messages = [
    {
      role: 'system' as const,
      content: `You are a health data assistant. Answer questions based ONLY on the user's health data provided. Be concise. Do not give medical advice. Add a disclaimer: "This is not medical advice. Consult your healthcare provider."`,
    },
    { role: 'user' as const, content: context + '\n\nUser question: ' + question },
  ];

  return chatWithOllama(messages);
}

export async function getSuggestions(userId: string) {
  const medLogs = await prisma.medicationLog.findMany({
    where: { medication: { userId } },
    orderBy: { scheduledDatetime: 'desc' },
    take: 50,
  });
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 20,
  });

  const missed = medLogs.filter((l) => l.status === 'missed').length;
  const severeSymptoms = symptoms.filter((s) => s.severity >= 8);

  const prompt = `Based on this data, suggest 2-4 actionable health tips. Be brief.
Missed medication logs (recent): ${missed}
High-severity symptoms (8+): ${JSON.stringify(severeSymptoms.map((s) => ({ name: s.symptomName, date: s.startDatetime })))}

Suggest: medication reminders, when to see a doctor, lifestyle tips. No medical advice.`;

  return generateWithOllama(prompt, 'You are a health assistant. Give brief, actionable suggestions.');
}

export async function getCachedInsights(userId: string, type?: string) {
  const where: { userId: string; insightType?: string } = { userId };
  if (type) where.insightType = type;
  return prisma.aiInsight.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
