import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import {
  Block,
  Checkbox,
  Text,
  Button as GaButton,
  theme,
} from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { connect } from "react-redux";
import { Button, Icon, Input, Loader } from "../components";
import { Images, nowTheme, tabs } from "../constants";
import Tabs from "../components/Tabs";
import { en } from "../constants/languages/english.json";
import { si } from "../constants/languages/sinhala.json";
import { ta } from "../constants/languages/tamil.json";
import * as authActions from "../store/actions";

import { showMessage } from "react-native-flash-message";
const { width, height } = Dimensions.get("screen");

i18n.translations = {
  en,
  si,
  ta,
};

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class LanguageSelect extends React.Component {
  state = {
    selectedLanguage: "",
    selectLanguageWaiting: false,
  };

  languageHandler = (language) => {
    this.setState({ selectedLanguage: language });
    i18n.locale = language;
  };

  languageSelectHandler = async () => {
    try {
      await AsyncStorage.setItem(
        "selectedLanguage",
        this.state.selectedLanguage
      );
      this.setState({ selectLanguageWaiting: true });
      await this.props.setUserLanguage(this.state.selectedLanguage);
      this.forceUpdate();
    } catch (error) {
      Alert.alert("", error, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  };

  setLanguage = async () => {
    const language = await AsyncStorage.getItem("selectedLanguage");
    i18n.locale = language;
    await this.setState({ selectedLanguage: language });
  };

  componentDidMount() {
    this.setLanguage();
    this.forceUpdate();
  }

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
          message: "Successfully set Language",
          type: "success",
          position: "bottom",
        });
        {
          languageSelectSuccess &&
            navigation.reset({
              routes: [{ name: "App" }],
            });
        }
      }
      if (!languageSelectSuccess) {
        // const message =
        //   languageSelectError?.data?.data[0]?.messages[0]?.message ?? {};

        showMessage({
          message: "Something went wrong",
          type: "warn",
          position: "bottom",
        });
      }
    }

    setLanguage = async () => {
      const language = await AsyncStorage.getItem("selectedLanguage");
      i18n.locale = language;
      await this.setState({ selectedLanguage: language });
    };
  };

  componentDidMount() {
    this.setLanguage();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectLanguageWaiting !== false) {
      // this.setState({ lessonVideos: this.props.lessonVideos });
      this.checkLanguage();
    }
  }

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
            navigation.reset({
              routes: [{ name: "App" }],
            });
        }
      }
      if (!languageSelectSuccess) {
        const message =
          languageSelectError?.data?.data[0]?.messages[0]?.message;

        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }
    }
  };

  render() {
    // {this.state.selectLanguageWaiting && this.checkLanguage()}
    return (
      <DismissKeyboard>
        <Block flex middle>
          <Loader show={this.state.selectLanguageWaiting} />

          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex space="evenly">
                <Block flex={0.6} center>
                  <Text
                    center
                    size={25}
                    style={{ fontFamily: "montserrat-regular" }}
                  >
                    {i18n.t("language_screen_title")}
                  </Text>
                  <Block>
                    {this.state.selectedLanguage != "" && (
                      <Tabs
                        data={tabs.languages || []}
                        initialIndex={this.state.selectedLanguage}
                        onChange={(language) => this.languageHandler(language)}
                        vertical
                        navigation={this.props.navigation}
                      />
                    )}
                  </Block>
                  <Block center>
                    <Button
                      onPress={this.languageSelectHandler}
                      color="active"
                      style={styles.createButton}
                    >
                      <Text
                        style={{ fontFamily: "montserrat-bold" }}
                        size={14}
                        color={nowTheme.COLORS.WHITE}
                      >
                        {i18n.t("language_screen_btn_title")}
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  imageBackground: {
    width: width,
    height: height,
  },
  registerContainer: {
    marginTop: 15,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.7,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT,
  },
  inputs: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 21.5,
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 5,
    marginBottom: 40,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
    marginHorizontal: 10,
  },
});

function mapStateToProps(state) {
  return {
    languageSelectLoading: state.auth.language.loading,
    languageSelectSuccess: state.auth.language.success,
    languageSelectFailed: state.auth.language.failed,
    languageSelectError: state.auth.language.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserLanguage: (userLanguage) => {
      dispatch(authActions.setUserLanguage(userLanguage));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
