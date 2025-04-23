import { actionType } from './actions.js';

const initialState = {
  login: {
    loading: false,
    success: [],
    falied: false,
    error: []
  },
  signup: {
    loading: false,
    success: [],
    falied: false,
    error: []
  },
  language: {
    loading: false,
    success: [],
    falied: false,
    error: []
  },
  logout: {
    loading: false,
    success: false,
    falied: false,
    error: []
  },
  resetPassword: {
    loading: false,
    success: false,
    falied: false,
    error: []
  },

  proPic: {
    loading: false,
    success: false,
    falied: false,
    error: []
  },
  user: null,
  chnagePassword: {
    loading: false,
    success: false,
    falied: false,
    error: []
  },
  languageSet: {
    loading: false,
    //   sinhala: {
    //     "si": {
    //       "common_email": "විද්යුත් තැපෑල",
    //       "common_password": "මුරපදය",
    //       "common_viewAll": "සියල්ල බලන්න",
    //       "common_loadMore": "තව පෙන්වන්න...",

    //       "language_screen_title": "භාෂාව තෝරන්න",
    //       "language_screen_btn_title": "ඉදිරියට",

    //       "login_screen_title": "විද්‍යුත් තැපැල් ලිපිනය සමඟ log වන්න",
    //       "login_screen_forgotPassword": "මුරපදය අමතක වුණාද ?",
    //       "login_screen_signIn": "ඇතුල් වන්න",
    //       "login_screen_notRegisteredYet": "තවම ලියාපදිංචි වී නැත ?",
    //       "login_screen_signUpNow": "දැන් ලියාපදිංචි වන්න",

    //       "signup_screen_title": "විද්‍යුත් තැපැල් ලිපිනය සමඟ ලියාපදිංචි වන්න",
    //       "signup_screen_fullName": "සම්පූර්ණ නම",
    //       "signup_screen_confirmPassword": "මුරපදය තහවුරු කරන්න",
    //       "signup_screen_agreeToTerms": "මම නියමයන් හා කොන්දේසි වලට එකඟ වෙමි",
    //       "signup_screen_getStarted": "ආරම්භ කරන්න",
    //       "signup_screen_alreadyRegistered": "දැනටමත් ලියාපදිංචි වී ඇත ?",
    //       "signup_screen_signInNow": "දැන් log වන්න",

    //       "home_screen_courses": "මාතෘකා",
    //       "home_screen_sampleVideos": "අපගේ වීඩියෝ",
    //       "home_screen_searchPlaceholder": "ඔබ සොයන්නෙ කුමක් ද?",

    //       "corseDetails_screen_textAreaPlaceholder": "ඔබේ ප්‍රශ්නය",
    //       "corseDetails_screen_send": "යවන්න",
    //       "corseDetails_screen_addToBookmark": "පිටු සලකුණට එක් කරන්න",
    //       "corseDetails_screen_reviewThisCourse": "මෙම පාඨමාලාව සමාලෝචනය කරන්න",
    //       "corseDetails_screen_tab1": "පාඩම්",
    //       "corseDetails_screen_tab2": "ප්‍රශ්න",
    //       "corseDetails_screen_tab3": "තව",

    //       "drawer_viewProfile": "පැතිකඩ බලන්න",
    //       "drawer_yourLanguage": "ඔබගේ භාෂාව",
    //       "drawer_followUsOn": "අපව අනුගමනය කරන්න",
    //       "drawer_home": "මුල් පිටුව",
    //       "drawer_courseDetails": "මාතෘකා විස්තර",
    //       "drawer_myTimeline": "මගේ කාල නියමය",
    //       "drawer_myBookmarked": "මගේ පිටු සලකුණු",
    //       "drawer_termsOfUse": "කොන්දේසි",
    //       "drawer_privacyPolicy": "ආරක්ෂක ප්‍රතිපත්තිය",
    //       "drawer_disclaimer": "වගකීමෙන් මිදීමේ ප්‍රකාශය",
    //       "drawer_logout": "ඉවත් වන්න",

    //       "header_login": "LOG වෙන්න",
    //       "header_signUp": "ලියාපදිංචි වන්න",
    //       "header_createAcount": "ගිණුම තනන්න",
    //       "header_languageSelect": "භාෂා තේරීම",
    //       "header_home": "මුල් පිටුව",
    //       "header_profile": "පැතිකඩ",
    //       "header_courseDetails": "මාතෘකා විස්තර",
    //       "header_courses": "මාතෘකාව",
    //       "header_myTimeline": "මගේ කාල නියමය",
    //       "header_myBookmarked": "මගේ පිටු සලකුණු",
    //       "header_sampleVideos": "අපගේ වීඩියෝ",
    //       "header_serch_result_of": "සෙවුම් ප්රතිපල :",
    //       "header_resetPassword": "මුරපදය නැවත සකසන්න",
    //       "header_changePassword": "මුරපදය වෙනස් කරන්න",

    //       "profile_fullName": "සම්පූර්ණ නම",
    //       "profile_dob": "උපන්දිනය",
    //       "profile_updateProfile": "පැතිකඩ යාවත්කාලීන කරන්න",

    //       "reset_Password_title": "ඔබේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කර උපදෙස් ලබා ගැනීමට ඉදිරිපත් කරන්න",
    //       "reset_Password_btn": "ඉදිරිපත් කරන්න",

    //       "onboarding_getIn": "ඉදිරියට",

    //       "empty_message_courses": "මාතෘකා කිසිවක් හමු නොවීය",
    //       "empty_message_search": "මෙම සෙවීම සඳහා ප්‍රතිපල හමු නොවීය",
    //       "empty_message_timeline": "ඔබගේ කාලරාමුවෙහි කිසිදු මාතෘකාවක් හමු නොවීය",
    //       "empty_message_bookmarked": "ඔබ වෙනුවෙන් පිටු සලකුණු කළ මාතෘකා කිසිවක් හමු නොවීය",
    //       "empty_message_sampleVideos": "නියැදි වීඩියෝ කිසිවක් ලබා දී නොමැත",

    //       "email": "වලංගු විද්යුත් තැපැල් ලිපිනයක් ඇතුලත් කරන්න",
    //       "required": "මෙම පිරවීම අනිවාර්ය වේ",
    //       "equalPassword": "මුරපද වෙනස් ය",

    //       "change_password_title":"මුරපදය වෙනස් කරන්න",
    //       "change_password_button_title":"මුරපදය වෙනස් කරන්න",
    //       "change_password_current_password":"වත්මන් මුරපදය",
    //       "change_password_new_password":"නවතම මුරපදය",
    //       "change_password_confirm_password":"මුරපදය තහවුරු කරන්න",

    //       "course_details_not_authorizes_to_play":"මෙම පාඩම නැරඹීමට අවසර නැත, කරුණාකර පුරනය වන්න",
    //       "something_went_wrong": "යම්කිසි වැරැද්දක් සිදුවිය",
    //       "course_details_please_login_to_Add_Bookmark" : "කරුණාකර පොත් සලකුණ එක් කිරීමට පුරනය වන්න",
    //       "course_details_please_login_to_Add_Question" :"ප්‍රශ්න එකතු කිරීමට කරුණාකර පුරනය වන්න",
    //       "change_language_success": "භාෂාව සාර්ථකව වෙනස් විය",
    //       "login_success":"පුරනය වීම සාර්ථකයි",
    //       "registation_success":"සාර්ථකව ලියාපදිංචි වී ඇත",
    //       "reset_password_send_details":"උපදෙස් ඔබේ විද්‍යුත් තැපෑලට සාර්ථකව යවන ලදි",
    //       "profile_image_upload_success":"පැතිකඩ රූප උඩුගත කිරීම සාර්ථකව සිදු විය",
    //       "user_update_success":"පරිශීලකයා සාර්ථකව යාවත්කාලීන කරන ලදි",
    //       "change_password_success":"මුරපදය සාර්ථකව වෙනස් කරන ලදි "
    //     }
    // },
    //   english: {
    //     "en": {
    //       "common_email": "Email",
    //       "common_password": "Password",
    //       "common_viewAll": "View All",
    //       "common_loadMore": "Load More...",

    //       "language_screen_title": "Select the language",
    //       "language_screen_btn_title": "Continue",

    //       "login_screen_title": "Sign in with Email address",
    //       "login_screen_forgotPassword": "Forgot password ?",
    //       "login_screen_signIn": "Sign in",
    //       "login_screen_notRegisteredYet": "Not Registered yet ?",
    //       "login_screen_signUpNow": "Sign up now",

    //       "signup_screen_title": "Sign up with Email address",
    //       "signup_screen_fullName": "Full name",
    //       "signup_screen_confirmPassword": "Confirm Password",
    //       "signup_screen_agreeToTerms": "I agree to the terms and conditions",
    //       "signup_screen_getStarted": "Get Started",
    //       "signup_screen_alreadyRegistered": "Already Registered ?",
    //       "signup_screen_signInNow": "Sign in now",

    //       "home_screen_courses": "Topics",
    //       "home_screen_sampleVideos": "Sample Videos",
    //       "home_screen_searchPlaceholder": "What are you looking for?",

    //       "corseDetails_screen_textAreaPlaceholder": "Your Question",
    //       "corseDetails_screen_send": "Send",
    //       "corseDetails_screen_addToBookmark": "Add to bookmark",
    //       "corseDetails_screen_reviewThisCourse": "Review this course",
    //       "corseDetails_screen_tab1": "Lessons",
    //       "corseDetails_screen_tab2": "Questions",
    //       "corseDetails_screen_tab3": "More",

    //       "drawer_viewProfile": "View Profile",
    //       "drawer_yourLanguage": "YOUR LANGUAGE",
    //       "drawer_followUsOn":"FOLLOW US ON",
    //       "drawer_home": "Home",
    //       "drawer_courseDetails": "Topic Details",
    //       "drawer_myTimeline": "My Timeline",
    //       "drawer_myBookmarked": "My Bookmarked",
    //       "drawer_termsOfUse": "Terms of use",
    //       "drawer_privacyPolicy": "Privacy Policy",
    //       "drawer_disclaimer": "Disclaimer",
    //       "drawer_logout": "LOGOUT",

    //       "header_login": "Login",
    //       "header_signUp": "Sign Up",
    //       "header_createAcount": "Create Account",
    //       "header_languageSelect": "Language Select",
    //       "header_home": "Home",
    //       "header_profile": "Profile",
    //       "header_courseDetails": "Topic Details",
    //       "header_courses": "Topics",
    //       "header_myTimeline": "My Timeline",
    //       "header_myBookmarked": "My Bookmarked",
    //       "header_sampleVideos": "Sample Videos",
    //       "header_serch_result_of": "Search Result of :",
    //       "header_resetPassword": "Reset Your Password",
    //       "header_changePassword": "Change Password",

    //       "profile_fullName": "Full name",
    //       "profile_dob": "DOB",
    //       "profile_updateProfile": "Update Profile",

    //       "reset_Password_title": "Enter your Email address and submit to recieve instructions",
    //       "reset_Password_btn": "Submit",

    //       "onboarding_getIn": "Get In",

    //       "empty_message_courses": "No topics found",
    //       "empty_message_search": "No results found for this search",
    //       "empty_message_timeline": "No any topics found in your timeline",
    //       "empty_message_bookmarked": "No any bookmarked topics found for you",
    //       "empty_message_sampleVideos": "No any sample videos given",

    //       "email": "Enter a valid email address",
    //       "required": "This field is mandatory",
    //       "equalPassword": "Passwords are different",

    //       "change_password_title":"Change Password",
    //       "change_password_button_title":"Change Password",
    //       "change_password_current_password":"Current Password",
    //       "change_password_new_password":"New Password",
    //       "change_password_confirm_password":"Confirm Password",

    //       "course_details_not_authorizes_to_play":"This Lesson is not authorized to play, Please login",
    //       "something_went_wrong" : "Something went wrong",
    //       "course_details_please_login_to_Add_Bookmark":"Please login to Add Bookmark",
    //       "course_details_please_login_to_Add_Question":"Please Login to Ask Questions",
    //       "change_language_success": "The language changed successfully",
    //       "login_success":"Login Success",
    //       "registation_success": "successfully registered ",
    //       "reset_password_send_details":"Instructions successfully sent to your email",
    //       "profile_image_upload_success":"Profile image upload successfully",
    //       "user_update_success":"User updated successfully",
    //       "change_password_success":"Password changed successfully"

    //     }
    // },
    //   tamil: {
    //     "ta": {
    //       "common_email": "மின்னஞ்சல்",
    //       "common_password": "கடவுச்சொல்",
    //       "common_viewAll": "அனைத்தையும் பார்க்க",
    //       "common_loadMore": "மேலும் காட்ட...",

    //       "language_screen_title": "மொழியைத் தேர்ந்தெடுக்கவும்",
    //       "language_screen_btn_title": "தொடரவும்",

    //       "login_screen_title": "மின்னஞ்சல் முகவரியுடன் உள்நுழைக",
    //       "login_screen_forgotPassword": "கடவுச்சொல்லை மறந்துவிட்டீர்களா ?",
    //       "login_screen_signIn": "உள்நுழைக",
    //       "login_screen_notRegisteredYet": "இன்னும் பதிவு செய்யவில்லையh ?",
    //       "login_screen_signUpNow": "இப்பொOது பதிவு செய்க",

    //       "signup_screen_title": "மின்னஞ்சல் முகவரியுடன் பதிவுசெய்க",
    //       "signup_screen_fullName": "முழு பெயர்",
    //       "signup_screen_confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    //       "signup_screen_agreeToTerms": "நான் விதிகள் மற்றும் நிபந்தனைகளை ஒப்புக்கொள்கிறேன்",
    //       "signup_screen_getStarted": "தொடங்கவும்",
    //       "signup_screen_alreadyRegistered": "ஏற்கனவேய பதிவு செய்து-உள்ளீர்களா ?",
    //       "signup_screen_signInNow": "இப்பொOது உள்நுழைக",

    //       "home_screen_courses": "படிப்புகள்",
    //       "home_screen_sampleVideos": "மாதிரி வீடியோக்கள்",
    //       "home_screen_searchPlaceholder": "நீங்கள் என்ன தேடுகிறீர்கள்?",

    //       "corseDetails_screen_textAreaPlaceholder": "உங்கள் கேள்வி",
    //       "corseDetails_screen_send": "அனுப்புக",
    //       "corseDetails_screen_addToBookmark": "புக்மார்க்கில் சேர்க்கவும்",
    //       "corseDetails_screen_reviewThisCourse": "இந்த பாடத்திட்டத்தை மதிப்பாய்வு செய்யவும்e",
    //       "corseDetails_screen_tab1": "பாடங்கள்",
    //       "corseDetails_screen_tab2": "கேள்விகள்",
    //       "corseDetails_screen_tab3": "மேலும்",

    //       "drawer_viewProfile": "சுயவிவரம் காண",
    //       "drawer_yourLanguage": "உங்கள் மொழி",
    //       "drawer_followUsOn": "எங்களை பின்தொடரவும்",
    //       "drawer_home": "முகப்பு",
    //       "drawer_courseDetails": "பாட விவரங்கள்",
    //       "drawer_myTimeline": "எனது காலவரிசை",
    //       "drawer_myBookmarked": "எனது புக்மார்க்குகள்",
    //       "drawer_termsOfUse": "பயன்பாட்டு விதிமுறைகள்",
    //       "drawer_privacyPolicy": "தனியுரிமைக் கொள்கை",
    //       "drawer_disclaimer": "பொறுப்புத் துறப்பு",
    //       "drawer_logout": "வெளியேறுக",

    //       "header_login": "உள்நுழைக",
    //       "header_signUp": "பதிவுபெறுக",
    //       "header_createAcount": "உங்கள் கணக்கை ஆரம்பியுங்கள்",
    //       "header_languageSelect": "மொழி தேர்வு",
    //       "header_home": "வீடு",
    //       "header_profile": "சுயவிவரம்",
    //       "header_courseDetails": "பாட விவரங்கள்",
    //       "header_courses": "படிப்புகள்",
    //       "header_myTimeline": "எனது காலவரிசை",
    //       "header_myBookmarked": "எனது புக்மார்க்கு",
    //       "header_sampleVideos": "மாதிரி வீடியோக்கள்",
    //       "header_serch_result_of": "தேடல் முடிவுகள் :",
    //       "header_resetPassword": "உங்கள் கடவுச்சொல்லை மீட்டமைக்க",
    //       "header_changePassword": "கடவுச்சொல் மாற்றம்",

    //       "profile_fullName": "முழு பெயர்",
    //       "profile_dob": "பிறந்த தேதி",
    //       "profile_updateProfile": "சுயவிவரத்தைப் புதுப்பிக்கவும்",

    //       "reset_Password_title": "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிட்டு வழிமுறைகளைப் பெற சமர்ப்பிக்கவும்",
    //       "reset_Password_btn": "சமர்ப்பிக்கவும்",

    //       "onboarding_getIn": "தொடரவும்",

    //       "empty_message_courses": "தலைப்புகள் எதுவும் கிடைக்கவில்லை",
    //       "empty_message_search": "இந்த தேடலுக்கான முடிவுகள் எதுவும் கிடைக்கவில்லை",
    //       "empty_message_timeline": "உங்கள் காலவரிசையில் எந்த தலைப்புகளும் இல்லை",
    //       "empty_message_bookmarked": "உங்களுக்காக புக்மார்க்கு செய்யப்பட்ட தலைப்புகள் எதுவும் இல்லை",
    //       "empty_message_sampleVideos": "எந்த மாதிரி வீடியோக்களும் கொடுக்கப்படவில்லை",

    //       "email": "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    //       "required": "இந்த புலம் கட்டாயமாகும்",
    //       "equalPassword": "கடவுச்சொற்கள் வேறு",

    //       "change_password_title":"கடவுச்சொல் மாற்றம்",
    //       "change_password_button_title":"கடவுச்சொல் மாற்றம்",
    //       "change_password_current_password":"தற்போதைய கடவுச்சொல்",
    //       "change_password_new_password":"புதியது கடவுச்சொல்",
    //       "change_password_confirm_password":"கடவுச்சொல் உறுதிப்படுத்தவும்",

    //       "course_details_not_authorizes_to_play":"இந்த டுடோரியலைக் காண உங்களுக்கு அனுமதி இல்லை, தயவுசெய்து உள்நுழைக",
    //       "something_went_wrong":"ஏதோ தவறு நடந்துவிட்டது",
    //       "course_details_please_login_to_Add_Bookmark":"புக்மார்க்கைச் சேர்க்க உள்நுழைக",
    //       "course_details_please_login_to_Add_Question":"கேள்விகளைக் கேட்க உள்நுழைக",
    //       "change_language_success": "மொழி வெற்றிகரமாக மாற்றப்பட்டது",
    //       "login_success":"உள்நுழைவு வெற்றி",
    //       "registation_success": "வெற்றிகரமாக பதிவு செய்யப்பட்டது",
    //       "reset_password_send_details":"வழிமுறைகள் உங்கள் மின்னஞ்சலுக்கு வெற்றிகரமாக அனுப்பப்பட்டன",
    //       "profile_image_upload_success":"சுயவிவரப் படம் பதிவேற்றம் வெற்றிகரமாக",
    //       "user_update_success":"பயனர் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    //       "change_password_success":"கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது"

    //     }
    // },
    sinhala: {},
    english: {},
    tamil: {},
    falied: false,
    error: []
  },
  tokenStatus: false,
  currentLanguage:'en'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.AUTH_LOADING:
      return { ...state, userLoading: action.payload };
    case actionType.AUTH_LOGIN_LOADING:
      return {
        ...state,
        login: {
          loading: action.payload,
          success: [],
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LOGIN_FAILED:
      return {
        ...state,
        login: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.AUTH_SIGNUP_LOADING:
      return {
        ...state,
        signup: {
          loading: action.payload,
          success: [],
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_SIGNUP_SUCCESS:
      return {
        ...state,
        signup: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_SIGNUP_FAILED:
      return {
        ...state,
        signup: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.AUTH_LANGUAGE_LOADING:
      return {
        ...state,
        language: {
          loading: action.payload,
          success: [],
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LANGUAGE_FAILED:
      return {
        ...state,
        language: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.AUTH_LOGOUT_LOADING:
      return {
        ...state,
        logout: {
          loading: action.payload,
          success: false,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LOGOUT_SUCCESS:
      return {
        logout: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_LOGOUT_FAILED:
      return {
        ...state,
        logout: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };

    case actionType.AUTH_RESET_PASSWORD_LOADING:
      return {
        ...state,
        resetPassword: {
          loading: action.payload,
          success: false,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_RESET_PASSWORD_FAILED:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.PRO_PIC_LOADING:
      return {
        ...state,
        proPic: {
          loading: action.payload,
          success: false,
          falied: false,
          error: []
        }
      };
    case actionType.PRO_PIC_SUCCESS:
      return {
        ...state,
        proPic: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.PRO_PIC_FAILED:
      return {
        ...state,
        proPic: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.AUTH_USER:
      return {
        ...state,
        user: action.payload
      };
    case actionType.AUTH_CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        resetPassword: {
          loading: action.payload,
          success: false,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };
    case actionType.AUTH_TOKEN:
      return {
        ...state,
        tokenStatus: action.payload
      };
    case actionType.RESET_AUTH:
      return initialState
    case actionType.AUTH_CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        resetPassword: {
          loading: action.payload,
          success: false,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: action.payload,
          falied: false,
          error: []
        }
      };
    case actionType.AUTH_CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        resetPassword: {
          loading: false,
          success: false,
          falied: true,
          error: action.payload
        }
      };

    case actionType.AUTH_TOKEN:
      return {
        ...state,
        tokenStatus: action.payload
      };

    case actionType.AUTH_CURRENT_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload
      };
    default:
      return state;
  }
};

export * from './auth';
export default reducer;
