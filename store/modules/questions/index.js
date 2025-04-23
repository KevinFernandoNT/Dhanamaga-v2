import { actionType } from './actions.js';

const initialState = {

  question: {
    loading: false,
    success: false,
    failed: false,
    error: [],
    payload: []
  },

  questionView: {
    loading: false,
    success: false,
    failed: false,
    error: [],
    payload: []
  },

}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_QUESTION_LOADING:
      return {
        ...state,
        question: {
          loading: true,
          success: false,
          failed: false,
          error: [],
          payload: []
        }
      };
    case actionType.ADD_QUESTION_SUCCESS:
      return {
        ...state,
        question: {
          loading: false,
          success: action.payload.sucess,
          failed: false,
          error: [],
          payload: action.payload
        }
      };
    case actionType.ADD_QUESTION_FAILED:
      return {
        ...state,
        question: {
          loading: false,
          success: false,
          failed: action.payload.sucess,
          error: action.payload,
          payload: []
        }
      };

      case actionType.VIEW_QUESTION_LOADING:
        return {
          ...state,
          questionView: {
            loading: true,
            success: false,
            failed: false,
            error: [],
            payload: []
          }
        };
      case actionType.VIEW_QUESTION_SUCCESS:
        return {
          ...state,
          questionView: {
            loading: false,
            success: action.payload.sucess,
            failed: false,
            error: [],
            payload: action.payload
          }
        };
      case actionType.VIEW_QUESTION_FAILED:
        return {
          ...state,
          questionView: {
            loading: false,
            success: false,
            failed: action.payload.sucess,
            error: action.payload,
            payload: []
          }
        };

    default:
      return state;
  }
};

export * from './question';
export default reducer;
