import { Toaster } from 'react-hot-toast';
import Header from './components/header';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const PrivateRoute = () => {
  const { name } = useAuth();

  return !name ? (
    <Navigate to='/' />
  ) : (
    <div className='bg-blue-100 min-h-screen bg'>
      <Header />
      <Toaster position='bottom-center' reverseOrder={false} />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
