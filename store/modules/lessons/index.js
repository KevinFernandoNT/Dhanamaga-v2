import { actionType } from './actions.js';

const initialState = {

  lessons_by_course: {
    loading: false,
    success: false,
    failed: false,
    error: [],
    lessons: [],
  },
  
  update_lesson_watch_status: {
    loading: false,
    success: false,
    failed: false,
    error: [],
  },
  addBookMark: {
     loading: false,
    success: false,
    failed: false,
    error: [],
  },
  update_rating_status: {
    loading: false,
    success: false,
    failed: false,
    error: [],
  },
  lessons_like: {
    loading: false,
    success: false,
    failed: false,
    error: [],
  },
  lessons_review: {
    loading: false,
    success: false,
    failed: false,
    error: [],
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.UPDATE_LESSONS_WATCHIG_STATUS_LOADING:
      return {
        ...state,
        update_lesson_watch_status: {
          loading: true,
          success: false,
          failed: false,
          error: [],
        }
      };
    case actionType.UPDATE_LESSONS_WATCHIG_STATUS_SUCCESS:
      return {
        ...state,
        update_lesson_watch_status: {
          loading: false,
          success: action.payload.success,
          failed: false,
          error: []
        },
        // lessons: action.payload.lessons
      };
    case actionType.UPDATE_LESSONS_WATCHIG_STATUS_FAILED:
      return {
        ...state,
        update_lesson_watch_status: {
          loading: false,
          success: false,
          failed: action.payload.success,
          error: action.payload,
        }


      };

    case actionType.GET_LESSONS_BY_COURSE_LOADING:
      return {
        ...state,
        lessons_by_course: {
          loading: true,
          success: false,
          failed: false,
          error: [],
          lessons: []
        },

      };
    case actionType.GET_LESSONS_BY_COURSE_SUCCESS:
      return {
        ...state,
        lessons_by_course: {
          loading: false,
          success: action.payload.success,
          failed: false,
          error: [],
          lessons: action.payload.lessons

        },
        
      };
    case actionType.GET_LESSONS_BY_COURSE_FAILED:
      return {
        ...state,
        lessons_by_course: {
          loading: false,
          success: false,
          failed: action.payload.success,
          error: action.payload,
          lessons: []
        },
       
      };
    case actionType.ADD_BOOK_MARK_LOADING:
      return {
        ...state,
        addBookMark: {
          loading: true,
          success: false,
          failed: false,
          error: []
        }
      };
    case actionType.ADD_BOOK_MARK_SUCCESS:
      return {
        ...state,
        addBookMark: {
          loading: false,
          success: action.payload,
          failed: false,
          error: []
        }
      };
    case actionType.ADD_BOOK_MARK_FAILED:
      return {
        ...state,
        addBookMark: {
          loading: false,
          success: false,
          failed: action.payload,
          error: action.payload
        }
      };
      case actionType.UPDATE_RATING_LOADING:
        return {
          ...state,
          update_rating_status: {
            loading: true,
            success: false,
            failed: false,
            error: []         
          },
        };
      case actionType.UPDATE_RATING_SUCCESS:
        return {
          ...state,
          update_rating_status: {
            loading: false,
            success: action.payload.success,
            failed: false,
            error: []
          },
        };
      case actionType.UPDATE_RATING_FAILED:
        return {
          ...state,
          update_rating_status: {
            loading: false,
            success: false,
            failed: action.payload.success,
            error: action.payload
          },
        };
        case actionType.LESSON_LIKE_LOADING:
          return {
            ...state,
            lessons_like: {
              loading: true,
              success: false,
              failed: false,
              error: []         
            },
          };
        case actionType.LESSON_LIKE_SUCCESS:
          return {
            ...state,
            lessons_like: {
              loading: false,
              success: action.payload.success,
              failed: false,
              error: []
            },
          };
        case actionType.LESSON_LIKE_FAILED:
          return {
            ...state,
            lessons_like: {
              loading: false,
              success: false,
              failed: action.payload.success,
              error: action.payload
            },
          };
          case actionType.LESSON_REVIEW_LOADING:
            return {
              ...state,
              lessons_review: {
                loading: true,
                success: false,
                failed: false,
                error: []         
              },
            };
          case actionType.LESSON_REVIEW_SUCCESS:
            return {
              ...state,
              lessons_review: {
                loading: false,
                success: action.payload.success,
                failed: false,
                error: []
              },
            };
          case actionType.LESSON_REVIEW_FAILED:
            return {
              ...state,
              lessons_review: {
                loading: false,
                success: false,
                failed: action.payload.success,
                error: action.payload
              },
            };
    default:
      return state;
  }
};

export * from './lessons';
export default reducer;
