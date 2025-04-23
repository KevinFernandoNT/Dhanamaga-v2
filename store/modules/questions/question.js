// import axios from 'axios'
import { Alert } from "react-native";
import { actionType } from "./actions.js";
import { gateAxios } from "../../api";

//Add question courses
export const addQuestion = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.ADD_QUESTION_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/question`, data);
      dispatch({ type: actionType.ADD_QUESTION_SUCCESS, payload: res.data });
      return res;
    } catch (err) {
      console.log("ERROR== IN QUESTION", err?.response);
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({ type: actionType.ADD_QUESTION_FAILED, payload: message });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const viewQuestion = (couseDetails) => {
  const loadData = {
    userId: couseDetails.userId,
    courseId: couseDetails.courseId,
    limit: couseDetails.limit,
  }
  return async dispatch => {
    try {
      dispatch({ type: actionType.VIEW_QUESTION_LOADING, payload: true });
      const res = await gateAxios.post(`api/v1/question/by-user/${couseDetails.pageNo}`,loadData);
      dispatch({ type: actionType.VIEW_QUESTION_SUCCESS, payload: res.data});
      return res.data;
    } catch (err) {
      if (err.response) {
        const message = err.response.data.data[0].messages[0].message;
        dispatch({ type: actionType.VIEW_QUESTION_FAILED, payload: message });
        Alert.alert('', message, [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    }
  };
};
