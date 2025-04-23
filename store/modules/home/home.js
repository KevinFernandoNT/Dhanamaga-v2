// import axios from 'axios'
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionType } from "./actions.js";
import { authAxios, gateAxios } from "../../api";

// authAxios.interceptors.request.use(
//   (config) => {
//     // Log the full URL
//     console.log("Request URL:", config.baseURL + config.url);
//     return config; // Must return the config
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
//get sample lessons of home screen
export const getSampleLessons = (userLanguage) => {
  return async (dispatch) => {
    try {
      const language = {
        language: userLanguage,
      };
      dispatch({ type: actionType.HOME_SAMPLE_VIDEOS_LOADING, payload: true });
      const res = await authAxios.post(
        "api/v1/lessons/sample/random",
        language
      );
      const sampleVideos = res.data.lessons;
      dispatch({
        type: actionType.HOME_SAMPLE_VIDEOS_SUCCESS,
        payload: sampleVideos,
      });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.HOME_SAMPLE_VIDEOS_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

// get most watched videos
export const getmostWatchedLessons = (userLanguage, perPage) => {
  return async (dispatch) => {
    try {
      let data;
      if (perPage) {
        data = {
          language: userLanguage,
          watchedType: "mostWatched",
          perPage: 2,
        };
      } else {
        data = {
          language: userLanguage,
          watchedType: "mostWatched",
        };
      }

      dispatch({
        type: actionType.GET_MOST_WATCED_LESSONS_LOADING,
        payload: true,
      });
      const res = await authAxios.post("api/v1/watched-lessons/1", data);
      const mostWatcheVideos = res.data.lessons;
      dispatch({
        type: actionType.GET_MOST_WATCED_LESSONS_SUCCESS,
        payload: mostWatcheVideos,
      });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.GET_MOST_WATCED_LESSONS_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

// get trending  videos
export const getTrendingLessons = (userLanguage, perPage) => {
  return async (dispatch) => {
    try {
      let data;
      if (perPage) {
        data = {
          language: userLanguage,
          watchedType: "trending",
          perPage: 2,
        };
      } else {
        data = {
          language: userLanguage,
          watchedType: "trending",
        };
      }

      dispatch({
        type: actionType.GET_TRENDING_LESSONS_LOADING,
        payload: true,
      });
      const res = await authAxios.post("api/v1/watched-lessons/1", data);
      const trendingVideos = res.data.lessons;
      dispatch({
        type: actionType.GET_TRENDING_LESSONS_SUCCESS,
        payload: trendingVideos,
      });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.GET_TRENDING_LESSONS_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

//get random topic of home screen
export const getRandomTopic = (userLanguage) => {
  return async (dispatch) => {
    try {
      const user = await AsyncStorage.getItem("auth_user");
      if (user) {
        const currentUser = JSON.parse(user);
        const userData = {
          userId: currentUser._id,
          language: userLanguage,
        };

        dispatch({ type: actionType.HOME_RANDOM_TOPIC_LOADING, payload: true });
        const res = await authAxios.post("api/v1/courses/random", userData);
        const randomTopic = res.data.course;
        dispatch({
          type: actionType.HOME_RANDOM_TOPIC_SUCCESS,
          payload: randomTopic,
        });
        return res;
      } else {
        const userData = {
          language: userLanguage,
        };
        dispatch({ type: actionType.HOME_RANDOM_TOPIC_LOADING, payload: true });
        const res = await authAxios.post("api/v1/courses/random", userData);

        const randomTopic = res.data.course;
        dispatch({
          type: actionType.HOME_RANDOM_TOPIC_SUCCESS,
          payload: randomTopic,
        });
        return res;
      }
    } catch (err) {
      if (err) {
        //MyFIx: error response path
        const message = err?.response?.data?.message ?? "Something went wrong";
        dispatch({
          type: actionType.HOME_RANDOM_TOPIC_FAILED,
          payload: message,
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const currentRoute = (route) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.CURRENT_ROUTE, payload: route });
    } catch (err) {
      console.warn("test");
    }
  };
};
