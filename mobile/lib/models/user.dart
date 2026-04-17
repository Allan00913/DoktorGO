class User {
  final String id;
  final String email;
  final String? phone;
  final String role;
  final String? firstName;
  final String? lastName;
  final String? profileImage;
  final bool isEmailVerified;
  final bool isPhoneVerified;
  final DateTime? createdAt;

  User({
    required this.id,
    required this.email,
    this.phone,
    required this.role,
    this.firstName,
    this.lastName,
    this.profileImage,
    this.isEmailVerified = false,
    this.isPhoneVerified = false,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      role: json['role'] ?? 'patient',
      firstName: json['firstName'],
      lastName: json['lastName'],
      profileImage: json['profileImage'],
      isEmailVerified: json['isEmailVerified'] ?? false,
      isPhoneVerified: json['isPhoneVerified'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'role': role,
      'firstName': firstName,
      'lastName': lastName,
      'profileImage': profileImage,
      'isEmailVerified': isEmailVerified,
      'isPhoneVerified': isPhoneVerified,
    };
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}