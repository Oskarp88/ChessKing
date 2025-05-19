import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import Spinner from '../Spinner';

const AdminRoute = () => {
  const { auth } = useAuth();

  return auth?.user && auth?.user?.isAdmin ? <Outlet /> : <Spinner path='' replace/>
};

export default AdminRoute;
