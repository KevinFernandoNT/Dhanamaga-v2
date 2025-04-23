import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");
import { Images, nowTheme } from "../constants/";
import { connect } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { CommonActions } from "@react-navigation/native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

import i18n from "i18n-js";
import { setUserLanguage } from "../store/modules/auth";
import { handleLanguage } from "../store/modules/language";
import AsyncStorage from "@react-native-async-storage/async-storage";

import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }

  state = {
    selectedLanguage: "en",
    selectLanguageWaiting: false,
    isNewUserIn: "",
    bgImage: Images.LogoE,
    loader: true,
    isConnectedSuccess: false,
    // selectedLang: 'en'
  };

  languageHandler = (language) => {
    this.setIMage(language);
    this.setState({ selectedLanguage: language });
    i18n.locale = language;
  };

  languageSelectHandler = async () => {
    const { navigation, dispatch } = this.props;
    try {
      const currentIosVersion = Constants.manifest.version;
      const currentAndroidVersion = Constants.manifest.version;
      this.checkConnection();
      if (this.state.isConnectedSuccess) {
        if (Platform.OS === "android") {
          if (!currentAndroidVersion) {
            await AsyncStorage.setItem(
              "androidVersion",
              this.props.language.androidVersion
            );
            await AsyncStorage.setItem(
              "selectedLanguage",
              this.state.selectedLanguage
            );
            this.setState({ selectLanguageWaiting: true });
            dispatch(setUserLanguage(this.state.selectedLanguage));
            dispatch({
              type: "AUTH_CURRENT_LANGUAGE",
              payload: this.state.selectedLanguage,
            });
            // await this.props.setUserLanguage(this.state.selectedLanguage)
            this.checkLanguage();
            // await this.props.setUserLanguage(this.state.selectedLanguage)
            await AsyncStorage.setItem("newUser", "false");
            this.forceUpdate();
          } else {
            if (currentAndroidVersion == "1.0.5") {
              await AsyncStorage.setItem(
                "androidVersion",
                this.props.language.androidVersion
              );
              await AsyncStorage.setItem(
                "selectedLanguage",
                this.state.selectedLanguage
              );
              this.setState({ selectLanguageWaiting: true });
              dispatch(setUserLanguage(this.state.selectedLanguage));
              dispatch({
                type: "AUTH_CURRENT_LANGUAGE",
                payload: this.state.selectedLanguage,
              });
              // await this.props.setUserLanguage(this.state.selectedLanguage)
              this.checkLanguage();
              // await this.props.setUserLanguage(this.state.selectedLanguage)
              await AsyncStorage.setItem("newUser", "false");
              this.forceUpdate();
            } else {
              navigation.navigate("AppUpdate", {
                language: this.state.selectedLanguage,
              });
            }
          }
        } else {
          if (!currentIosVersion) {
            await AsyncStorage.setItem(
              "iosVersion",
              this.props.language.iosVersion
            );
            await AsyncStorage.setItem(
              "selectedLanguage",
              this.state.selectedLanguage
            );
            this.setState({ selectLanguageWaiting: true });
            dispatch(setUserLanguage(this.state.selectedLanguage));
            dispatch({
              type: "AUTH_CURRENT_LANGUAGE",
              payload: this.state.selectedLanguage,
            });
            // await this.props.setUserLanguage(this.state.selectedLanguage)
            this.checkLanguage();
            // await this.props.setUserLanguage(this.state.selectedLanguage)
            await AsyncStorage.setItem("newUser", "false");
            this.forceUpdate();
          } else {
            if (currentIosVersion == this.props.language.iosVersion) {
              await AsyncStorage.setItem(
                "iosVersion",
                this.props.language.iosVersion
              );
              await AsyncStorage.setItem(
                "selectedLanguage",
                this.state.selectedLanguage
              );
              this.setState({ selectLanguageWaiting: true });
              dispatch(setUserLanguage(this.state.selectedLanguage));
              dispatch({
                type: "AUTH_CURRENT_LANGUAGE",
                payload: this.state.selectedLanguage,
              });
              // await this.props.setUserLanguage(this.state.selectedLanguage)
              this.checkLanguage();
              // await this.props.setUserLanguage(this.state.selectedLanguage)
              await AsyncStorage.setItem("newUser", "false");
              this.forceUpdate();
            } else {
              navigation.navigate("AppUpdate", {
                language: this.state.selectedLanguage,
              });
            }
          }
        }
      } else {
        showMessage({
          message: i18n.t("network_state"),
          type: "danger",
        });
      }
    } catch (error) {
      Alert.alert("", error, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  };

  setLanguage = async () => {
    await AsyncStorage.getItem("selectedLanguage").then((language) => {
      if (!language || language == null) {
        language = "en";
        i18n.locale = language;
        this.setIMage(language);
        this.setState({ selectedLanguage: language });
      } else {
        i18n.locale = language;
        this.setIMage(language);
        this.setState({ selectedLanguage: language });
      }
    });

    await AsyncStorage.getItem("newUser").then((isNewUser) => {
      if (isNewUser == "false") {
        this.setState({ isNewUserIn: false });
      } else {
        this.setState({ isNewUserIn: true });
      }
    });
  };

  checkToken = async () => {
    const { dispatch } = this.props;
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch({ type: "AUTH_TOKEN", payload: true });
    } else {
      dispatch({ type: "AUTH_TOKEN", payload: false });
    }
  };
  setUser = async () => {
    const { dispatch } = this.props;
    const user = await AsyncStorage.getItem("auth_user");
    if (user) {
      dispatch({ type: "AUTH_USER", payload: JSON.parse(user) });
    } else {
      dispatch({ type: "AUTH_USER", payload: null });
    }
  };

  checkConnection = async () => {
    const { navigation, dispatch } = this.props;
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        (i18n.translations = {
          en: english.en,
          si: sinhala.si,
          ta: tamil.ta,
        }),
          showMessage({
            message: i18n.t("network_state"),
            type: "danger",
          });
        this.setState({ loader: false });
      } else {
        dispatch(handleLanguage()).then((res) => {
          if (res) {
            i18n.translations = {
              en: this.props.language.english.en
                ? this.props.language.english.en
                : english.en,
              si: this.props.language.sinhala.si
                ? this.props.language.sinhala.si
                : sinhala.si,
              ta: this.props.language.tamil.ta
                ? this.props.language.tamil.ta
                : tamil.ta,
            };
            this.setLanguage();
            this.checkToken();
            this.setUser();
            this.setState({ loader: false, isConnectedSuccess: true });
          } else {
            i18n.translations = {
              en: this.props.language.english.en
                ? this.props.language.english.en
                : english.en,
              si: this.props.language.sinhala.si
                ? this.props.language.sinhala.si
                : sinhala.si,
              ta: this.props.language.tamil.ta
                ? this.props.language.tamil.ta
                : tamil.ta,
            };
            this.setState({ loader: false, isConnectedSuccess: true });
          }
        });

        this.setLanguage();
        this.checkToken();
        this.setUser();

        this.setState({ loader: false, isConnectedSuccess: true }, () => {
          this.forceUpdate();
        });
      }
    });
  };

  async componentDidMount() {
    const { navigation, dispatch } = this.props;
    this.setState({ loader: true });
    this.checkConnection();
    NetInfo.addEventListener(this.checkConnection);
  }

  componentWillUnmount() {
    NetInfo.addEventListener(this.checkConnection);
  }

  setIMage = (language) => {
    let image;
    switch (language) {
      case "en":
        image = Images.LogoE;
        break;
      case "si":
        image = Images.LogoS;
        break;
      case "ta":
        image = Images.LogoT;
        break;
      default:
        image = Images.LogoE;
        break;
    }
    this.setState({ bgImage: image });
  };
  checkLanguage = () => {
    let { selectLanguageWaiting } = this.state;
    let {
      languageSelectLoading,
      languageSelectFailed,
      languageSelectSuccess,
      navigation,
      languageSelectError,
    } = this.props;

    if (!languageSelectLoading && selectLanguageWaiting) {
      if (!languageSelectFailed) {
        this.setState({ selectLanguageWaiting: false });
        showMessage({
          message: i18n.t("change_language_success"),
          type: "success",
          position: "bottom",
        });
        {
          languageSelectSuccess &&
            navigation.dispatch({
              ...CommonActions.reset({
                index: 0,
                routes: [{ name: "App" }],
              }),
            });
        }
      }
      if (!languageSelectSuccess) {
        const message = languageSelectError.data.data[0].messages[0].message;
        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const fontSize =
      this.props.currentLanguage == "en"
        ? nowTheme.SIZES.FONT
        : nowTheme.SIZES.SUB_FONT; //16
    return (
      <Block style={styles(this.props).mainContanier}>
        <ImageBackground
          source={Images.bg}
          style={styles(this.props).imgBackground}
        >
          <Block style={styles(this.props).mainImageContanier}>
            <Image
              source={this.state.bgImage}
              style={styles(this.props).imag}
            />
          </Block>
          <Block style={styles(this.props).selectImageText}>
            <Block middle row>
              <Text
                color={nowTheme.COLORS.ACTIVE}
                size={fontSize}
                style={styles(this.props).screenTitleText}
              >
                {!this.state.loader ? (
                  i18n.t("language_screen_title")
                ) : (
                  <ActivityIndicator size="small" />
                )}
              </Text>
            </Block>

            <Block middle row style={styles(this.props).languageBtnBlock}>
              <Button
                shadowless
                style={
                  this.state.selectedLanguage == "en"
                    ? styles(this.props).languageButtonSelected
                    : styles(this.props).languageButton
                }
                onPress={() => this.languageHandler("en")}
              >
                <Text
                  style={styles(this.props).languageText}
                  color={nowTheme.COLORS.WHITE}
                >
                  English
                </Text>
              </Button>

              <Button
                shadowless
                style={
                  this.state.selectedLanguage == "si"
                    ? styles(this.props).languageButtonSelected
                    : styles(this.props).languageButton
                }
                onPress={() => this.languageHandler("si")}
              >
                <Text
                  style={styles(this.props).languageText}
                  color={nowTheme.COLORS.WHITE}
                >
                  සිංහල
                </Text>
              </Button>

              <Button
                shadowless
                style={
                  this.state.selectedLanguage == "ta"
                    ? styles(this.props).languageButtonSelected
                    : styles(this.props).languageButton
                }
                onPress={() => this.languageHandler("ta")}
              >
                <Text
                  style={styles(this.props).languageText}
                  color={nowTheme.COLORS.WHITE}
                >
                  தமிழ்
                </Text>
              </Button>
            </Block>

            <Block style={styles(this.props).selectButton}>
              <Button
                shadowless
                color={nowTheme.COLORS.ACTIVE}
                onPress={() => this.languageSelectHandler()}
              >
                <Text
                  style={styles(this.props).getInBtnText}
                  color={nowTheme.COLORS.WHITE}
                >
                  {!this.state.loader ? (
                    this.state.isNewUserIn ? (
                      `${i18n.t("signup_screen_getStarted")}`
                    ) : (
                      `${i18n.t("onboarding_getIn")}`
                    )
                  ) : (
                    <ActivityIndicator size="small" />
                  )}
                </Text>
              </Button>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = (props) =>
  StyleSheet.create({
    imgBackground: {
      flex: 8,
      resizeMode: "cover",
      flexDirection: "column",
    },

    mainContanier: {
      flex: 1,
      flexDirection: "column",
    },
    imag: {
      height: (height / 100) * 30,
      width: (width / 100) * 50,
      resizeMode: "contain",
    },
    languageBtnBlock: {
      marginTop: 30,
      marginBottom: 30,
    },
    languageButton: {
      backgroundColor: nowTheme.COLORS.BLACK,
      width: theme.SIZES.BASE * 6,
      height: theme.SIZES.BASE * 3,
      shadowRadius: 0,
      shadowOpacity: 0,
    },
    button: {
      marginHorizontal: theme.SIZES.BASE * 3,
      flex: 1,
      shadowRadius: 0,
      shadowOpacity: 0,
    },
    languageButtonSelected: {
      backgroundColor: nowTheme.COLORS.ACTIVE,
      width: theme.SIZES.BASE * 6,
      height: theme.SIZES.BASE * 3,
      shadowRadius: 0,
      shadowOpacity: 0,
      justifyContent: "space-evenly",
    },

    mainImageContanier: {
      flex: 5,
      alignItems: "center",
      justifyContent: "flex-end",
    },

    selectImageText: {
      flex: 3,
      alignItems: "center",
    },
    selectButton: {
      alignItems: "center",
    },
    screenTitleText: {
      fontFamily: "montserrat-regular",
    },
    languageText: {
      fontFamily: "montserrat-bold",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
  });

function mapStateToProps(state) {
  return {
    languageSelectLoading: state.auth.language.loading,
    languageSelectSuccess: state.auth.language.success,
    languageSelectFailed: state.auth.language.failed,
    languageSelectError: state.auth.language.error,
    language: state.language.languageSet,

    currentLanguage: state.auth.currentLanguage,
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     setUserLanguage: (userLanguage) => {
//       dispatch(authActions.setUserLanguage(userLanguage));
//     }
//   }
// };

export default connect(mapStateToProps)(Onboarding);
