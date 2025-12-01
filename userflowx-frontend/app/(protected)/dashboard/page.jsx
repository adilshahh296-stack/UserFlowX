'use client';

import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Loader from '@/components/ui/Loader';

function DashboardContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">UserFlowX Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.name}!</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Profile Information</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong>{' '}
                  <span className="bg-blue-200 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                    Verified
                  </span>
                </p>
              </div>
            </div>

            {user.role === 'admin' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Admin Panel
                </h3>
                <p className="text-purple-800 mb-4">
                  You have administrative access to the system.
                </p>
                <a
                  href="/admin"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Admin Panel
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Account Security</h3>
            <p className="text-gray-600 mb-4">
              Your account is secured with a strong password and email verification.
            </p>
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Change Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
