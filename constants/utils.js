import { Platform, StatusBar } from 'react-native';
import { theme } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';
import {en} from './languages/english.json'
import {si} from './languages/sinhala.json'
import {ta} from './languages/tamil.json'

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = theme.SIZES.BASE * 3.5 + (StatusHeight || 0);
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);

export const countConvert = value => {
    let count;
    let countText;
    if (value >= 1000 && value < 1000000) {
      count = value / 1000;
      return (countText = `${parseFloat(count.toFixed(1))}K`);
    } else if (value >= 1000000) {
      count = value / 1000000;
      return (countText = `${parseFloat(count.toFixed(1))}M`);
    } else {
      return (countText = value);
    }
};

export const languageSetter = async (stringValue) => {
  i18n.translations = {
    en,
    si,
    ta
  }

  const defaultLang = await AsyncStorage.getItem('selectedLanguage')
      i18n.locale = defaultLang
      i18n.fallbacks = true

      return i18n.t(stringValue)
}