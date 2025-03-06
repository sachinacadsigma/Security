import { actionTypes } from '../../utils/constants/actionTypes';

const appReducers = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_API_MODE:
      return {
        ...state,
        apiMode: action.payload,
      };
    default:
      return state;
  }
};

export default appReducers;
