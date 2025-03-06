import { createContext, useReducer } from 'react';
import appReducers from './appReducers';

const INITAL_STATE = {
  apiMode: 'azure',
  isDevMode: import.meta.env.MODE === 'development',
};

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducers, INITAL_STATE);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
