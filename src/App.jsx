import './App.css';
import { useEffect } from 'react';
import Loading from './components/Loading';
import useApp from './hooks/useApp';
import endpoints from './utils/constants/apiConfigs';
import { useNavigate } from 'react-router';
import useAuth from './hooks/useAuth';
import { isTokenValid } from './utils/isTokenValid';
import axios from 'axios';

function App() {
  const { isDevMode } = useApp();
  const { name, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('name: ', name, typeof name);
    if (isTokenValid(token)) {
      navigate('/workingui');
    } else {
      if (isDevMode) {
        window.location.href = endpoints.auth.samlLoginLocal;
      } else {
        window.location.href = endpoints.auth.samlLogin;
      }
    }
  }, []);

  return <Loading />;
}

export default App;
