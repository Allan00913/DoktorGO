import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1704067200000 implements MigrationInterface {
  name = 'InitialMigration1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "phone" VARCHAR(50),
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(50) NOT NULL DEFAULT 'patient',
        "isEmailVerified" BOOLEAN DEFAULT false,
        "isPhoneVerified" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        "profileImage" VARCHAR(500),
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        "dateOfBirth" TIMESTAMP,
        "gender" VARCHAR(20),
        "address" TEXT,
        "city" VARCHAR(100),
        "province" VARCHAR(100),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "patients" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "emergencyContact" VARCHAR(255),
        "emergencyPhone" VARCHAR(50),
        "bloodType" VARCHAR(10),
        "allergies" TEXT,
        "medicalConditions" TEXT,
        "isVerified" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "doctors" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" UUID UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "prcLicenseNumber" VARCHAR(100),
        "ptrNumber" VARCHAR(100),
        "specialty" VARCHAR(255),
        "subspecialty" VARCHAR(255),
        "consultationFee" DECIMAL(10,2),
        "yearsExperience" INTEGER,
        "hospitalAffiliation" TEXT,
        "biography" TEXT,
        "languages" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
        "isVerified" BOOLEAN DEFAULT false,
        "isAvailable" BOOLEAN DEFAULT true,
        "rating" DECIMAL(3,2) DEFAULT 0,
        "totalConsultations" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "patientId" UUID REFERENCES "patients"("id"),
        "doctorId" UUID REFERENCES "doctors"("id"),
        "appointmentDate" TIMESTAMP NOT NULL,
        "duration" INTEGER DEFAULT 30,
        "status" VARCHAR(50) DEFAULT 'pending',
        "type" VARCHAR(50) DEFAULT 'scheduled',
        "reason" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "consultations" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "appointmentId" UUID REFERENCES "appointments"("id"),
        "doctorId" UUID REFERENCES "doctors"("id"),
        "patientId" UUID REFERENCES "patients"("id"),
        "startTime" TIMESTAMP,
        "endTime" TIMESTAMP,
        "status" VARCHAR(50) DEFAULT 'waiting',
        "consultationType" VARCHAR(50) DEFAULT 'video',
        "symptoms" TEXT,
        "diagnosis" TEXT,
        "notes" TEXT,
        "roomId" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "prescriptions" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "consultationId" UUID REFERENCES "consultations"("id"),
        "patientId" UUID REFERENCES "patients"("id"),
        "doctorId" UUID REFERENCES "doctors"("id"),
        "prescriptionDate" TIMESTAMP DEFAULT NOW(),
        "validUntil" TIMESTAMP,
        "status" VARCHAR(50) DEFAULT 'active',
        "notes" TEXT,
        "digitalSignature" TEXT,
        "qrCode" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "appointmentId" UUID REFERENCES "appointments"("id"),
        "patientId" UUID REFERENCES "patients"("id"),
        "doctorId" UUID REFERENCES "doctors"("id"),
        "amount" DECIMAL(10,2) NOT NULL,
        "currency" VARCHAR(10) DEFAULT 'PHP',
        "paymentMethod" VARCHAR(50),
        "paymentStatus" VARCHAR(50) DEFAULT 'pending',
        "transactionId" VARCHAR(255),
        "gcashReference" VARCHAR(255),
        "mayaReference" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "users"("email")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_appointments_patient" ON "appointments"("patientId")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_appointments_doctor" ON "appointments"("doctorId")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_consultations_appointment" ON "consultations"("appointmentId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consultations" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
  }
}