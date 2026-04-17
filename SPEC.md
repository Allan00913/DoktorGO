# DoktorGO - Telemedicine Platform Specification

## 1. Project Overview

**Project Name:** DoktorGO  
**Type:** Telemedicine / Virtual Clinic Platform  
**Target Market:** Philippine / Filipino Community  
**Core Value Proposition:** "The Grab of Healthcare" - Speed and accessibility for Filipino users

## 2. Technology Stack

### Backend
- **Framework:** Node.js with NestJS
- **Database:** PostgreSQL (relational data) + MongoDB (medical notes)
- **Caching:** Redis for real-time state (waiting rooms)
- **Video:** Agora.io or WebRTC
- **File Storage:** AWS S3 / Google Cloud Storage

### Mobile
- **Framework:** Flutter (cross-platform iOS/Android)
- **State Management:** flutter_bloc / provider

### DevOps
- **Containerization:** Docker & Docker Compose
- **Cloud:** AWS / Google Cloud

## 3. User Roles

### Patients
- Register/Login with phone/email
- Search doctors by name, specialty, symptom, language
- Book appointments or instant consultation
- Video/Audio consultations with doctors
- In-app chat with doctors
- View/download e-prescriptions
- Digital vault for medical records
- Payment via GCash, Maya, GrabPay

### Doctors
- PRC License verification
- EMR (Electronic Medical Record) system
- E-prescription generation with digital signature
- Patient queue management
- Consultation history
- Billing management
- Availability scheduling

### Admins/Clinics
- Analytics dashboard (patient volume, revenue)
- Staff management
- Doctor verification
- Platform configuration

## 4. Core Features

### 4.1 Authentication & Authorization
- Phone/Email registration
- OAuth 2.0 / OpenID Connect
- Role-based access control (Patient, Doctor, Admin)
- JWT-based session management

### 4.2 Doctor Management
- Profile with PRC license verification
- Specialties and subspecialties
- Availability scheduling
- Consultation fee display
- Language proficiency (Tagalog, Cebuano, Ilonggo, etc.)

### 4.3 Appointment System
- Book by specialty/doctor/date/time
- Instant consultation (urgent care)
- Appointment reminders
- Reschedule/Cancel functionality
- Queue management

### 4.4 Video Consultation
- WebRTC-based peer-to-peer video
- Picture-in-Picture mode
- Signal strength indicator
- Audio-only fallback mode
- In-call chat with image sharing
- Recording option (with consent)

### 4.5 E-Prescription System
- Digital prescription creation
- QR code generation for verification
- PDF export with digital signature
- Pharmacy verification portal
- Prescription history

### 4.6 Medical Records
- Lab results storage
- Imaging (X-ray, MRI, etc.)
- Consultation notes
- Document upload/download

### 4.7 Payments
- GCash integration
- Maya integration
- GrabPay integration
- HMO/PhilHealth verification
- Invoice generation

## 5. Philippine-Specific Features

### 5.1 Local Integrations
- Maxicare, Intellicare, PhilCare verification
- Mercury Drug, Watsons pharmacy integration
- Local lab partners (Hi-Precision)

### 5.2 Accessibility
- Low-bandwidth video mode
- Voice-only fallback
- SMS notifications
- Offline capability for basic features

### 5.3 Localization
- Filipino/Tagalog language support
- Regional dialect support
- Philippine timezone handling
- PHP currency format

## 6. Compliance & Security

### 6.1 Data Privacy (RA 10173)
- End-to-end encryption for video
- AES-256 encryption at rest
- Strict access controls
- Data residency compliance
- Audit logging

### 6.2 DOH/NPC Guidelines
- Telemedicine practice guidelines
- Patient consent for remote consultation
- Proper documentation

### 6.3 E-Prescription
- FDA/DOH compliant formats
- Digital signature verification
- PRC license validation

## 7. Database Schema Overview

### Core Entities
- Users (base table)
- Patients (extends Users)
- Doctors (extends Users)
- Appointments
- Consultations
- Prescriptions
- PrescriptionItems
- MedicalRecords
- Payments
- Notifications

## 8. API Architecture

### Services (Microservices Ready)
- Identity Service (auth, users)
- Doctor Service (profiles, schedules)
- Appointment Service (booking, queue)
- Consultation Service (video, chat)
- Prescription Service (e-prescriptions)
- Payment Service (transactions)
- Notification Service (push, SMS)

### API Gateway
- Authentication
- Rate limiting
- Request routing
- Load balancing

## 9. Development Phases

### Phase 1: MVP
- Mobile-responsive web app
- Basic video consultation
- GCash payments
- Essential doctor-patient flow
- Manual PRC verification

### Phase 2: Expansion
- Full mobile app (Flutter)
- HMO/PhilHealth integration
- Lab booking integration
- Pharmacy integration

### Phase 3: Scale
- Analytics dashboard
- Advanced EMR features
- AI-powered symptom checker
- Multi-clinic support