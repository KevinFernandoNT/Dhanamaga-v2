// import axios from 'axios'
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionType } from "./actions.js";
import { authAxios, gateAxios, photoAxios } from "../../api";
import { showMessage } from "react-native-flash-message";
import { constants } from "../../../constants";
import { registerForPushNotificationsAsync } from "../../../constants";

import i18n from "i18n-js";

import sinhala from "../../../constants/languages/sinhala.json";
import english from "../../../constants/languages/english.json";
import tamil from "../../../constants/languages/tamil.json";

//user register
export const registerUser = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.AUTH_SIGNUP_LOADING, payload: true });
      const res = await authAxios.post("auth/local/register", data);
      dispatch({ type: actionType.AUTH_TOKEN, payload: true });
      const user = res.data;
      dispatch({ type: actionType.AUTH_SIGNUP_SUCCESS, payload: res.data });

      await AsyncStorage.setItem("token", user.jwt ? user.jwt : "");
      await AsyncStorage.setItem("auth_name", user.user.fullName);
      await AsyncStorage.setItem("auth_id", user.user._id ? user.user._id : "");
      await AsyncStorage.setItem(
        "selectedLanguage",
        user.user.language ? user.user.language : "en"
      );
      await AsyncStorage.setItem("auth_user", JSON.stringify(user.user));
      dispatch({ type: actionType.AUTH_USER, payload: res.data.user });
      let tokenNotification = await registerForPushNotificationsAsync();
      let userDetais = {
        notificationToken: tokenNotification,
      };
      const resUser = await gateAxios.put(`users/${user.user._id}`, userDetais);
      if (resUser) {
        await AsyncStorage.setItem("fcm_token", tokenNotification);
        return res;
      }
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.AUTH_SIGNUP_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

export const setUserLanguage = (userLanguage) => {
  return async (dispatch) => {
    dispatch({ type: actionType.AUTH_CURRENT_LANGUAGE, payload: userLanguage });
    try {
      const userId = await AsyncStorage.getItem("auth_id");
      console.log("USERID", userId);
      const language = {
        language: userLanguage,
      };
      dispatch({ type: actionType.AUTH_LANGUAGE_LOADING, payload: true });
      const res = await gateAxios.put(`users/${userId}`, language);
      const userLan = res.data.language;
      dispatch({ type: actionType.AUTH_LANGUAGE_SUCCESS, payload: userLan });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.AUTH_LANGUAGE_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

export const loginUser = (loginDetails) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.AUTH_LOGIN_LOADING, payload: true });
      const res = await authAxios.post("auth/local", loginDetails);
      const user = res.data;
      if (user) {
        await AsyncStorage.setItem("token", user.jwt ? user.jwt : "");
        await AsyncStorage.setItem("auth_name", user.user.fullName);
        await AsyncStorage.setItem(
          "auth_user_name",
          user.user.username ? user.user.username : "Unknown"
        );
        await AsyncStorage.setItem(
          "auth_id",
          user.user._id ? user.user._id : ""
        );
        await AsyncStorage.setItem(
          "selectedLanguage",
          user.user.language ? user.user.language : "en"
        );
        await AsyncStorage.setItem("auth_user", JSON.stringify(user.user));
        await AsyncStorage.setItem(
          "auth_profileImage",
          user.profileImage ? user.profileImage : ""
        );

        dispatch({ type: actionType.AUTH_LOGIN_SUCCESS, payload: res.data });
        dispatch({ type: actionType.AUTH_TOKEN, payload: true });
        dispatch({ type: actionType.AUTH_USER, payload: res.data.user });
        let tokenNotification = await registerForPushNotificationsAsync();
        let userDetais = {
          notificationToken: tokenNotification,
        };
        const resUser = await gateAxios.put(
          `users/${user.user._id}`,
          userDetais
        );
        if (resUser) {
          await AsyncStorage.setItem("fcm_token", tokenNotification);
          return res;
        }
        // return res;
      } else {
        dispatch({
          type: actionType.AUTH_LOGIN_FAILED,
          payload: "Can not find the user",
        });
        dispatch({ type: actionType.AUTH_TOKEN, payload: false });
        dispatch({ type: actionType.AUTH_USER, payload: null });
        return res;
      }
    } catch (err) {
      console.log("ERROR In LOGIN >>>", err.response.data);
      if (err.response) {
        dispatch({ type: actionType.AUTH_LOGIN_FAILED, payload: err.response });
        dispatch({ type: actionType.AUTH_TOKEN, payload: false });
        dispatch({ type: actionType.AUTH_USER, payload: null });
        return err.response;
      }
    }
  };
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionType.AUTH_RESET_PASSWORD_LOADING, payload: true });
      const res = await authAxios.post("auth/forgot-password", email);
      dispatch({ type: actionType.AUTH_RESET_PASSWORD_SUCCESS, payload: true });
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.AUTH_RESET_PASSWORD_FAILED,
          payload: err.response,
        });
      }
    }
  };
};

