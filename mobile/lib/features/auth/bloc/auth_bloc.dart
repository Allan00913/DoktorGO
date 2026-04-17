import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../services/api/api_client.dart';
import '../../../models/user.dart';

abstract class AuthEvent {}

class AuthCheckRequested extends AuthEvent {}

class AuthLoginRequested extends AuthEvent {
  final String emailOrPhone;
  final String password;

  AuthLoginRequested({required this.emailOrPhone, required this.password});
}

class AuthRegisterRequested extends AuthEvent {
  final String email;
  final String password;
  final String? firstName;
  final String? lastName;

  AuthRegisterRequested({
    required this.email,
    required this.password,
    this.firstName,
    this.lastName,
  });
}

class AuthLogoutRequested extends AuthEvent {}

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final User user;

  AuthAuthenticated({required this.user});
}

class AuthUnauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;

  AuthError({required this.message});
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiClient apiClient;
  final _storage = const FlutterSecureStorage();

  AuthBloc({required this.apiClient}) : super(AuthInitial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
    on<AuthLoginRequested>(_onAuthLoginRequested);
    on<AuthRegisterRequested>(_onAuthRegisterRequested);
    on<AuthLogoutRequested>(_onAuthLogoutRequested);
  }

  Future<void> _onAuthCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token != null && token.isNotEmpty) {
        await apiClient.setToken(token);
        final response = await apiClient.get('/users/me');
        final user = User.fromJson(response.data);
        emit(AuthAuthenticated(user: user));
      } else {
        emit(AuthUnauthenticated());
      }
    } catch (e) {
      await apiClient.clearToken();
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onAuthLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await apiClient.post('/auth/login', data: {
        'emailOrPhone': event.emailOrPhone,
        'password': event.password,
      });

      final data = response.data;
      await apiClient.setToken(data['access_token']);
      
      final user = User.fromJson(data['user']);
      emit(AuthAuthenticated(user: user));
    } catch (e) {
      emit(AuthError(message: e.toString()));
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onAuthRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await apiClient.post('/auth/register', data: {
        'email': event.email,
        'password': event.password,
        'firstName': event.firstName,
        'lastName': event.lastName,
        'role': 'patient',
      });

      final data = response.data;
      await apiClient.setToken(data['access_token']);
      
      final user = User.fromJson(data['user']);
      emit(AuthAuthenticated(user: user));
    } catch (e) {
      emit(AuthError(message: e.toString()));
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onAuthLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await apiClient.clearToken();
    emit(AuthUnauthenticated());
  }
}