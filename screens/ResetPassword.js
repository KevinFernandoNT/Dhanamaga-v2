import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import ValidationComponent from "react-native-form-validator";
import {
  Block,
  Checkbox,
  Text,
  Button as GaButton,
  theme,
} from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { Button, Icon, Input, Loader } from "../components";
import { Images, nowTheme } from "../constants";
import { showMessage } from "react-native-flash-message";

import * as authActions from "../store/actions";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class ResetPassword extends ValidationComponent {
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
    email: "",
    password: "",
    isValidEmail: true,
    resetWaiting: false,
  };

  emailHandler = (email) => {
    this.setState({ email }, () => {
      this.validate({
        email: { email: true, required: true },
      });
    });
  };

  resetPasswordSubmitHandler = () => {
    this.validate({
      email: { email: true, required: true },
    });
    if (this.isFormValid()) {
      const email = {
        email: this.state.email,
      };

      this.props.resetPassword(email);
      this.setState({ resetWaiting: true });
      // submit data
    }
    // else {
    //   Alert.alert('', 'Please enter a valid email address', [{ text: 'OK' }], {
    //     cancelable: false,
    //   });
    // }
  };

  async componentDidMount() {
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetWaiting !== false) {
      // this.setState({ lessonVideos: this.props.lessonVideos });
      this.checkReset();
    }
  }

  checkReset() {
    let { resetWaiting } = this.state;
    let {
      resetPasswordLoading,
      resetPasswordFailed,
      resetPasswordSuccess,
      navigation,
      resetPasswordError,
    } = this.props;

    if (resetWaiting && !resetPasswordLoading) {
      if (!resetPasswordFailed) {
        showMessage({
          message: i18n.t("reset_password_send_details"),
          type: "success",
          position: "bottom",
        });
        {
          resetPasswordSuccess &&
            navigation.reset({
              routes: [{ name: "App" }],
            });
        }
      }
      if (!resetPasswordSuccess) {
        const message =
          resetPasswordError &&
          resetPasswordError.data &&
          resetPasswordError.data.data
            ? resetPasswordError.data.data[0].messages[0].message
            : "";

        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }
      this.setState({ resetWaiting: false });
    }
  }

  render() {
    const { navigation, currentLanguage } = this.props;
    // { this.state.resetWaiting && this.checkReset(); }
    return (
      <DismissKeyboard>
        <Block flex middle>
          <Loader show={this.state.resetWaiting} />

          <Block flex middle>
            <Block style={styles(this.props).registerContainer}>
              <Block flex space="evenly">
                <Block
                  flex={0.4}
                  middle
                  style={styles(this.props).socialConnect}
                >
                  <Block flex={0.5} middle>
                    <Text
                      style={styles(this.props).mainText}
                      color={nowTheme.COLORS.GITHUB}
                      size={
                        currentLanguage == "en"
                          ? nowTheme.SIZES.PAGE_TITLE
                          : nowTheme.SIZES.SUB_PAGE_TITLE
                      }
                    >
                      {i18n.t("reset_Password_title")}
                    </Text>
                  </Block>
                </Block>
                <Block flex={1} middle space="between">
                  <Block center flex={0.9}>
                    <Block flex space="between">
                      <Block>
                        <Block width={width * 0.8}>
                          <Input
                            ref="email"
                            placeholder={i18n.t("common_email")}
                            style={styles(this.props).inputs}
                            iconContent={
                              <Icon
                                size={nowTheme.SIZES.FONT}
                                color={nowTheme.COLORS.ICONCOLOR}
                                name="email-852x"
                                family="NowExtra"
                                style={styles(this.props).inputIcons}
                              />
                            }
                            type="email-address"
                            onChangeText={(email) => this.emailHandler(email)}
                            value={this.state.email}
                          />
                          {this.isFieldInError("email") &&
                            this.getErrorsInField("email").map(
                              (errorMessage) => (
                                <Block center>
                                  <Text
                                    color={nowTheme.COLORS.RED}
                                    style={styles(this.props).emailText}
                                  >
                                    {errorMessage}
                                  </Text>
                                </Block>
                              )
                            )}
                        </Block>
                        <Block center>
                          <Button
                            onPress={this.resetPasswordSubmitHandler}
                            color="active"
                            round
                            style={styles(this.props).createButton}
                          >
                            <Text
                              style={{ fontFamily: "montserrat-bold" }}
                              size={nowTheme.SIZES.PRIMARY_FONT}
                              color={nowTheme.COLORS.WHITE}
                            >
                              {i18n.t("reset_Password_btn")}
                            </Text>
                          </Button>
                        </Block>
                      </Block>
                    </Block>
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

const styles = (props) =>
  StyleSheet.create({
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
      marginTop: Platform.OS === "android" ? 65 : 55,
      width: width * 0.9,
      height: height < 812 ? height * 0.8 : height * 0.8,
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
      backgroundColor: nowTheme.COLORS.PRIMARY,
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
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    inputIcons: {
      marginRight: 12,
      color: nowTheme.COLORS.ICON_INPUT,
    },
    inputs: {
      borderWidth: 1,
      borderColor: nowTheme.COLORS.GRAY,
      borderRadius: 21.5,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    passwordCheck: {
      paddingLeft: 2,
      paddingTop: 6,
      paddingBottom: 15,
    },
    createButton: {
      width: width * 0.5,
      marginTop: 25,
      marginBottom: 40,
      marginTop: 80,
    },
    social: {
      width: theme.SIZES.BASE * 3.5,
      height: theme.SIZES.BASE * 3.5,
      borderRadius: theme.SIZES.BASE * 1.75,
      justifyContent: "center",
      marginHorizontal: 10,
    },
    mainText: {
      fontFamily: "montserrat-regular",
      textAlign: "center",
    },
    emailText: {
      fontFamily: "montserrat-regular",
    },
  });

function mapStateToProps(state) {
  return {
    resetPasswordLoading: state.auth.resetPassword.loading,
    resetPasswordSuccess: state.auth.resetPassword.success,
    resetPasswordFailed: state.auth.resetPassword.failed,
    resetPasswordError: state.auth.resetPassword.error,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,

    messages: i18n.translations,
    deviceLocale: i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (email) => {
      dispatch(authActions.resetPassword(email));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
