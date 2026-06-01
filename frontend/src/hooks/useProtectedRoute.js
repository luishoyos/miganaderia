import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return true;
};
