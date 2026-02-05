import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const doctors = [
  // Dhaka - Bengali names
  { name: 'ডা. মোহাম্মদ রফিকুল ইসলাম', specialty: 'মেডিসিন', city: 'Dhaka', address: 'ধানমন্ডি, রোড ২৭', clinicName: 'রফিক মেডিকেল সেন্টার' },
  { name: 'ডা. ফাতেমা বেগম', specialty: 'গাইনোকলজি', city: 'Dhaka', address: 'গুলশান ২, ব্লক সি', clinicName: 'ফাতেমা ক্লিনিক' },
  { name: 'ডা. আবদুল করিম', specialty: 'কার্ডিওলজি', city: 'Dhaka', address: 'বনানী, রোড ১১', clinicName: 'করিম হাসপাতাল' },
  { name: 'ডা. নাসরিন সুলতানা', specialty: 'পেডিয়াট্রিক্স', city: 'Dhaka', address: 'উত্তরা সেক্টর ৭', clinicName: 'শিশু কেয়ার ক্লিনিক' },
  { name: 'ডা. জাহাঙ্গীর আলম', specialty: 'অর্থোপেডিক্স', city: 'Dhaka', address: 'মিরপুর ১০', clinicName: 'আলম অস্থি হাসপাতাল' },
  { name: 'ডা. শাহানা আক্তার', specialty: 'ডার্মাটোলজি', city: 'Dhaka', address: 'মতিঝিল, বি.আই.টি রোড', clinicName: 'স্কিন কেয়ার সেন্টার' },
  { name: 'ডা. কামরুল হাসান', specialty: 'নাক-কান-গলা', city: 'Dhaka', address: 'ঢাকা মেডিকেল কলেজ রোড', clinicName: 'ইএনটি ক্লিনিক' },
  { name: 'ডা. রুমানা আহমেদ', specialty: 'আই বিভাগ', city: 'Dhaka', address: 'ধানমন্ডি, সাত মসজিদ রোড', clinicName: 'চক্ষু হাসপাতাল' },
  { name: 'ডা. সেলিনা পারভীন', specialty: 'নিউরোলজি', city: 'Dhaka', address: 'বারিধারা, রোড ১২', clinicName: 'নিউরো কেয়ার' },
  { name: 'ডা. ইমরান হোসেন', specialty: 'গ্যাস্ট্রোএন্টারোলজি', city: 'Dhaka', address: 'বশুন্ধরা আবাসিক এলাকা', clinicName: 'ডাইজেস্টিভ কেয়ার' },
  // Chattogram - Bengali names
  { name: 'ডা. মাহমুদুল হক', specialty: 'মেডিসিন', city: 'Chattogram', address: 'আগ্রাবাদ সি.ডি.এ ভবন', clinicName: 'হক মেডিকেল' },
  { name: 'ডা. নাসিমা খাতুন', specialty: 'গাইনোকলজি', city: 'Chattogram', address: 'জিইসি সার্কেল, ওরিয়েন্টাল চেম্বার', clinicName: 'নাসিমা ক্লিনিক' },
  { name: 'ডা. রাশেদুল আলম', specialty: 'কার্ডিওলজি', city: 'Chattogram', address: 'পটিয়া রোড, হালিশহর', clinicName: 'হার্ট কেয়ার সেন্টার' },
  { name: 'ডা. তাহমিনা আক্তার', specialty: 'পেডিয়াট্রিক্স', city: 'Chattogram', address: 'চকবাজার, আন্দরকিল্লা', clinicName: 'শিশু স্বাস্থ্য ক্লিনিক' },
  { name: 'ডা. ফারুক আহমেদ', specialty: 'অর্থোপেডিক্স', city: 'Chattogram', address: 'পতেঙ্গা সড়ক', clinicName: 'অস্থি ও জয়েন্ট কেয়ার' },
  { name: 'ডা. শারমিন জাহান', specialty: 'ডার্মাটোলজি', city: 'Chattogram', address: 'বায়েজিদ বোস্তামী রোড', clinicName: 'স্কিন অ্যান্ড লেজার' },
  { name: 'ডা. আনোয়ার হোসেন', specialty: 'নাক-কান-গলা', city: 'Chattogram', address: 'কদমতলী, চট্টগ্রাম', clinicName: 'ইএনটি স্পেশালিস্ট' },
  { name: 'ডা. লায়লা বেগম', specialty: 'আই বিভাগ', city: 'Chattogram', address: 'হালিশহর হাউজিং', clinicName: 'চক্ষু সেবা কেন্দ্র' },
];

async function main() {
  console.log('Seeding doctors...');
  const result = await prisma.doctor.createMany({
    data: doctors,
    skipDuplicates: false,
  });
  console.log(`Seeded ${result.count} doctors (Dhaka & Chattogram).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
