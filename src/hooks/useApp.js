import { useContext } from 'react';
import { AppContext } from '../context/app/AppContext';
import { actionTypes } from '../utils/constants/actionTypes';

const useApp = () => {
  const { state, dispatch } = useContext(AppContext);
  const { apiMode, isDevMode } = state;

  const changeApiMode = (newApiMode) => {
    dispatch({ type: actionTypes.CHANGE_API_MODE, payload: newApiMode });
    localStorage.setItem('apiMode', newApiMode);
  };

  return {
    apiMode,
    isDevMode,
    changeApiMode,
  };
};

export default useApp;
