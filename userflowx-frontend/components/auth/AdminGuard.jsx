'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/ui/Loader';

export const AdminGuard = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default AdminGuard;
