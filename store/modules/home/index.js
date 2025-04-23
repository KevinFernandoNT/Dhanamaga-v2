import { actionType } from './actions.js';

const initialState = {
  homeLoading: false,
  sampleVideos: {
    loading: false,
    success: [],
    failed: false,
    error: []
  },
  randomTopic: {
    loading: false,
    success: [],
    failed: false,
    error: []
  },
  mostWatchedLessons: {
    loading: false,
    success: [],
    failed: false,
    error: []
  },
  trendingLessons: {
    loading: false,
    success: [],
    failed: false,
    error: []
  },
  currentRoute: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.HOME_SAMPLE_VIDEOS_LOADING:
      return {
        ...state,
        sampleVideos: {
          loading: action.payload,
          success: [],
          failed: false,
          error: []
        }
      };
    case actionType.HOME_SAMPLE_VIDEOS_SUCCESS:
      return {
        ...state,
        sampleVideos: {
          loading: false,
          success: action.payload,
          failed: false,
          error: []
        }
      };
    case actionType.HOME_SAMPLE_VIDEOS_FAILED:
      return {
        ...state,
        sampleVideos: {
          loading: false,
          success: false,
          failed: false,
          error: action.payload
        }
      };
    case actionType.GET_TRENDING_LESSONS_LOADING:
      return {
        ...state,
        trendingLessons: {
          loading: action.payload,
          success: [],
          failed: false,
          error: []
        }
      };
    case actionType.GET_TRENDING_LESSONS_SUCCESS:
      return {
        ...state,
        trendingLessons: {
          loading: false,
          success: action.payload,
          failed: false,
          error: []
        }
      };
    case actionType.GET_TRENDING_LESSONS_FAILED:
      return {
        ...state,
        trendingLessons: {
          loading: false,
          success: false,
          failed: false,
          error: action.payload
        }
      };
    case actionType.GET_MOST_WATCED_LESSONS_LOADING:
      return {
        ...state,
        mostWatchedLessons: {
          loading: action.payload,
          success: [],
          failed: false,
          error: []
        }
      };
    case actionType.GET_MOST_WATCED_LESSONS_SUCCESS:
      return {
        ...state,
        mostWatchedLessons: {
          loading: false,
          success: action.payload,
          failed: false,
          error: []
        }
      };
    case actionType.GET_MOST_WATCED_LESSONS_FAILED:
      return {
        ...state,
        mostWatchedLessons: {
          loading: false,
          success: false,
          failed: false,
          error: action.payload
        }
      };
    case actionType.HOME_RANDOM_TOPIC_LOADING:
      return {
        ...state,
        randomTopic: {
          loading: action.payload,
          success: [],
          failed: false,
          error: []
        }
      };
    case actionType.HOME_RANDOM_TOPIC_SUCCESS:
      return {
        ...state,
        randomTopic: {
          loading: false,
          success: action.payload,
          failed: false,
          error: []
        }
      };
    case actionType.HOME_RANDOM_TOPIC_FAILED:
      return {
        ...state,
        randomTopic: {
          loading: false,
          success: false,
          failed: false,
          error: action.payload
        }
      };
    case actionType.CURRENT_ROUTE:
      return {
        ...state,
        currentRoute: action.payload
      };
    default:
      return state;
  }
};

export * from './home';
export default reducer;

