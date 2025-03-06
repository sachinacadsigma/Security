import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import useApp from '../hooks/useApp';
import endpoints from '../utils/constants/apiConfigs';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, storeToken, login } = useAuth();
  const { isDevMode } = useApp();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      storeToken(token);
    } else {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = isDevMode
          ? await axios.post(endpoints.auth.samlTokenExtractLocal, {
              token,
            })
          : await axios.post(endpoints.auth.samlTokenExtract, null, {
              params: {
                token,
              },
            });
        console.log('Data from token:', res.data);
        if (res.status === 200) {
          const { name, group } = isDevMode ? res.data : res.data?.user_data;
          login({
            name,
            group,
          });

          // log user's login
          const formData = new FormData();
          formData.append('user', name);
          axios
            .post(endpoints.log.login, formData)
            .then(() => console.log('Logged'))
            .catch((err) => console.log(err));

          navigate('/workingui');
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) getUserData();
  }, [token]);

  return (
    <div className='min-h-screen flex items-center flex-col gap-4 justify-center'>
      <div className='h-10 w-10 bg-blue-500 rounded-full animate-bounce'></div>

      <h1>Logging in...</h1>
    </div>
  );
};

export default Dashboard;
