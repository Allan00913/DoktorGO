import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Appointments'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Upcoming'),
            Tab(text: 'Completed'),
            Tab(text: 'Cancelled'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _AppointmentsList(status: 'upcoming'),
          _AppointmentsList(status: 'completed'),
          _AppointmentsList(status: 'cancelled'),
        ],
      ),
    );
  }
}

class _AppointmentsList extends StatelessWidget {
  final String status;

  const _AppointmentsList({required this.status});

  @override
  Widget build(BuildContext context) {
    final appointments = status == 'upcoming'
        ? [
            {'doctor': 'Dr. Juan Reyes', 'specialty': 'General Medicine', 'date': 'Today, 2:00 PM', 'type': 'Video Call'},
            {'doctor': 'Dr. Maria Santos', 'specialty': 'Cardiology', 'date': 'Tomorrow, 10:00 AM', 'type': 'Chat'},
          ]
        : status == 'completed'
            ? [
                {'doctor': 'Dr. Pedro Garcia', 'specialty': 'Dermatology', 'date': 'Jan 15, 2024', 'type': 'Video Call'},
              ]
            : [];

    if (appointments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today_outlined, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
            const SizedBox(height: 16),
            Text(
              'No ${status} appointments',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: appointments.length,
      itemBuilder: (context, index) {
        final apt = appointments[index];
        return _AppointmentCard(
          doctor: apt['doctor']!,
          specialty: apt['specialty']!,
          date: apt['date']!,
          type: apt['type']!,
          status: status,
        );
      },
    );
  }
}

class _AppointmentCard extends StatelessWidget {
  final String doctor;
  final String specialty;
  final String date;
  final String type;
  final String status;

  const _AppointmentCard({
    required this.doctor,
    required this.specialty,
    required this.date,
    required this.type,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: const Icon(Icons.person, color: AppColors.primary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(doctor, style: const TextStyle(fontWeight: FontWeight.w600)),
                      Text(specialty, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: status == 'upcoming'
                        ? AppColors.primary.withOpacity(0.1)
                        : status == 'completed'
                            ? Colors.green.withOpacity(0.1)
                            : Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: status == 'upcoming'
                          ? AppColors.primary
                          : status == 'completed'
                              ? Colors.green
                              : Colors.red,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
                const SizedBox(width: 8),
                Text(date, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const Spacer(),
                const Icon(Icons.videocam, size: 16, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(type, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              ],
            ),
            if (status == 'upcoming') ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      child: const Text('Reschedule'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {},
                      child: const Text('Join'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}