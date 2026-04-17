import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../features/splash/screens/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/bloc/auth_bloc.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/doctors/screens/doctors_list_screen.dart';
import '../../features/consultation/screens/consultation_screen.dart';
import '../../features/appointments/screens/appointments_screen.dart';
import '../../features/prescriptions/screens/prescriptions_screen.dart';
import '../../features/profile/screens/profile_screen.dart';

class AppRouter {
  static final _storage = const FlutterSecureStorage();
  
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) async {
      final token = await _storage.read(key: 'auth_token');
      final isLoggedIn = token != null;
      
      if (state.matchedLocation == '/' && isLoggedIn) {
        return '/home';
      }
      
      if (state.matchedLocation != '/' && !isLoggedIn && state.matchedLocation != '/register') {
        return '/';
      }
      
      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/doctors',
        name: 'doctors',
        builder: (context, state) => const DoctorsListScreen(),
      ),
      GoRoute(
        path: '/consultation/:doctorId',
        name: 'consultation',
        builder: (context, state) {
          final doctorId = state.pathParameters['doctorId']!;
          return ConsultationScreen(doctorId: doctorId);
        },
      ),
      GoRoute(
        path: '/appointments',
        name: 'appointments',
        builder: (context, state) => const AppointmentsScreen(),
      ),
      GoRoute(
        path: '/prescriptions',
        name: 'prescriptions',
        builder: (context, state) => const PrescriptionsScreen(),
      ),
      GoRoute(
        path: '/prescription/:id',
        name: 'prescription-detail',
        builder: (context, state) {
          return const Scaffold(
            body: Center(child: Text('Prescription Detail')),
          );
        },
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}