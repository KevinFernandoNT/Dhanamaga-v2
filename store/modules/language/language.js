// import axios from 'axios'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actionType } from './actions.js';
import { authAxios, gateAxios, photoAxios } from '../../api';
import { showMessage } from "react-native-flash-message";

export const handleLanguage = () => {
  return async dispatch => {
    try {
      dispatch({ type: actionType.LANGUAGE_SET_LOADING, payload: true });
      const res = await authAxios.get(`api/v1/initialsettings`)
      dispatch({ type: actionType.LANGUAGE_SET_SUCCESS, payload: res.data });
      return res.data
    } catch (err) {
      if (err.response) {
        dispatch({ type: actionType.LANGUAGE_SET_FAILED, payload: err.response });
        showMessage({
          message: err.response.data.message,
          type: "warn",
          position: 'bottom'
        });
      }
    }
  }
}

