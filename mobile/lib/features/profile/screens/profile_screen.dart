import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/bloc/auth_bloc.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: AppColors.primary.withOpacity(0.1),
                    child: const Icon(Icons.person, size: 50, color: AppColors.primary),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Juan Dela Cruz',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'juan@example.com',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () {},
                    child: const Text('Edit Profile'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _ProfileSection(
              title: 'Account',
              items: [
                _ProfileItem(icon: Icons.person, title: 'Personal Information', onTap: () {}),
                _ProfileItem(icon: Icons.location_on, title: 'Address', onTap: () {}),
                _ProfileItem(icon: Icons.notifications, title: 'Notifications', onTap: () {}),
              ],
            ),
            const SizedBox(height: 16),
            _ProfileSection(
              title: 'Medical',
              items: [
                _ProfileItem(icon: Icons.medical_information, title: 'Medical History', onTap: () {}),
                _ProfileItem(icon: Icons.vaccines, title: 'Vaccinations', onTap: () {}),
                _ProfileItem(icon: Icons.science, title: 'Lab Results', onTap: () {}),
              ],
            ),
            const SizedBox(height: 16),
            _ProfileSection(
              title: 'Payment',
              items: [
                _ProfileItem(icon: Icons.payment, title: 'Payment Methods', onTap: () {}),
                _ProfileItem(icon: Icons.receipt_long, title: 'Transaction History', onTap: () {}),
              ],
            ),
            const SizedBox(height: 16),
            _ProfileSection(
              title: 'Support',
              items: [
                _ProfileItem(icon: Icons.help, title: 'Help Center', onTap: () {}),
                _ProfileItem(icon: Icons.privacy_tip, title: 'Privacy Policy', onTap: () {}),
                _ProfileItem(icon: Icons.description, title: 'Terms of Service', onTap: () {}),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  context.read<AuthBloc>().add(AuthLogoutRequested());
                  context.go('/');
                },
                icon: const Icon(Icons.logout, color: Colors.red),
                label: const Text('Logout', style: TextStyle(color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                ),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              'DoktorGO v1.0.0',
              style: TextStyle(color: AppColors.textSecondary.withOpacity(0.5)),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileSection extends StatelessWidget {
  final String title;
  final List<_ProfileItem> items;

  const _ProfileSection({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        Card(
          child: Column(
            children: items,
          ),
        ),
      ],
    );
  }
}

class _ProfileItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _ProfileItem({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}