class Prescription {
  final String id;
  final String prescriptionNumber;
  final String consultationId;
  final String doctorId;
  final String patientId;
  final String status;
  final String? diagnosis;
  final String? notes;
  final DateTime? validUntil;
  final String? qrCodeUrl;
  final String? pdfUrl;
  final String? digitalSignature;
  final DateTime? dispensedAt;
  final String? dispensedPharmacy;
  final List<PrescriptionItem>? items;
  final PrescriptionDoctor? doctor;
  final PrescriptionPatient? patient;
  final DateTime? createdAt;

  Prescription({
    required this.id,
    required this.prescriptionNumber,
    required this.consultationId,
    required this.doctorId,
    required this.patientId,
    required this.status,
    this.diagnosis,
    this.notes,
    this.validUntil,
    this.qrCodeUrl,
    this.pdfUrl,
    this.digitalSignature,
    this.dispensedAt,
    this.dispensedPharmacy,
    this.items,
    this.doctor,
    this.patient,
    this.createdAt,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) {
    return Prescription(
      id: json['id'] ?? '',
      prescriptionNumber: json['prescriptionNumber'] ?? '',
      consultationId: json['consultationId'] ?? '',
      doctorId: json['doctorId'] ?? '',
      patientId: json['patientId'] ?? '',
      status: json['status'] ?? 'active',
      diagnosis: json['diagnosis'],
      notes: json['notes'],
      validUntil: json['validUntil'] != null ? DateTime.parse(json['validUntil']) : null,
      qrCodeUrl: json['qrCodeUrl'],
      pdfUrl: json['pdfUrl'],
      digitalSignature: json['digitalSignature'],
      dispensedAt: json['dispensedAt'] != null ? DateTime.parse(json['dispensedAt']) : null,
      dispensedPharmacy: json['dispensedPharmacy'],
      items: json['items'] != null 
          ? (json['items'] as List).map((e) => PrescriptionItem.fromJson(e)).toList() 
          : null,
      doctor: json['doctor'] != null ? PrescriptionDoctor.fromJson(json['doctor']) : null,
      patient: json['patient'] != null ? PrescriptionPatient.fromJson(json['patient']) : null,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }

  bool get isActive => status == 'active';
  bool get isDispensed => status == 'dispensed';
}

class PrescriptionItem {
  final String id;
  final String prescriptionId;
  final String genericName;
  final String? brandName;
  final String dosage;
  final String frequency;
  final String duration;
  final int? quantity;
  final String? instructions;
  final bool isDispensed;

  PrescriptionItem({
    required this.id,
    required this.prescriptionId,
    required this.genericName,
    this.brandName,
    required this.dosage,
    required this.frequency,
    required this.duration,
    this.quantity,
    this.instructions,
    this.isDispensed = false,
  });

  factory PrescriptionItem.fromJson(Map<String, dynamic> json) {
    return PrescriptionItem(
      id: json['id'] ?? '',
      prescriptionId: json['prescriptionId'] ?? '',
      genericName: json['genericName'] ?? '',
      brandName: json['brandName'],
      dosage: json['dosage'] ?? '',
      frequency: json['frequency'] ?? '',
      duration: json['duration'] ?? '',
      quantity: json['quantity'],
      instructions: json['instructions'],
      isDispensed: json['isDispensed'] ?? false,
    );
  }
}

class PrescriptionDoctor {
  final String id;
  final String specialty;
  final PrescriptionDoctorUser? user;

  PrescriptionDoctor({
    required this.id,
    required this.specialty,
    this.user,
  });

  factory PrescriptionDoctor.fromJson(Map<String, dynamic> json) {
    return PrescriptionDoctor(
      id: json['id'] ?? '',
      specialty: json['specialty'] ?? '',
      user: json['user'] != null ? PrescriptionDoctorUser.fromJson(json['user']) : null,
    );
  }

  String get displayName => user?.fullName ?? 'Doctor';
}

class PrescriptionDoctorUser {
  final String? firstName;
  final String? lastName;

  PrescriptionDoctorUser({
    this.firstName,
    this.lastName,
  });

  factory PrescriptionDoctorUser.fromJson(Map<String, dynamic> json) {
    return PrescriptionDoctorUser(
      firstName: json['firstName'],
      lastName: json['lastName'],
    );
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}

class PrescriptionPatient {
  final String id;
  final PrescriptionPatientUser? user;

  PrescriptionPatient({
    required this.id,
    this.user,
  });

  factory PrescriptionPatient.fromJson(Map<String, dynamic> json) {
    return PrescriptionPatient(
      id: json['id'] ?? '',
      user: json['user'] != null ? PrescriptionPatientUser.fromJson(json['user']) : null,
    );
  }

  String get displayName => user?.fullName ?? 'Patient';
}

class PrescriptionPatientUser {
  final String? firstName;
  final String? lastName;

  PrescriptionPatientUser({
    this.firstName,
    this.lastName,
  });

  factory PrescriptionPatientUser.fromJson(Map<String, dynamic> json) {
    return PrescriptionPatientUser(
      firstName: json['firstName'],
      lastName: json['lastName'],
    );
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}