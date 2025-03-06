const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        name: action.payload.name,
        group: action.payload.group,
      };
    case 'LOGOUT':
      return {
        ...state,
        name: null,
        group: null,
        token: null,
      };
    case 'STORE_TOKEN':
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export default authReducer;
