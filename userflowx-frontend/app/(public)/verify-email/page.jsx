'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found');
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 'Email verification failed'
        );
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  if (status === 'verifying') {
    return <Loader fullScreen />;
  }

  return (
    <div className="form-container">
      <div className="card text-center">
        {status === 'success' ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => router.push('/login')}>
              Continue to Login
            </Button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => router.push('/register')} variant="secondary">
              Back to Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
