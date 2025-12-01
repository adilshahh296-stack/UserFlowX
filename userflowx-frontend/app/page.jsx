export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            UserFlowX
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive user onboarding and authentication system
          </p>

          <div className="flex gap-4 justify-center mt-12">
            <a
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </a>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔐 Secure Authentication
              </h3>
              <p className="text-gray-600">
                JWT-based authentication with HTTP-only cookies
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✉️ Email Verification
              </h3>
              <p className="text-gray-600">
                Verify user emails with secure token-based links
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                👥 Role-Based Access
              </h3>
              <p className="text-gray-600">
                Control access with admin and user roles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
