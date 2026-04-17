import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Seeding database...');

  // Create test users
  const patientPassword = await bcrypt.hash('password123', 10);
  const doctorPassword = await bcrypt.hash('password123', 10);

  // Insert patient user
  await dataSource.query(`
    INSERT INTO users (id, email, password, role, "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt")
    VALUES (uuid_generate_v4(), 'patient@doktorgo.com', $1, 'patient', 'Juan', 'Dela Cruz', true, true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
  `, [patientPassword]);

  // Insert doctor users
  const doctors = [
    { email: 'dr.reyes@doktorgo.com', firstName: 'Maria', lastName: 'Reyes', specialty: 'General Medicine', fee: 500 },
    { email: 'dr.santos@doktorgo.com', firstName: 'Pedro', lastName: 'Santos', specialty: 'Cardiology', fee: 800 },
    { email: 'dr.garcia@doktorgo.com', firstName: 'Ana', lastName: 'Garcia', specialty: 'Pediatrics', fee: 600 },
    { email: 'dr.cruz@doktorgo.com', firstName: 'Luis', lastName: 'Cruz', specialty: 'Dermatology', fee: 700 },
    { email: 'dr.ong@doktorgo.com', firstName: 'Sofia', lastName: 'Ong', specialty: 'Neurology', fee: 900 },
  ];

  for (const doc of doctors) {
    await dataSource.query(`
      INSERT INTO users (id, email, password, role, "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt")
      VALUES (uuid_generate_v4(), $1, $2, 'doctor', $3, $4, true, true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [doc.email, doctorPassword, doc.firstName, doc.lastName]);
  }

  // Get user IDs
  const patientUser = await dataSource.query(`SELECT id FROM users WHERE email = 'patient@doktorgo.com'`);
  const doctorUsers = await dataSource.query(`SELECT id, email FROM users WHERE role = 'doctor' ORDER BY email`);

  if (patientUser.length > 0) {
    const patientId = patientUser[0].id;
    
    // Create patient profile
    await dataSource.query(`
      INSERT INTO patients (id, "userId", "isVerified", "createdAt", "updatedAt")
      VALUES (uuid_generate_v4(), $1, true, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [patientId]);
  }

  // Create doctor profiles
  for (const doc of doctorUsers) {
    const specialty = doctors.find(d => doc.email.includes(d.email.split('@')[0].split('.')[1]))?.specialty || 'General Medicine';
    const fee = doctors.find(d => doc.email.includes(d.email.split('@')[0].split('.')[1]))?.fee || 500;
    
    await dataSource.query(`
      INSERT INTO doctors (id, "userId", "prcLicenseNumber", "ptrNumber", specialty, "consultationFee", "isVerified", "isAvailable", rating, "totalConsultations", "createdAt", "updatedAt")
      VALUES (uuid_generate_v4(), $1, 'PRC-' || uuid_generate_v4()::text, 'PTR-' || uuid_generate_v4()::text, $2, $3, true, true, 4.8, 0, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [doc.id, specialty, fee]);
  }

  console.log('Seed completed successfully!');
  console.log('\nTest accounts:');
  console.log('Patient: patient@doktorgo.com / password123');
  console.log('Doctors: dr.reyes@dokktorgo.com / password123 (and others)');

  await app.close();
}

seed();