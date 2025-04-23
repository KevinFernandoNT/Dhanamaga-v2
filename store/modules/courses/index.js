import { actionType } from './actions.js';

const initialState = {
  courses: {
    loading: false,
    success: {
      data: [],
      isNext: false,
    },
    failed: false,
    error: [],
  },
  bookmarkedCourses: {
    loading: false,
    success: {
      data: [],
      isNext: false,
    },
    failed: false,
    error: [],
  },
  timelineCourses: {
    loading: false,
    success: {
      data: [],
      isNext: false,
    },
    failed: false,
    error: [],
  },
  sampleVideosAll: {
    loading: false,
    success: {
      data: [],
      isNext: false,
    },
    failed: false,
    error: [],
  },
  like: {
    loading: false,
    success: false,
    error: [],
  },
  course: {
    loading: false,
    success: false,
    failed: false,
    error: [],
    course: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.COURSES_ALL_LOADING:
      return {
        ...state,
        courses: {
          loading: action.payload,
          success: {
            data: [],
            isNext: false,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.COURSES_ALL_SUCCESS:
      return {
        ...state,
        courses: {
          loading: false,
          success: {
            data: [...state.courses.success.data, ...action.payload.data],
            isNext: action.payload.isNext,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.COURSES_ALL_FAILED:
      return {
        ...state,
        courses: {
          loading: false,
          success: {
            data: false,
            isNext: false,
          },
          failed: true,
          error: action.payload,
        },
      };

    case actionType.BOOKMARKED_COURSES_ALL_LOADING:
      return {
        ...state,
        bookmarkedCourses: {
          loading: action.payload,
          success: {
            data: [],
            isNext: false,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.BOOKMARKED_COURSES_ALL_SUCCESS:
      return {
        ...state,
        bookmarkedCourses: {
          loading: false,
          success: {
            data: [
              ...state.bookmarkedCourses.success.data,
              ...action.payload.data,
            ],
            isNext: action.payload.isNext,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.BOOKMARKED_COURSES_ALL_FAILED:
      return {
        ...state,
        bookmarkedCourses: {
          loading: false,
          success: {
            data: false,
            isNext: false,
          },
          failed: true,
          error: action.payload,
        },
      };

    case actionType.TIMELINE_COURSES_ALL_LOADING:
      return {
        ...state,
        timelineCourses: {
          loading: action.payload,
          success: {
            data: [],
            isNext: false,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.TIMELINE_COURSES_ALL_SUCCESS:
      return {
        ...state,
        timelineCourses: {
          loading: false,
          success: {
            data: [
              ...state.timelineCourses.success.data,
              ...action.payload.data,
            ],
            isNext: action.payload.isNext,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.TIMELINE_COURSES_ALL_FAILED:
      return {
        ...state,
        timelineCourses: {
          loading: false,
          success: {
            data: false,
            isNext: false,
          },
          failed: true,
          error: action.payload,
        },
      };

    case actionType.SAMPLE_VIDEOS_ALL_LOADING:
      return {
        ...state,
        sampleVideosAll: {
          loading: action.payload,
          success: {
            data: [],
            isNext: false,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.SAMPLE_VIDEOS_ALL_SUCCESS:
      return {
        ...state,
        sampleVideosAll: {
          loading: false,
          success: {
            data: [
              ...state.sampleVideosAll.success.data,
              ...action.payload.data,
            ],
            isNext: action.payload.isNext,
          },
          failed: false,
          error: [],
        },
      };
    case actionType.SAMPLE_VIDEOS_ALL_FAILED:
      return {
        ...state,
        sampleVideosAll: {
          loading: false,
          success: {
            data: false,
            isNext: false,
          },
          failed: true,
          error: action.payload,
        },
      };
    case actionType.COURSE_LIKE_LOADING:
      return {
        ...state,
        like: {
          loading: true,
          success: false,
          error: [],
        },
      };
    case actionType.COURSE_LIKE_SUCCESS:
      return {
        ...state,
        like: {
          loading: false,
          success: true,
          error: [],
        },
        error: action.payload,
      };

    case actionType.GET_COURSE_DETAILS_LOADING:
      return {
        ...state,
        course: {
          loading: true,
          success: false,
          failed: false,
          error: [],
          course: [],
        },
      };
    case actionType.GET_COURSE_DETAILS_SUCCESS:
      return {
        ...state,
        course: {
          loading: false,
          success: true,
          failed: false,
          error: [],
          course: action.payload.course,
        },
      };
    case actionType.GET_COURSE_DETAILS_FAILED:
      return {
        ...state,
        course: {
          loading: false,
          success: false,
          failed: false,
          error: action.payload,
          course: [],
        },
      };
    case actionType.COURSE_LIKE_FAILED:
      return {
        ...state,
        like: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export * from './courses';
export default reducer;
