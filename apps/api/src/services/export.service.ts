import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export async function exportFullData(userId: string) {
  const [user, symptoms, medications, visits, lifestyle] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
      },
    }),
    prisma.symptom.findMany({ where: { userId } }),
    prisma.medication.findMany({ where: { userId } }),
    prisma.doctorVisit.findMany({ where: { userId } }),
    prisma.lifestyleLog.findMany({ where: { userId } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user,
    symptoms,
    medications,
    visits,
    lifestyle,
  };
}

export async function generateHealthSummaryPDF(userId: string): Promise<Buffer> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, dateOfBirth: true },
  });
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
    take: 50,
  });
  const medications = await prisma.medication.findMany({
    where: { userId, isActive: true },
  });
  const visits = await prisma.doctorVisit.findMany({
    where: { userId },
    orderBy: { visitDate: 'desc' },
    take: 10,
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Health Summary for Medical Provider', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(
      `Patient: ${user?.firstName || ''} ${user?.lastName || ''} | DOB: ${user?.dateOfBirth || 'N/A'}`
    );
    doc.text(`Generated: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Recent Symptoms', { underline: true });
    doc.fontSize(10);
    symptoms.forEach((s) => {
      doc.text(
        `- ${s.symptomName} (severity ${s.severity}) - ${s.startDatetime.toLocaleDateString()}`
      );
      if (s.notes) doc.text(`  ${s.notes}`).moveDown(0.5);
    });
    doc.moveDown();

    doc.fontSize(14).text('Current Medications', { underline: true });
    doc.fontSize(10);
    medications.forEach((m) => {
      doc.text(`- ${m.medicationName} ${m.dosageAmount} ${m.dosageUnit} - ${m.frequency}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Recent Visits', { underline: true });
    doc.fontSize(10);
    visits.forEach((v) => {
      doc.text(
        `- ${v.visitDate.toLocaleDateString()} - ${v.doctorName} - ${v.diagnosis || v.chiefComplaint || 'N/A'}`
      );
    });

    doc.end();
  });
}

export async function exportSymptomsCSV(userId: string): Promise<string> {
  const symptoms = await prisma.symptom.findMany({
    where: { userId },
    orderBy: { startDatetime: 'desc' },
  });
  const headers = ['Date', 'Symptom', 'Severity', 'Duration', 'Triggers', 'Notes'];
  const rows = symptoms.map((s) => [
    s.startDatetime.toISOString(),
    s.symptomName,
    s.severity,
    s.endDatetime ? `${s.startDatetime} - ${s.endDatetime}` : 'Single',
    s.triggers || '',
    s.notes || '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  return csv;
}
