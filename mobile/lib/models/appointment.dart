class Appointment {
  final String id;
  final String doctorId;
  final String patientId;
  final String type;
  final String status;
  final DateTime scheduledDate;
  final String? startTime;
  final String? endTime;
  final String? reason;
  final String? symptoms;
  final double consultationFee;
  final bool isPaid;
  final String? paymentId;
  final String? consultationId;
  final int queuePosition;
  final String? notes;
  final AppointmentDoctor? doctor;
  final AppointmentPatient? patient;
  final DateTime? createdAt;

  Appointment({
    required this.id,
    required this.doctorId,
    required this.patientId,
    required this.type,
    required this.status,
    required this.scheduledDate,
    this.startTime,
    this.endTime,
    this.reason,
    this.symptoms,
    this.consultationFee = 0,
    this.isPaid = false,
    this.paymentId,
    this.consultationId,
    this.queuePosition = 0,
    this.notes,
    this.doctor,
    this.patient,
    this.createdAt,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'] ?? '',
      doctorId: json['doctorId'] ?? '',
      patientId: json['patientId'] ?? '',
      type: json['type'] ?? 'scheduled',
      status: json['status'] ?? 'pending',
      scheduledDate: json['scheduledDate'] != null 
          ? DateTime.parse(json['scheduledDate']) 
          : DateTime.now(),
      startTime: json['startTime'],
      endTime: json['endTime'],
      reason: json['reason'],
      symptoms: json['symptoms'],
      consultationFee: double.tryParse(json['consultationFee']?.toString() ?? '0') ?? 0,
      isPaid: json['isPaid'] ?? false,
      paymentId: json['paymentId'],
      consultationId: json['consultationId'],
      queuePosition: json['queuePosition'] ?? 0,
      notes: json['notes'],
      doctor: json['doctor'] != null ? AppointmentDoctor.fromJson(json['doctor']) : null,
      patient: json['patient'] != null ? AppointmentPatient.fromJson(json['patient']) : null,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'doctorId': doctorId,
      'patientId': patientId,
      'type': type,
      'status': status,
      'scheduledDate': scheduledDate.toIso8601String(),
      'consultationFee': consultationFee,
      'isPaid': isPaid,
    };
  }

  String get statusDisplay {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}

class AppointmentDoctor {
  final String id;
  final String specialty;
  final double consultationFee;
  final DoctorUser? user;

  AppointmentDoctor({
    required this.id,
    required this.specialty,
    this.consultationFee = 0,
    this.user,
  });

  factory AppointmentDoctor.fromJson(Map<String, dynamic> json) {
    return AppointmentDoctor(
      id: json['id'] ?? '',
      specialty: json['specialty'] ?? '',
      consultationFee: double.tryParse(json['consultationFee']?.toString() ?? '0') ?? 0,
      user: json['user'] != null ? DoctorUser.fromJson(json['user']) : null,
    );
  }

  String get displayName => user?.fullName ?? 'Doctor';
}

class AppointmentPatient {
  final String id;
  final PatientUser? user;

  AppointmentPatient({
    required this.id,
    this.user,
  });

  factory AppointmentPatient.fromJson(Map<String, dynamic> json) {
    return AppointmentPatient(
      id: json['id'] ?? '',
      user: json['user'] != null ? PatientUser.fromJson(json['user']) : null,
    );
  }

  String get displayName => user?.fullName ?? 'Patient';
}

class DoctorUser {
  final String? firstName;
  final String? lastName;
  final String? profileImage;

  DoctorUser({
    this.firstName,
    this.lastName,
    this.profileImage,
  });

  factory DoctorUser.fromJson(Map<String, dynamic> json) {
    return DoctorUser(
      firstName: json['firstName'],
      lastName: json['lastName'],
      profileImage: json['profileImage'],
    );
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}

class PatientUser {
  final String? firstName;
  final String? lastName;

  PatientUser({
    this.firstName,
    this.lastName,
  });

  factory PatientUser.fromJson(Map<String, dynamic> json) {
    return PatientUser(
      firstName: json['firstName'],
      lastName: json['lastName'],
    );
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}