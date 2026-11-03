const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting i_CarePlus Database Seeding...');

  // Clean existing data in reverse order of foreign keys
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.prescriptionMedicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.hospitalSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 1. Hospital Settings
  await prisma.hospitalSetting.create({
    data: {
      id: 1,
      hospitalName: "i_CarePlus Medical Center",
      tagline: "Your Health, Our Priority.",
      email: "contact@icareplus.com",
      phone: "+1 (800) 422-7375",
      emergencyPhone: "+1 (800) 911-CARE",
      address: "742 Evergreen Healthcare Ave, Medical District, NY 10001",
      workingHours: "24/7 Emergency & Inpatient | OPD: Mon - Sat 8:00 AM - 8:00 PM"
    }
  });

  // Hashes
  const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);
  const patientPasswordHash = bcrypt.hashSync('Patient@123', 10);
  const doctorPasswordHash = bcrypt.hashSync('Doctor@123', 10);

  // 2. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Dr. Alexander Wright",
      email: "admin@icareplus.com",
      password: adminPasswordHash,
      role: "ADMIN",
      phone: "+1 (555) 019-2834",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE"
    }
  });
  console.log('✅ Admin user created:', adminUser.email);

  // 3. Departments (8 Departments)
  const departmentsData = [
    {
      name: "Cardiology",
      code: "CARD",
      description: "Comprehensive cardiovascular diagnostics, invasive & non-invasive cardiology and coronary interventions.",
      headOfDepartment: "Dr. Sarah Mitchell",
      icon: "Heart"
    },
    {
      name: "Neurology",
      code: "NEUR",
      description: "Advanced neurological disorders, brain stroke recovery, epilepsy and spine health management.",
      headOfDepartment: "Dr. Jonathan Reyes",
      icon: "Brain"
    },
    {
      name: "Orthopedics",
      code: "ORTH",
      description: "Joint replacements, sports injuries, fracture trauma care and minimally invasive arthroscopic surgery.",
      headOfDepartment: "Dr. Robert Vance",
      icon: "Bone"
    },
    {
      name: "Pediatrics",
      code: "PED",
      description: "Child health care, neonatology, immunization, growth tracking and pediatric emergency support.",
      headOfDepartment: "Dr. Emily Watson",
      icon: "Baby"
    },
    {
      name: "Dermatology",
      code: "DERM",
      description: "Clinical skin treatments, cosmetic dermatology, allergic reactions, eczema and laser skin care.",
      headOfDepartment: "Dr. Marcus Chen",
      icon: "Sparkles"
    },
    {
      name: "General Medicine",
      code: "GMED",
      description: "Primary family medicine, internal disease screening, preventive health checks and routine illness care.",
      headOfDepartment: "Dr. Linda Gomez",
      icon: "Stethoscope"
    },
    {
      name: "Dentistry",
      code: "DENT",
      description: "Complete dental wellness, root canal therapy, orthodontics, oral hygiene and aesthetic smile corrections.",
      headOfDepartment: "Dr. David Kim",
      icon: "Smile"
    },
    {
      name: "Gynecology",
      code: "GYN",
      description: "Maternal-fetal medicine, prenatal care, women's reproductive health and specialized laparoscopy.",
      headOfDepartment: "Dr. Sophia Patel",
      icon: "Activity"
    }
  ];

  const createdDepartments = {};
  for (const dep of departmentsData) {
    const d = await prisma.department.create({ data: dep });
    createdDepartments[d.code] = d;
  }
  console.log('✅ 8 Departments created.');

  // 4. Doctors (8 Doctors)
  const doctorsData = [
    {
      name: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@icareplus.com",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
      departmentCode: "CARD",
      qualification: "MD, FACC - Harvard Medical School",
      specialization: "Senior Interventional Cardiologist",
      experience: 14,
      consultationFee: 120.00,
      workingDays: "Mon,Tue,Wed,Thu,Fri",
      workingHours: "09:00 AM - 04:00 PM",
      roomNumber: "Room 301, Heart Wing",
      bio: "Board-certified cardiologist with over 14 years specializing in ischemic heart disease and preventive cardiovascular wellness."
    },
    {
      name: "Dr. Jonathan Reyes",
      email: "jonathan.reyes@icareplus.com",
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=200&auto=format&fit=crop&q=80",
      departmentCode: "NEUR",
      qualification: "MD, DM Neurology - Johns Hopkins",
      specialization: "Consultant Neurologist & Neurophysiologist",
      experience: 12,
      consultationFee: 130.00,
      workingDays: "Mon,Wed,Fri",
      workingHours: "10:00 AM - 05:00 PM",
      roomNumber: "Room 408, Neuro Tower",
      bio: "Expertise in managing migraine, neurodegenerative disorders, post-stroke therapy, and advanced EEG/EMG diagnostic interpretations."
    },
    {
      name: "Dr. Robert Vance",
      email: "robert.vance@icareplus.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
      departmentCode: "ORTH",
      qualification: "MS Ortho, MCh Orth - Oxford University",
      specialization: "Orthopedic & Joint Replacement Surgeon",
      experience: 16,
      consultationFee: 110.00,
      workingDays: "Tue,Thu,Sat",
      workingHours: "09:00 AM - 03:00 PM",
      roomNumber: "Room 214, Ortho Clinic",
      bio: "Renowned orthopedic surgeon focused on robotic knee replacements, hip reconstructions, and arthroscopic ligament reconstruction."
    },
    {
      name: "Dr. Emily Watson",
      email: "emily.watson@icareplus.com",
      phone: "+1 (555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1594824813571-638f02614d3f?w=200&auto=format&fit=crop&q=80",
      departmentCode: "PED",
      qualification: "MD Pediatrics, FAAP - Stanford Medicine",
      specialization: "Consultant Pediatrician",
      experience: 9,
      consultationFee: 85.00,
      workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
      workingHours: "08:30 AM - 02:30 PM",
      roomNumber: "Room 105, Child Care Pavilion",
      bio: "Compassionate pediatrician committed to newborn care, childhood milestones, nutritional counseling, and seasonal pediatric infections."
    },
    {
      name: "Dr. Marcus Chen",
      email: "marcus.chen@icareplus.com",
      phone: "+1 (555) 678-9012",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80",
      departmentCode: "DERM",
      qualification: "MD Dermatology, FAAD - Columbia University",
      specialization: "Clinical & Aesthetic Dermatologist",
      experience: 10,
      consultationFee: 95.00,
      workingDays: "Mon,Wed,Fri",
      workingHours: "11:00 AM - 06:00 PM",
      roomNumber: "Room 112, Skin Suite",
      bio: "Specialist in dermatologic surgery, clinical treatment of acne, psoriasis, and cutting-edge non-invasive skin rejuvenation procedures."
    },
    {
      name: "Dr. Linda Gomez",
      email: "linda.gomez@icareplus.com",
      phone: "+1 (555) 789-0123",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
      departmentCode: "GMED",
      qualification: "MBBS, MD Internal Medicine - Mayo Clinic",
      specialization: "Chief Physician & General Practitioner",
      experience: 18,
      consultationFee: 75.00,
      workingDays: "Mon,Tue,Wed,Thu,Fri",
      workingHours: "08:00 AM - 04:00 PM",
      roomNumber: "Room 101, Primary OPD",
      bio: "Comprehensive adult medical care provider with deep background in diabetes management, hypertension, and preventive health screenings."
    },
    {
      name: "Dr. David Kim",
      email: "david.kim@icareplus.com",
      phone: "+1 (555) 890-1234",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80",
      departmentCode: "DENT",
      qualification: "DDS, MS Endodontics - UCLA Dentistry",
      specialization: "Dental Surgeon & Endodontist",
      experience: 11,
      consultationFee: 70.00,
      workingDays: "Tue,Wed,Thu,Sat",
      workingHours: "09:30 AM - 05:30 PM",
      roomNumber: "Dental Wing, Chair 2",
      bio: "Gentle dental practitioner dedicated to painless root canal treatments, aesthetic dental crowns, teeth whitening, and complete oral hygiene."
    },
    {
      name: "Dr. Sophia Patel",
      email: "sophia.patel@icareplus.com",
      phone: "+1 (555) 901-2345",
      avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&auto=format&fit=crop&q=80",
      departmentCode: "GYN",
      qualification: "MS Obstetrics & Gynecology, MRCOG - London",
      specialization: "Obstetrician & Gynecologist",
      experience: 13,
      consultationFee: 100.00,
      workingDays: "Mon,Tue,Thu,Fri",
      workingHours: "09:00 AM - 04:30 PM",
      roomNumber: "Room 205, Women's Wellness",
      bio: "Passionate women's health advocate providing high-risk obstetric support, laparoscopic procedures, fertility guidance, and annual well-woman exams."
    }
  ];

  const createdDoctors = [];
  const defaultSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM"
  ];

  for (const doc of doctorsData) {
    const user = await prisma.user.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: doctorPasswordHash,
        role: "DOCTOR",
        phone: doc.phone,
        avatar: doc.avatar,
        status: "ACTIVE"
      }
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        departmentId: createdDepartments[doc.departmentCode].id,
        qualification: doc.qualification,
        specialization: doc.specialization,
        experience: doc.experience,
        consultationFee: doc.consultationFee,
        workingDays: doc.workingDays,
        workingHours: doc.workingHours,
        roomNumber: doc.roomNumber,
        bio: doc.bio,
        status: "ACTIVE"
      },
      include: { user: true, department: true }
    });

    // Create availability slots
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (const day of days) {
      await prisma.doctorAvailability.create({
        data: {
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          slotDurationMinutes: 30,
          isAvailable: true
        }
      });
    }

    createdDoctors.push(doctor);
  }
  console.log('✅ 8 Doctors created with availability schedules.');

  // 5. Patients (11 Patients - 1 Primary demo patient + 10 additional)
  const patientsData = [
    {
      name: "Marcus Aurelius Miller",
      email: "patient@icareplus.com", // Primary demo patient
      phone: "+1 (555) 111-2233",
      dob: new Date("1988-06-15"),
      gender: "Male",
      bloodGroup: "O+",
      address: "450 Lexington Ave, Apt 14B, New York, NY 10017",
      emergencyContact: "Elena Miller (+1 555-111-9988)",
      medicalHistory: "Mild seasonal asthma, hypertension managed with diet.",
      allergies: "Penicillin"
    },
    {
      name: "Olivia Grace Sterling",
      email: "olivia.sterling@example.com",
      phone: "+1 (555) 222-3344",
      dob: new Date("1992-03-24"),
      gender: "Female",
      bloodGroup: "A+",
      address: "128 Willow Creek Way, Brooklyn, NY 11201",
      emergencyContact: "David Sterling (+1 555-222-7766)",
      medicalHistory: "None noted. Regular annual physical checkups.",
      allergies: "None"
    },
    {
      name: "Ethan James Cooper",
      email: "ethan.cooper@example.com",
      phone: "+1 (555) 333-4455",
      dob: new Date("1979-11-08"),
      gender: "Male",
      bloodGroup: "B+",
      address: "78 Maplewood Dr, Queens, NY 11375",
      emergencyContact: "Claire Cooper (+1 555-333-1122)",
      medicalHistory: "Type 2 Diabetes, controlled under oral Metformin.",
      allergies: "Sulfa drugs"
    },
    {
      name: "Sophia Rose Jenkins",
      email: "sophia.jenkins@example.com",
      phone: "+1 (555) 444-5566",
      dob: new Date("1995-09-12"),
      gender: "Female",
      bloodGroup: "AB+",
      address: "931 Hudson Yards St, New York, NY 10001",
      emergencyContact: "Lucas Jenkins (+1 555-444-9900)",
      medicalHistory: "Chronic migraine headaches, mild anemia.",
      allergies: "Dust, NSAIDs"
    },
    {
      name: "Lucas Alexander Gray",
      email: "lucas.gray@example.com",
      phone: "+1 (555) 555-6677",
      dob: new Date("1984-01-30"),
      gender: "Male",
      bloodGroup: "O-",
      address: "210 Park Avenue South, New York, NY 10003",
      emergencyContact: "Emma Gray (+1 555-555-4433)",
      medicalHistory: "Right ACL reconstruction in 2021, fully healed.",
      allergies: "Latex"
    },
    {
      name: "Ava Charlotte Bennett",
      email: "ava.bennett@example.com",
      phone: "+1 (555) 666-7788",
      dob: new Date("1999-07-19"),
      gender: "Female",
      bloodGroup: "A-",
      address: "64 Ocean Parkway, Brooklyn, NY 11218",
      emergencyContact: "Noah Bennett (+1 555-666-3322)",
      medicalHistory: "Contact dermatitis, allergic rhinitis.",
      allergies: "Nickel, Peanuts"
    },
    {
      name: "Mason Daniel Foster",
      email: "mason.foster@example.com",
      phone: "+1 (555) 777-8899",
      dob: new Date("1968-12-05"),
      gender: "Male",
      bloodGroup: "B-",
      address: "512 Riverdale Ave, Bronx, NY 10471",
      emergencyContact: "Sarah Foster (+1 555-777-5544)",
      medicalHistory: "Mild cardiac arrhythmia, monitored quarterly.",
      allergies: "Aspirin"
    },
    {
      name: "Isabella Marie Vance",
      email: "isabella.vance@example.com",
      phone: "+1 (555) 888-9900",
      dob: new Date("2002-04-14"),
      gender: "Female",
      bloodGroup: "O+",
      address: "142 Columbus Ave, New York, NY 10023",
      emergencyContact: "Arthur Vance (+1 555-888-2211)",
      medicalHistory: "General physical wellness, sports athlete.",
      allergies: "None"
    },
    {
      name: "Benjamin Noah Hayes",
      email: "benjamin.hayes@example.com",
      phone: "+1 (555) 999-0011",
      dob: new Date("1975-08-22"),
      gender: "Male",
      bloodGroup: "AB-",
      address: "88 Staten Island Blvd, Staten Island, NY 10301",
      emergencyContact: "Karen Hayes (+1 555-999-4455)",
      medicalHistory: "High cholesterol, lumbar spine strain.",
      allergies: "Iodine contrast"
    },
    {
      name: "Harper Evelyn Brooks",
      email: "harper.brooks@example.com",
      phone: "+1 (555) 123-9876",
      dob: new Date("1996-10-28"),
      gender: "Female",
      bloodGroup: "A+",
      address: "303 Greenwich St, Tribeca, NY 10013",
      emergencyContact: "Liam Brooks (+1 555-123-5566)",
      medicalHistory: "First trimester pregnancy, prenatal monitoring.",
      allergies: "None"
    },
    {
      name: "Liam Christopher Reed",
      email: "liam.reed@example.com",
      phone: "+1 (555) 234-8765",
      dob: new Date("1989-05-03"),
      gender: "Male",
      bloodGroup: "O+",
      address: "19 West End Ave, New York, NY 10023",
      emergencyContact: "Maya Reed (+1 555-234-3322)",
      medicalHistory: "Routine dental plaque and cleaning.",
      allergies: "None"
    }
  ];

  const createdPatients = [];
  for (const pat of patientsData) {
    const user = await prisma.user.create({
      data: {
        name: pat.name,
        email: pat.email,
        password: patientPasswordHash,
        role: "PATIENT",
        phone: pat.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pat.name)}`,
        status: "ACTIVE"
      }
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        dob: pat.dob,
        gender: pat.gender,
        bloodGroup: pat.bloodGroup,
        address: pat.address,
        emergencyContact: pat.emergencyContact,
        medicalHistory: pat.medicalHistory,
        allergies: pat.allergies
      },
      include: { user: true }
    });

    createdPatients.push(patient);
  }
  console.log('✅ 11 Patients created (including demo patient@icareplus.com).');

  const demoPatient = createdPatients[0]; // Marcus Aurelius Miller

  // 6. Appointments (18 Appointments with realistic dates, statuses, departments)
  const appointmentsSetup = [
    // Demo Patient's appointments
    {
      patient: demoPatient,
      doctor: createdDoctors[0], // Dr. Sarah Mitchell (Cardiology)
      department: createdDepartments["CARD"],
      date: new Date(Date.now() + 86400000 * 2), // 2 days ahead
      timeSlot: "10:30 AM",
      reason: "Follow-up consultation for blood pressure review and routine stress ECG.",
      status: "CONFIRMED"
    },
    {
      patient: demoPatient,
      doctor: createdDoctors[5], // Dr. Linda Gomez (General Medicine)
      department: createdDepartments["GMED"],
      date: new Date(Date.now() - 86400000 * 14), // 14 days ago
      timeSlot: "09:30 AM",
      reason: "Annual full body wellness examination and lipid profile discussion.",
      status: "COMPLETED"
    },
    {
      patient: demoPatient,
      doctor: createdDoctors[6], // Dr. David Kim (Dentistry)
      department: createdDepartments["DENT"],
      date: new Date(Date.now() - 86400000 * 30), // 30 days ago
      timeSlot: "02:00 PM",
      reason: "Routine scaling, dental polish, and tooth sensitivity checkup.",
      status: "COMPLETED"
    },
    {
      patient: demoPatient,
      doctor: createdDoctors[4], // Dr. Marcus Chen (Dermatology)
      department: createdDepartments["DERM"],
      date: new Date(Date.now() + 86400000 * 7), // 7 days ahead
      timeSlot: "11:30 AM",
      reason: "Seasonal dry skin assessment and mole inspection on left shoulder.",
      status: "PENDING"
    },

    // Additional Patient Appointments
    {
      patient: createdPatients[1], // Olivia Sterling
      doctor: createdDoctors[7], // Dr. Sophia Patel (Gynecology)
      department: createdDepartments["GYN"],
      date: new Date(Date.now() + 86400000 * 1), // Tomorrow
      timeSlot: "09:00 AM",
      reason: "Routine annual pelvic wellness exam and hormonal profile check.",
      status: "CONFIRMED"
    },
    {
      patient: createdPatients[2], // Ethan Cooper
      doctor: createdDoctors[5], // Dr. Linda Gomez (General Medicine)
      department: createdDepartments["GMED"],
      date: new Date(Date.now() - 86400000 * 3), // 3 days ago
      timeSlot: "10:00 AM",
      reason: "Quarterly HbA1c glucose monitoring and prescription renewal.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[3], // Sophia Jenkins
      doctor: createdDoctors[1], // Dr. Jonathan Reyes (Neurology)
      department: createdDepartments["NEUR"],
      date: new Date(Date.now() + 86400000 * 3), // 3 days ahead
      timeSlot: "02:30 PM",
      reason: "Recurring migraine headache frequency and sensory light sensitivity.",
      status: "CONFIRMED"
    },
    {
      patient: createdPatients[4], // Lucas Gray
      doctor: createdDoctors[2], // Dr. Robert Vance (Orthopedics)
      department: createdDepartments["ORTH"],
      date: new Date(Date.now() - 86400000 * 6), // 6 days ago
      timeSlot: "11:00 AM",
      reason: "Right knee patellar discomfort after marathon training.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[5], // Ava Bennett
      doctor: createdDoctors[4], // Dr. Marcus Chen (Dermatology)
      department: createdDepartments["DERM"],
      date: new Date(Date.now() + 86400000 * 4), // 4 days ahead
      timeSlot: "03:00 PM",
      reason: "Contact dermatitis rash outbreak on forearm following gardening.",
      status: "PENDING"
    },
    {
      patient: createdPatients[6], // Mason Foster
      doctor: createdDoctors[0], // Dr. Sarah Mitchell (Cardiology)
      department: createdDepartments["CARD"],
      date: new Date(Date.now() - 86400000 * 10), // 10 days ago
      timeSlot: "01:30 PM",
      reason: "Palpitation sensations during evening rest periods.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[7], // Isabella Vance
      doctor: createdDoctors[3], // Dr. Emily Watson (Pediatrics)
      department: createdDepartments["PED"],
      date: new Date(Date.now() + 86400000 * 5), // 5 days ahead
      timeSlot: "10:30 AM",
      reason: "Adolescent sports physical fitness certificate clearance.",
      status: "CONFIRMED"
    },
    {
      patient: createdPatients[8], // Benjamin Hayes
      doctor: createdDoctors[2], // Dr. Robert Vance (Orthopedics)
      department: createdDepartments["ORTH"],
      date: new Date(Date.now() - 86400000 * 1), // Yesterday
      timeSlot: "03:30 PM",
      reason: "Lower lumbar pain after heavy lifting at home.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[9], // Harper Brooks
      doctor: createdDoctors[7], // Dr. Sophia Patel (Gynecology)
      department: createdDepartments["GYN"],
      date: new Date(Date.now() + 86400000 * 2), // 2 days ahead
      timeSlot: "11:00 AM",
      reason: "First trimester obstetric ultrasound and routine blood screening.",
      status: "CONFIRMED"
    },
    {
      patient: createdPatients[10], // Liam Reed
      doctor: createdDoctors[6], // Dr. David Kim (Dentistry)
      department: createdDepartments["DENT"],
      date: new Date(Date.now() - 86400000 * 8), // 8 days ago
      timeSlot: "11:30 AM",
      reason: "Molar pain and gum irritation when chewing solid foods.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[1], // Olivia Sterling
      doctor: createdDoctors[5], // Dr. Linda Gomez (General Medicine)
      department: createdDepartments["GMED"],
      date: new Date(Date.now() - 86400000 * 20),
      timeSlot: "09:00 AM",
      reason: "Mild respiratory flu symptoms with low-grade fever.",
      status: "COMPLETED"
    },
    {
      patient: createdPatients[2], // Ethan Cooper
      doctor: createdDoctors[0], // Dr. Sarah Mitchell (Cardiology)
      department: createdDepartments["CARD"],
      date: new Date(Date.now() + 86400000 * 8),
      timeSlot: "02:00 PM",
      reason: "Cardiovascular risk evaluation and preventive consultation.",
      status: "PENDING"
    },
    {
      patient: createdPatients[3], // Sophia Jenkins
      doctor: createdDoctors[6], // Dr. David Kim
      department: createdDepartments["DENT"],
      date: new Date(Date.now() - 86400000 * 12),
      timeSlot: "04:00 PM",
      reason: "Teeth whitening and dental enamel polish.",
      status: "CANCELLED"
    },
    {
      patient: createdPatients[4], // Lucas Gray
      doctor: createdDoctors[5], // Dr. Linda Gomez
      department: createdDepartments["GMED"],
      date: new Date(Date.now() + 86400000 * 6),
      timeSlot: "10:30 AM",
      reason: "Annual executive health health screening.",
      status: "PENDING"
    }
  ];

  const createdAppointments = [];
  let apptCounter = 1001;
  for (const app of appointmentsSetup) {
    const appt = await prisma.appointment.create({
      data: {
        appointmentNumber: `APT-${apptCounter++}`,
        patientId: app.patient.id,
        doctorId: app.doctor.id,
        departmentId: app.department.id,
        appointmentDate: app.date,
        timeSlot: app.timeSlot,
        reason: app.reason,
        status: app.status,
        notes: app.status === 'COMPLETED' ? 'Consultation completed successfully. Follow-up plan prescribed.' : 'Patient requested standard consultation slot.'
      }
    });
    createdAppointments.push({ ...appt, patient: app.patient, doctor: app.doctor, department: app.department });
  }
  console.log(`✅ ${createdAppointments.length} Appointments created.`);

  // 7. Medical Records (Linked to completed appointments & demo patient)
  const medicalRecordsData = [
    {
      appointment: createdAppointments[1], // Demo Patient + Dr. Linda Gomez (General Medicine)
      diagnosis: "Mild Pre-Hypertension & Vitamin D Insufficiency",
      treatment: "Advised dietary sodium restriction, 30 min daily brisk cardio, and Vitamin D3 supplementation for 8 weeks.",
      symptoms: "Mild afternoon fatigue, occasional morning tension headaches.",
      notes: "Patient is responsive and motivated. Follow-up scheduled with Cardiology in 2 weeks.",
      vitalsJson: JSON.stringify({
        bloodPressure: "132/86 mmHg",
        heartRate: "74 bpm",
        temperature: "98.4 °F",
        weight: "78 kg",
        spo2: "99%"
      }),
      visitDate: new Date(Date.now() - 86400000 * 14)
    },
    {
      appointment: createdAppointments[2], // Demo Patient + Dr. David Kim (Dentistry)
      diagnosis: "Moderate Enamel Hypersensitivity & Gingival Marginitis",
      treatment: "Completed ultrasonic scaling and prophylaxis polishing. Prescribed desensitizing potassium nitrate fluoride paste.",
      symptoms: "Sharp sensitivity to cold beverages on lower premolars.",
      notes: "Oral hygiene is fair. Recommended soft bristle electric toothbrush and daily dental flossing.",
      vitalsJson: JSON.stringify({
        bloodPressure: "124/80 mmHg",
        heartRate: "70 bpm",
        temperature: "98.6 °F",
        weight: "78 kg",
        spo2: "99%"
      }),
      visitDate: new Date(Date.now() - 86400000 * 30)
    },
    {
      appointment: createdAppointments[5], // Ethan Cooper + Dr. Linda Gomez
      diagnosis: "Type 2 Diabetes Mellitus - Stable Control",
      treatment: "Continue Metformin 500mg BD. Reinforced carbohydrate portion control and quarterly HbA1c review.",
      symptoms: "No acute symptoms, occasional dry mouth after long fasting.",
      notes: "Current HbA1c is 6.7%. Excellent glycemic adherence.",
      vitalsJson: JSON.stringify({
        bloodPressure: "128/82 mmHg",
        heartRate: "76 bpm",
        temperature: "98.2 °F",
        weight: "84 kg",
        spo2: "98%"
      }),
      visitDate: new Date(Date.now() - 86400000 * 3)
    },
    {
      appointment: createdAppointments[7], // Lucas Gray + Dr. Robert Vance (Ortho)
      diagnosis: "Patellofemoral Pain Syndrome (Runner's Knee)",
      treatment: "Physiotherapy focused on quadriceps & VMO strengthening, IT-band stretching. Cold ice packs post exercise.",
      symptoms: "Aching pain behind knee cap after 5k runs and descending stairs.",
      notes: "X-ray revealed no fracture or joint space narrowing. No meniscal tears on physical exam.",
      vitalsJson: JSON.stringify({
        bloodPressure: "120/78 mmHg",
        heartRate: "66 bpm",
        temperature: "98.6 °F",
        weight: "74 kg",
        spo2: "100%"
      }),
      visitDate: new Date(Date.now() - 86400000 * 6)
    }
  ];

  let mrCounter = 2001;
  for (const mr of medicalRecordsData) {
    await prisma.medicalRecord.create({
      data: {
        recordNumber: `MED-${mrCounter++}`,
        patientId: mr.appointment.patient.id,
        doctorId: mr.appointment.doctor.id,
        appointmentId: mr.appointment.id,
        visitDate: mr.visitDate,
        diagnosis: mr.diagnosis,
        treatment: mr.treatment,
        symptoms: mr.symptoms,
        notes: mr.notes,
        vitalsJson: mr.vitalsJson
      }
    });
  }
  console.log('✅ Medical Records created.');

  // 8. Prescriptions (Linked to Appointments & Demo patient)
  const prescriptionsData = [
    {
      appointment: createdAppointments[1], // Demo Patient
      diagnosis: "Mild Pre-Hypertension & Vitamin D Insufficiency",
      notes: "Take medications strictly as instructed. Drink at least 2.5L water daily and maintain a low sodium diet.",
      issuedDate: new Date(Date.now() - 86400000 * 14),
      medicines: [
        {
          medicineName: "Vitamin D3 (Cholecalciferol)",
          dosage: "60,000 IU",
          frequency: "Once a week (After Breakfast)",
          duration: "8 Weeks",
          instructions: "Take with milk or meal rich in healthy fats for optimal absorption."
        },
        {
          medicineName: "Telmisartan",
          dosage: "20 mg",
          frequency: "Once daily (Morning)",
          duration: "30 Days",
          instructions: "Monitor resting morning blood pressure."
        },
        {
          medicineName: "Omega-3 Fish Oil Concentrate",
          dosage: "1000 mg",
          frequency: "Once daily (Night)",
          duration: "60 Days",
          instructions: "Support healthy lipid balance."
        }
      ]
    },
    {
      appointment: createdAppointments[2], // Demo Patient
      diagnosis: "Dental Enamel Sensitivity",
      notes: "Avoid direct contact with extremely cold or acidic beverages during the first 10 days.",
      issuedDate: new Date(Date.now() - 86400000 * 30),
      medicines: [
        {
          medicineName: "Sensodyne Rapid Relief Toothpaste",
          dosage: "Pea size",
          frequency: "Twice daily",
          duration: "30 Days",
          instructions: "Gently brush teeth for 2 full minutes, do not rinse vigorously."
        },
        {
          medicineName: "Chlorhexidine Gluconate 0.2% Mouthwash",
          dosage: "10 ml",
          frequency: "Twice daily (After Food)",
          duration: "7 Days",
          instructions: "Swish for 30 seconds and spit out; avoid eating for 30 mins."
        }
      ]
    },
    {
      appointment: createdAppointments[5], // Ethan Cooper
      diagnosis: "Type 2 Diabetes Mellitus Maintenance",
      notes: "Log fasting and post-prandial blood sugar levels in glucometer logbook.",
      issuedDate: new Date(Date.now() - 86400000 * 3),
      medicines: [
        {
          medicineName: "Metformin Hydrochloride Extended Release",
          dosage: "500 mg",
          frequency: "Twice daily (With meals)",
          duration: "90 Days",
          instructions: "Swallow whole with plenty of water."
        },
        {
          medicineName: "Alpha Lipoic Acid + Methylcobalamin",
          dosage: "600 mg",
          frequency: "Once daily (Morning)",
          duration: "30 Days",
          instructions: "Neuroprotective antioxidant support."
        }
      ]
    }
  ];

  let rxCounter = 3001;
  for (const rx of prescriptionsData) {
    const prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber: `RX-${rxCounter++}`,
        patientId: rx.appointment.patient.id,
        doctorId: rx.appointment.doctor.id,
        appointmentId: rx.appointment.id,
        diagnosis: rx.diagnosis,
        notes: rx.notes,
        issuedDate: rx.issuedDate
      }
    });

    for (const med of rx.medicines) {
      await prisma.prescriptionMedicine.create({
        data: {
          prescriptionId: prescription.id,
          medicineName: med.medicineName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions
        }
      });
    }
  }
  console.log('✅ Prescriptions and medicines created.');

  // 9. Invoices & Simulated Payments
  const invoicesData = [
    // Demo Patient's Invoices
    {
      patient: demoPatient,
      appointment: createdAppointments[1], // General Med Completed
      title: "Executive Medical Consultation & Comprehensive Vitals",
      description: "Comprehensive physician evaluation, blood pressure profiling, and lifestyle health review.",
      issueDate: new Date(Date.now() - 86400000 * 14),
      dueDate: new Date(Date.now() - 86400000 * 7),
      totalAmount: 125.00,
      paidAmount: 125.00,
      balance: 0.00,
      status: "PAID",
      paymentMethod: "ONLINE",
      payment: {
        transactionId: "TXN-8839210-ICP",
        amount: 125.00,
        paymentMethod: "ONLINE"
      }
    },
    {
      patient: demoPatient,
      appointment: createdAppointments[2], // Dentistry Completed
      title: "Dental Prophylaxis & Ultrasonic Enamel Scaling",
      description: "Full mouth scaling, stain removal, fluoridation treatment and consultation.",
      issueDate: new Date(Date.now() - 86400000 * 30),
      dueDate: new Date(Date.now() - 86400000 * 20),
      totalAmount: 95.00,
      paidAmount: 95.00,
      balance: 0.00,
      status: "PAID",
      paymentMethod: "CARD",
      payment: {
        transactionId: "TXN-7740192-ICP",
        amount: 95.00,
        paymentMethod: "CARD"
      }
    },
    {
      patient: demoPatient,
      appointment: createdAppointments[0], // Cardiology Upcoming
      title: "Cardiovascular Speciality Consultation & ECG Diagnostic",
      description: "Cardiology department consultation fee and 12-lead digital electrocardiogram review.",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 86400000 * 3),
      totalAmount: 175.00,
      paidAmount: 0.00,
      balance: 175.00,
      status: "PENDING",
      paymentMethod: null
    },

    // Additional Patients' Invoices
    {
      patient: createdPatients[1],
      appointment: createdAppointments[4],
      title: "Gynecological Annual Examination",
      description: "Specialist consultation fee and preventive pelvic screening.",
      issueDate: new Date(Date.now() - 86400000 * 1),
      dueDate: new Date(Date.now() + 86400000 * 5),
      totalAmount: 100.00,
      paidAmount: 100.00,
      balance: 0.00,
      status: "PAID",
      paymentMethod: "ONLINE",
      payment: {
        transactionId: "TXN-6591023-ICP",
        amount: 100.00,
        paymentMethod: "ONLINE"
      }
    },
    {
      patient: createdPatients[2],
      appointment: createdAppointments[5],
      title: "Diabetes Care Consultation & Glycemic Panel",
      description: "General medicine consultation and HbA1c glucose laboratory evaluation.",
      issueDate: new Date(Date.now() - 86400000 * 3),
      dueDate: new Date(Date.now() + 86400000 * 4),
      totalAmount: 140.00,
      paidAmount: 140.00,
      balance: 0.00,
      status: "PAID",
      paymentMethod: "INSURANCE",
      payment: {
        transactionId: "TXN-5482910-ICP",
        amount: 140.00,
        paymentMethod: "INSURANCE"
      }
    },
    {
      patient: createdPatients[4],
      appointment: createdAppointments[7],
      title: "Orthopedic Evaluation & Joint Radiography",
      description: "Orthopedic consultation and digital X-ray series for bilateral knees.",
      issueDate: new Date(Date.now() - 86400000 * 6),
      dueDate: new Date(Date.now() + 86400000 * 1),
      totalAmount: 210.00,
      paidAmount: 0.00,
      balance: 210.00,
      status: "PENDING",
      paymentMethod: null
    },
    {
      patient: createdPatients[8],
      appointment: createdAppointments[11],
      title: "Orthopedic Spinal Consultation",
      description: "Lower back lumbar physical examination and ergonomic recovery review.",
      issueDate: new Date(Date.now() - 86400000 * 1),
      dueDate: new Date(Date.now() + 86400000 * 6),
      totalAmount: 110.00,
      paidAmount: 110.00,
      balance: 0.00,
      status: "PAID",
      paymentMethod: "CARD",
      payment: {
        transactionId: "TXN-4392019-ICP",
        amount: 110.00,
        paymentMethod: "CARD"
      }
    }
  ];

  let invCounter = 4001;
  for (const inv of invoicesData) {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${invCounter++}`,
        patientId: inv.patient.id,
        appointmentId: inv.appointment ? inv.appointment.id : null,
        title: inv.title,
        description: inv.description,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        balance: inv.balance,
        status: inv.status,
        paymentMethod: inv.paymentMethod
      }
    });

    if (inv.payment) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          transactionId: inv.payment.transactionId,
          amount: inv.payment.amount,
          paymentMethod: inv.payment.paymentMethod,
          paymentDate: inv.issueDate,
          status: "SUCCESS",
          notes: "Demo payment simulated transaction for academic demonstration."
        }
      });
    }
  }
  console.log('✅ Invoices and Payments created.');

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoPatient.userId,
        title: "Appointment Confirmed",
        message: "Your upcoming consultation with Dr. Sarah Mitchell on " + new Date(Date.now() + 86400000 * 2).toLocaleDateString() + " at 10:30 AM has been confirmed.",
        type: "APPOINTMENT",
        isRead: false
      },
      {
        userId: demoPatient.userId,
        title: "New Prescription Available",
        message: "Dr. Linda Gomez has issued an electronic prescription (RX-3001) following your consultation.",
        type: "MEDICAL",
        isRead: true
      },
      {
        userId: demoPatient.userId,
        title: "Pending Invoice Notice",
        message: "Invoice INV-4003 for $175.00 is scheduled for payment. You can pay securely via the Billing portal.",
        type: "BILLING",
        isRead: false
      },
      {
        userId: adminUser.id,
        title: "New Patient Registered",
        message: "Marcus Aurelius Miller registered an account on i_CarePlus.",
        type: "INFO",
        isRead: false
      }
    ]
  });
  console.log('✅ Demo Notifications created.');

  console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Credentials:');
  console.log('  Email:    admin@icareplus.com');
  console.log('  Password: Admin@123');
  console.log('----------------------------------------------------');
  console.log('Patient Credentials:');
  console.log('  Email:    patient@icareplus.com');
  console.log('  Password: Patient@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
