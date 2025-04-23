// import axios from 'axios'
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionType } from "./actions.js";
import { authAxios, gateAxios } from "../../api";

//get all courses page wise
export const getAllCourses = (userLanguage, pageNo, search) => {
  return async (dispatch) => {
    try {
      const user = await AsyncStorage.getItem("auth_user");
      if (user) {
        const currentUser = JSON.parse(user);
        const userData = {
          userId: currentUser._id,
          searchText:
            search == undefined || search == "Components" ? "" : search,
          language: userLanguage,
          pageNo: pageNo == "All" ? 1 : pageNo,
          isAll: pageNo == "All" ? true : false,
        };
        dispatch({ type: actionType.COURSES_ALL_LOADING, payload: true });
        const res = await authAxios.post(
          `api/v1/courses/all/${pageNo}`,
          userData
        );
        const coursesList = res.data.courses.courses;
        const isNextPage = res.data.courses.isNextPage;
        dispatch({
          type: actionType.COURSES_ALL_SUCCESS,
          payload: { data: coursesList, isNext: isNextPage },
        });
        return res;
      } else {
        const userData = {
          searchText:
            search == undefined || search == "Components" ? "" : search,
          language: userLanguage,
        };
        dispatch({ type: actionType.COURSES_ALL_LOADING, payload: true });
        const res = await authAxios.post(
          `api/v1/courses/all/${pageNo}`,
          userData
        );
        const coursesList = res.data.courses.courses;
        const isNextPage = res.data.courses.isNextPage;
        dispatch({
          type: actionType.COURSES_ALL_SUCCESS,
          payload: { data: coursesList, isNext: isNextPage },
        });
        return res;
      }
    } catch (err) {
      dispatch({ type: actionType.COURSES_ALL_LOADING, payload: false });
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({ type: actionType.COURSES_ALL_FAILED, payload: message });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const getAllBookmarkedCourses = (userLanguage, pageNo) => {
  return async (dispatch) => {
    try {
      const user = await AsyncStorage.getItem("auth_user");
      if (user) {
        const currentUser = JSON.parse(user);
        const userData = {
          language: userLanguage,
          searchText: "",
        };
        dispatch({
          type: actionType.BOOKMARKED_COURSES_ALL_LOADING,
          payload: true,
        });
        const res = await gateAxios.post(
          `api/v1/bookmark/${currentUser._id}/${pageNo}`,
          userData
        );
        const coursesList = res.data.data;
        const isNextPage = res.data.isNextPage;
        dispatch({
          type: actionType.BOOKMARKED_COURSES_ALL_SUCCESS,
          payload: { data: coursesList, isNext: isNextPage },
        });
        return res;
      }
    } catch (err) {
      dispatch({
        type: actionType.BOOKMARKED_COURSES_ALL_LOADING,
        payload: false,
      });
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.BOOKMARKED_COURSES_ALL_FAILED,
          payload: message,
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const getAllTimelineCourses = (userLanguage, pageNo) => {
  return async (dispatch) => {
    try {
      const user = await AsyncStorage.getItem("auth_user");
      if (user) {
        const currentUser = JSON.parse(user);
        const userData = {
          userId: currentUser._id,
          language: userLanguage,
          searchText: "",
        };
        dispatch({
          type: actionType.TIMELINE_COURSES_ALL_LOADING,
          payload: true,
        });
        const res = await gateAxios.post(
          `api/v1/courses/ongoing/${pageNo}`,
          userData
        );
        const coursesList = res.data.courses.courses;
        const isNextPage = res.data.courses.isNextPage;
        dispatch({
          type: actionType.TIMELINE_COURSES_ALL_SUCCESS,
          payload: { data: coursesList, isNext: isNextPage },
        });
        return res;
      }
    } catch (err) {
      dispatch({
        type: actionType.TIMELINE_COURSES_ALL_LOADING,
        payload: false,
      });
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.TIMELINE_COURSES_ALL_FAILED,
          payload: message,
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const getAllSampleVideos = (userLanguage, pageNo) => {
  return async (dispatch) => {
    try {
      const userData = {
        searchText: "",
        language: userLanguage,
      };
      dispatch({ type: actionType.SAMPLE_VIDEOS_ALL_LOADING, payload: true });
      const res = await authAxios.post(
        `api/v1/lessons/sample/${pageNo}`,
        userData
      );
      const coursesList = res.data.lessons.lessons;
      const isNextPage = res.data.lessons.isNextPage;
      dispatch({
        type: actionType.SAMPLE_VIDEOS_ALL_SUCCESS,
        payload: { data: coursesList, isNext: isNextPage },
      });
      return res;
    } catch (err) {
      dispatch({ type: actionType.SAMPLE_VIDEOS_ALL_LOADING, payload: false });
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.SAMPLE_VIDEOS_ALL_FAILED,
          payload: message,
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const likeCourse = (data) => {
  return async (dispatch) => {
    try {
      const likeData = {
        course: data.course,
        user: data.user,
        liked: data.liked,
      };
      dispatch({ type: actionType.COURSE_LIKE_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/likes`, likeData);
      dispatch({ type: actionType.COURSE_LIKE_SUCCESS });
      return res;
    } catch (err) {
      dispatch({ type: actionType.COURSE_LIKE_LOADING, payload: false });
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({ type: actionType.COURSE_LIKE_FAILED, payload: message });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const getCourse = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.GET_COURSE_DETAILS_LOADING, payload: true });
      let res;
      if (data.userId) {
        res = await gateAxios.post(`api/v1/courses/details`, data);
      } else {
        res = await authAxios.post(`api/v1/courses/details`, data);
      }
      dispatch({
        type: actionType.GET_COURSE_DETAILS_SUCCESS,
        payload: res.data,
      });
      return res;
    } catch (err) {
      dispatch({ type: actionType.GET_COURSE_DETAILS_FAILED, payload: true });
      if (err.response) {
        console.log("ERROR ON DETAILS >> ", err);
        const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.SAMPLE_VIDEOS_ALL_FAILED,
          payload: message,
        });

        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};
