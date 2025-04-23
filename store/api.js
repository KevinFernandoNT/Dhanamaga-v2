import axios from 'axios';
import {constants} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as RootNavigation from '../layout/common/tabNav';

const authAxios = axios.create({
  baseURL: constants.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const gateAxios = axios.create({
  baseURL: constants.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const photoAxios = axios.create({
  baseURL: constants.API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 10000,
});

gateAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    try {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (err) {
      if (err.response) {
        await AsyncStorage.removeItem("token");
        // RootNavigation.navigate('LiveScreen');
      }
    }
  } else {
    // console.warn('no token');
  }
});

photoAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    try {
      config.headers.Authorization = `Bearer ${token}`;
      delete config.headers.post["Content-Type"];
      // delete config.headers.common['Content-Type'];
      return config;
    } catch (err) {
      if (err.response) {
        await AsyncStorage.removeItem("token");
        // RootNavigation.navigate('LiveScreen');
      }
    }
  } else {
    console.warn("no token");
  }
});

export { authAxios, gateAxios, photoAxios };
