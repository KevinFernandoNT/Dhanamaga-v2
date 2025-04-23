// import axios from 'axios'
import { Alert } from "react-native";
import { actionType } from "./actions.js";
import { authAxios, gateAxios } from "../../api";
import { showMessage } from "react-native-flash-message";

//get all courses page wise
export const getLessonsByCourse = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionType.GET_LESSONS_BY_COURSE_LOADING,
        payload: true,
      });
      let res;
      if (data.userId) {
        res = await gateAxios.post(`api/v1/lessons/by-course`, data);
      } else {
        res = await authAxios.post(`api/v1/lessons/by-course`, data);
      }
      dispatch({
        type: actionType.GET_LESSONS_BY_COURSE_SUCCESS,
        payload: res.data,
      });
      return res;
    } catch (err) {
      // console.warn('ERROR==', err);
      if (err.response) {
        console.log("ERROR >>> ", err);
        const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.GET_LESSONS_BY_COURSE_FAILED,
          payload: message,
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const updateWatchStatus = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionType.UPDATE_LESSONS_WATCHIG_STATUS_LOADING,
        payload: true,
      });
      const res = await gateAxios.post(
        `api/v1/lessonwatchstatuses/update`,
        data
      );
      dispatch({
        type: actionType.UPDATE_LESSONS_WATCHIG_STATUS_SUCCESS,
        payload: res.data,
      });
      return res;
    } catch (err) {
      if (err.response) {
        console.log("ERRRP on watch status", err);
        // const message = err.response.data.data[0].messages[0].message;
        dispatch({
          type: actionType.UPDATE_LESSONS_WATCHIG_STATUS_FAILED,
          payload: "Something went wrong!",
        });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const addBookMark = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.ADD_BOOK_MARK_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/bookmark`, data);
      dispatch({ type: actionType.ADD_BOOK_MARK_SUCCESS, payload: res.data });
      showMessage({
        message: res.data.message,
        type: "success",
        position: "bottom",
      });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.ADD_BOOK_MARK_FAILED,
          payload: err.response,
        });
        showMessage({
          message: err.response,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};

export const updateRating = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.UPDATE_RATING_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/review`, data);
      dispatch({ type: actionType.UPDATE_RATING_SUCCESS, payload: res.data });
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.UPDATE_RATING_FAILED,
          payload: err.response,
        });
        showMessage({
          message: err.response,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};

export const lessonLike = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.LESSON_LIKE_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/lessonlikes`, data);
      dispatch({ type: actionType.LESSON_LIKE_SUCCESS, payload: res.data });
    } catch (err) {
      if (err.response) {
        dispatch({ type: actionType.LESSON_LIKE_FAILED, payload: err.message });
        showMessage({
          message: err.message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};

export const lessonReview = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.LESSON_REVIEW_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/lessonreviews`, data);
      dispatch({ type: actionType.LESSON_REVIEW_SUCCESS, payload: res.data });
    } catch (err) {
      if (err.response) {
        console.log("ERROR ON Lesson review ", err);
        dispatch({
          type: actionType.LESSON_REVIEW_FAILED,
          payload: err.message,
        });
        showMessage({
          message: err.message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};
