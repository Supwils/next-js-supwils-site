import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      try {
        // Verify token on client-side (basic check)
        // For better security, verify on server side
        const decoded = jwt.decode(token);
        const isValid = decoded && decoded.exp * 1000 > Date.now();
        
        if (!isValid) {
          throw new Error('Token expired');
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}