export const resetToken = () => {
  return async (dispatch) => {
    try {
      const authId = await AsyncStorage.getItem("auth_id");
      let userDetais = {
        notificationToken: null,
      };
      const res = await gateAxios.put(`users/${authId}`, userDetais);
      return res;
    } catch (err) {
      if (err) {
        const message = err;
        dispatch({ type: actionType.AUTH_LOGOUT_FAILED, payload: message });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("auth_user");
      await AsyncStorage.removeItem("fcm_token");
      dispatch({ type: actionType.AUTH_USER, payload: null });
      return;
    } catch (err) {
      if (err) {
        console.log("ERRORS in LOGOUT >>", err);
        const message = err;
        dispatch({ type: actionType.AUTH_LOGOUT_FAILED, payload: message });
        Alert.alert("", message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    }
  };
};

export const proPicUpload = (data) => {
  return async (dispatch, getState) => {
    const state = getState();
    const languageSet = state.language.languageSet;
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    try {
      dispatch({ type: actionType.PRO_PIC_LOADING, payload: true });
      const res = await photoAxios.post("upload", data);
      const updateUrl = {
        profileImage: res.data[0].url,
      };
      const authId = await AsyncStorage.getItem("auth_id");
      const resUser = await gateAxios.put(`users/${authId}`, updateUrl);
      dispatch({ type: actionType.PRO_PIC_SUCCESS, payload: resUser.data });
      dispatch({ type: actionType.AUTH_USER, payload: resUser.data });
      showMessage({
        message: i18n.t("profile_image_upload_success"),
        type: "success",
        position: "bottom",
      });
      await AsyncStorage.setItem("auth_user", JSON.stringify(resUser.data));
    } catch (err) {
      if (err.response) {
        dispatch({ type: actionType.PRO_PIC_FAILED, payload: err.response });
        showMessage({
          message: err.response,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};

export const userDataUpdate = (data) => {
  return async (dispatch, getState) => {
    const state = getState();
    const languageSet = state.language.languageSet;
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    try {
      dispatch({ type: actionType.AUTH_LOGIN_LOADING, payload: true });
      const authId = await AsyncStorage.getItem("auth_id");
      const resUser = await gateAxios.put(`users/${authId}`, data);
      const user = resUser.data;
      dispatch({ type: actionType.AUTH_SIGNUP_SUCCESS, payload: resUser.data });
      dispatch({ type: actionType.AUTH_USER, payload: resUser.data });
      await AsyncStorage.setItem("auth_name", user.fullName);
      await AsyncStorage.setItem("auth_user_name", user.username);
      await AsyncStorage.setItem("auth_id", user.id);
      await AsyncStorage.setItem("auth_user", JSON.stringify(user));
      await AsyncStorage.setItem("selectedLanguage", user.language);
      user.profileImage
        ? await AsyncStorage.setItem(
            "auth_profileImage",
            user.profileImage ? user.profileImage : null
          )
        : null;

      showMessage({
        message: i18n.t("user_update_success"),
        type: "success",
        position: "bottom",
      });
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.AUTH_SIGNUP_SUCCESS,
          payload: err.response,
        });
        showMessage({
          message: err.response.data.message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};

export const changePassword = (changePassowrd) => {
  return async (dispatch, getState) => {
    const state = getState();
    const languageSet = state.language.languageSet;
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    try {
      dispatch({
        type: actionType.AUTH_CHANGE_PASSWORD_LOADING,
        payload: true,
      });
      const res = await gateAxios.post(`/api/v1/password`, changePassowrd);
      if (res) {
        dispatch({
          type: actionType.AUTH_CHANGE_PASSWORD_SUCCESS,
          payload: res,
        });
        await AsyncStorage.setItem("token", res.data.jwt);
        showMessage({
          message: i18n.t("change_password_success"),
          type: "success",
          position: "bottom",
        });
        await AsyncStorage.setItem("token", res.data.jwt);
        showMessage({
          message: "Password change successfully",
          type: "success",
          position: "bottom",
        });
        return res;
      }
      return res;
    } catch (err) {
      if (err.response) {
        dispatch({
          type: actionType.AUTH_CHANGE_PASSWORD_FAILED,
          payload: err.response,
        });
        showMessage({
          message: err.response.data.message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };
};
