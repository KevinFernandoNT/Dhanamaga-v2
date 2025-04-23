import { actionType } from './actions.js';

const initialState = {
  policiesLoading: false,
  policies: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.POLICIES_LOADING:
      return {
        ...state,
        policiesLoading: action.payload,
        policies: null
      };
    case actionType.POLICIES_SUCCESS:
      return {
        ...state,
          policiesLoading: false,
          policies: action.payload
      };
    case actionType.POLICIES_FAILED:
      return {
        ...state,
        policiesLoading: action.payload,
        policies: action.payload
      };
    default:
      return state;
  }
};

export * from './policies';
export default reducer;

