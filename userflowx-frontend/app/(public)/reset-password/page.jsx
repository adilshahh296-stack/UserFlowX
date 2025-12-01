'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('loading'); // 'loading', 'form', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setStatus('error');
      setMessage('No reset token found');
    } else {
      setToken(resetToken);
      setStatus('form');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      setStatus('success');
      setMessage('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      const apiError = error.response?.data?.message || error.message;
      setErrors({ submit: apiError });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <Loader fullScreen />;
  }

  if (status === 'error') {
    return (
      <div className="form-container">
        <div className="card text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
            Request new reset link
          </a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="form-container">
        <div className="card text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Success!</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Reset Password
        </h1>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="New Password"
            type="password"
            placeholder="••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <TextField
            label="Confirm Password"
            type="password"
            placeholder="••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" loading={loading} className="mt-6">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
