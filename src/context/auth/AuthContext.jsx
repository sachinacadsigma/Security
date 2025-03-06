import { createContext, useEffect, useReducer } from 'react';
import authReducer from './authreducer';
import { isTokenValid } from '../../utils/isTokenValid';

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const INITIAL_STATE = {
  name: parseJSON(localStorage.getItem('name')) || null,
  group: parseJSON(localStorage.getItem('group')) || null,
  token: parseJSON(localStorage.getItem('token')) || null,
};

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.token && isTokenValid(state.token)) {
      localStorage.setItem('name', JSON.stringify(state.name));
      localStorage.setItem('group', JSON.stringify(state.group));
      localStorage.setItem('token', JSON.stringify(state.token));
    } else {
      localStorage.removeItem('name');
      localStorage.removeItem('group');
      localStorage.removeItem('token');
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
