'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'Please enter a valid email';
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
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      const apiError = error.response?.data?.message || error.message;
      setErrors({ submit: apiError });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <div className="card text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            If an account exists with this email, you will receive a password reset link.
          </p>
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Forgot Password?
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Button type="submit" loading={loading} className="mt-6">
            Send Reset Link
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
