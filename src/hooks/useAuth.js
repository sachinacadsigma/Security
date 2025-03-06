import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthContext';

const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { name, group, token } = state;

  const login = (payload) => {
    dispatch({
      type: 'LOGIN',
      payload,
    });
  };

  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    });
  };

  const storeToken = (token) => {
    dispatch({
      type: 'STORE_TOKEN',
      payload: { token },
    });
  };

  return { name, group, token, login, logout, storeToken };
};

export default useAuth;
