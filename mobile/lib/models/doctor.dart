class Doctor {
  final String id;
  final String userId;
  final String prcLicenseNumber;
  final String ptrNumber;
  final String? prcLicenseImage;
  final String? ptrImage;
  final String specialty;
  final String? subspecialty;
  final List<String>? languages;
  final double consultationFee;
  final bool isVerified;
  final bool isAvailable;
  final String? bio;
  final String? education;
  final String? experience;
  final String? hospitalAffiliation;
  final List<String>? availableDays;
  final String? startTime;
  final String? endTime;
  final double rating;
  final int totalConsultations;
  final DoctorUser? user;

  Doctor({
    required this.id,
    required this.userId,
    required this.prcLicenseNumber,
    required this.ptrNumber,
    this.prcLicenseImage,
    this.ptrImage,
    required this.specialty,
    this.subspecialty,
    this.languages,
    this.consultationFee = 0,
    this.isVerified = false,
    this.isAvailable = false,
    this.bio,
    this.education,
    this.experience,
    this.hospitalAffiliation,
    this.availableDays,
    this.startTime,
    this.endTime,
    this.rating = 0,
    this.totalConsultations = 0,
    this.user,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      prcLicenseNumber: json['prcLicenseNumber'] ?? '',
      ptrNumber: json['ptrNumber'] ?? '',
      prcLicenseImage: json['prcLicenseImage'],
      ptrImage: json['ptrImage'],
      specialty: json['specialty'] ?? '',
      subspecialty: json['subspecialty'],
      languages: json['languages'] != null ? List<String>.from(json['languages']) : null,
      consultationFee: double.tryParse(json['consultationFee']?.toString() ?? '0') ?? 0,
      isVerified: json['isVerified'] ?? false,
      isAvailable: json['isAvailable'] ?? false,
      bio: json['bio'],
      education: json['education'],
      experience: json['experience'],
      hospitalAffiliation: json['hospitalAffiliation'],
      availableDays: json['availableDays'] != null ? List<String>.from(json['availableDays']) : null,
      startTime: json['startTime'],
      endTime: json['endTime'],
      rating: double.tryParse(json['rating']?.toString() ?? '0') ?? 0,
      totalConsultations: json['totalConsultations'] ?? 0,
      user: json['user'] != null ? DoctorUser.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'prcLicenseNumber': prcLicenseNumber,
      'ptrNumber': ptrNumber,
      'specialty': specialty,
      'consultationFee': consultationFee,
      'isVerified': isVerified,
      'isAvailable': isAvailable,
    };
  }

  String get displayName => user?.fullName ?? 'Doctor';
  String? get profileImage => user?.profileImage;
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