'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
import Button from '@/components/ui/Button';

function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              👥 User Management
            </h2>
            <p className="text-gray-600 mb-6">
              Manage all users in the system. View, edit roles, and delete users.
            </p>
            <Link href="/admin/users">
              <Button className="w-full">View All Users</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Statistics
            </h2>
            <p className="text-gray-600 mb-6">
              View system statistics and analytics.
            </p>
            <Button variant="secondary" disabled className="w-full">
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📝 Activity Logs
            </h2>
            <p className="text-gray-600 mb-6">
              View user activity and system logs.
            </p>
            <Button variant="secondary" disabled className="w-full">
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ⚙️ Settings
            </h2>
            <p className="text-gray-600 mb-6">
              Configure system settings and preferences.
            </p>
            <Button variant="secondary" disabled className="w-full">
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
