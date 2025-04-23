import { actionType } from './actions.js';
import sinhala from '../../../constants/languages/sinhala.json'
import english from '../../../constants/languages/english.json'
import tamil from '../../../constants/languages/tamil.json'

const initialState = {
  languageSet: {
    loading: false,
    sinhala: sinhala.si,
    english: english.en,
    tamil: tamil.ta,
    falied: false,
    success:false,
    error: [],
    iosVersion: '',
    androidVersion: ''
  },
  heroImageSet: {
    heroImageE: [],
    heroImageT: [],
    heroImageS: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.LANGUAGE_SET_LOADING:
      return {
        ...state,
        languageSet: {
          loading: action.payload,
          sinhala: {},
          english: {},
          tamil: {},
          falied: false,
          success:false,
          error: [],
          iosVersion: '',
          androidVersion: ''
        },
        heroImageSet: {
          heroImageE: [],
          heroImageT: [],
          heroImageS: []
        }
      };
    case actionType.LANGUAGE_SET_SUCCESS:
      let sinhalaSet
      let tamilSet
      let englishSet
      let sinhalaImgSet
      let tamilImgSet
      let englishImgSet
      action.payload.data.settings.map(data => {
        if (data.keyWords.si) {
           sinhalaSet = data.keyWords
          sinhalaImgSet = data.heroImage ? data.heroImage : []
        } else if (data.keyWords.en) {
           englishSet = data.keyWords
          englishImgSet = data.heroImage ? data.heroImage : []
        } else {
           tamilSet = data.keyWords
          tamilImgSet = data.heroImage ? data.heroImage : []
        }
      })
      return {
        ...state,
        languageSet: {
          loading: false,
          sinhala: sinhalaSet,
          english: englishSet,
          tamil: tamilSet,
          falied: false,
          success:true,
          error: [],
          iosVersion: action.payload.data.appVersions.iosVersion,
          androidVersion: action.payload.data.appVersions.androidVersion
        },
        heroImageSet: {
          heroImageE: englishImgSet,
          heroImageT: tamilImgSet,
          heroImageS: sinhalaImgSet,
        }
      };
    case actionType.LANGUAGE_SET_FAILED:
      return {
        ...state,
        languageSet: {
          loading: false,
          success:false,
          sinhala: {},
          english: {},
          tamil: {},
          falied: true,
          error: action.payload,
          iosVersion: '',
          androidVersion: ''
        },
        heroImageSet: {
          heroImageE: [],
          heroImageT: [],
          heroImageS: []
        }
      };
    default:
      return state;
  }
};

export * from './language';
export default reducer;
