import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
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

import { loginUser } from "../store/modules/auth/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

const { width, height } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class Login extends ValidationComponent {
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
    loginWaiting: false,
    language: "",
  };
  signUpHandler = () => {
    const { navigation } = this.props;
    navigation.navigate("Register");
  };

  forgotPasswordHandler = () => {
    const { navigation } = this.props;
    navigation.navigate("Reset Password");
  };

  emailHandler = (email) => {
    this.setState({ email }, () => {
      this.validate({
        email: { email: true, required: true },
      });
    });
  };

  loginSubmitHandler = async () => {
    this.validate({
      email: { email: true, required: true },
      password: { required: true },
    });
    if (this.isFormValid()) {
      const userDetail = {
        identifier: this.state.email,
        password: this.state.password,
      };
      this.props.loginUser(userDetail).then((res) => {
        if (res.data.statusCode == 400) {
          showMessage({
            message: i18n.t("login_error_message"),
            type: "warn",
            position: "bottom",
          });
        } else {
          this.props.navigation.reset({
            routes: [{ name: "App" }],
          });
        }
      });
    }
    // else {
    //   Alert.alert('', 'Please enter a valid email address', [{ text: 'OK' }], {
    //     cancelable: false,
    //   });
    // }
  };

  async componentDidMount() {
    const language = await AsyncStorage.getItem("selectedLanguage");
    this.setState({ language: language });
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loginWaiting !== false) {
      this.checkLogin();
    }
  }

  checkLogin() {
    let { loginWaiting } = this.state;
    let { loginLoading, loginFailed, loginSuccess, navigation, logingError } =
      this.props;

    if (loginWaiting && !loginLoading) {
      if (!loginFailed) {
        showMessage({
          message: i18n.t("login_success"),
          type: "success",
          position: "bottom",
        });
        {
          loginSuccess && navigation.navigate("Home");
        }
      }
      if (!loginSuccess) {
        showMessage({
          message: i18n.t("login_error_message"),
          type: "warn",
          position: "bottom",
        });
      }
      this.setState({ loginWaiting: false });
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <DismissKeyboard>
        <Block flex middle>
          <Loader show={this.state.loginWaiting} />

          <Block flex middle>
            <Block style={styles(this.props).registerContainer}>
              <Block flex space="evenly">
                <Block
                  flex={0.4}
                  middle
                  style={styles(this.props).socialConnect}
                >
                  <Block flex={0.5} middle>
                    <Text style={styles(this.props).mainTitle}>
                      {i18n.t("login_screen_title")}
                    </Text>
                  </Block>
                </Block>
                <Block flex={1} middle space="between">
                  <Block center flex={0.9}>
                    <Block flex space="between">
                      <Block flex>
                        <Block width={width * 0.8}>
                          <Input
                            ref="email"
                            placeholder={i18n.t("common_email")}
                            style={styles(this.props).inputs}
                            iconContent={
                              <Icon
                                color={nowTheme.COLORS.HIT_GRAY}
                                name="email-852x"
                                family="NowExtra"
                                style={styles(this.props).inputIcons}
                              />
                            }
                            type="email-address"
                            onChangeText={(email) => this.emailHandler(email)}
                            value={this.state.email}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoCompleteType="email"
                          />
                          {this.isFieldInError("email") &&
                            this.getErrorsInField("email").map(
                              (errorMessage, index) => (
                                <Block center key={index}>
                                  <Text style={styles(this.props).validation}>
                                    {errorMessage}
                                  </Text>
                                </Block>
                              )
                            )}
                        </Block>
                        <Block style={styles(this.props).passwordInput}>
                          <Input
                            ref="password"
                            placeholder={i18n.t("common_password")}
                            password
                            viewPass
                            style={styles(this.props).inputs}
                            iconContent={
                              <Icon
                                color={nowTheme.COLORS.HIT_GRAY}
                                name="caps-small2x"
                                family="NowExtra"
                                style={styles(this.props).inputIcons}
                              />
                            }
                            onChangeText={(password) =>
                              this.setState({ password })
                            }
                            value={this.state.password}
                          />
                          {this.isFieldInError("password") &&
                            this.getErrorsInField("password").map(
                              (errorMessage, index) => (
                                <Block center key={index}>
                                  <Text style={styles(this.props).validation}>
                                    {errorMessage}
                                  </Text>
                                </Block>
                              )
                            )}
                        </Block>
                        <Block center>
                          <Block row>
                            <Text
                              onPress={this.forgotPasswordHandler}
                              style={styles(this.props).forgotPasswordText}
                            >
                              {i18n.t("login_screen_forgotPassword")}
                            </Text>
                          </Block>
                          <Button
                            onPress={this.loginSubmitHandler}
                            color="active"
                            round
                            style={styles(this.props).createButton}
                          >
                            <Text style={styles(this.props).loginButtonText}>
                              {i18n.t("login_screen_signIn")}
                            </Text>
                          </Button>
                          <Block>
                            <Text
                              center
                              style={styles(this.props).signupContent}
                            >
                              {i18n.t("login_screen_notRegisteredYet")}{" "}
                            </Text>
                            <Text
                              center
                              style={styles(this.props).signup}
                              onPress={() => navigation.navigate("Register")}
                            >
                              {i18n.t("login_screen_signUpNow")}
                            </Text>
                          </Block>
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
    },
    mainTitle: {
      fontFamily: "montserrat-regular",
      textAlign: "center",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PAGE_TITLE
          : nowTheme.SIZES.SUB_PAGE_TITLE,
      color: nowTheme.COLORS.GITHUB,
    },
    socialButtons: {
      width: 120,
      height: 40,
      backgroundColor: nowTheme.COLORS.WHITE,
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
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    inputs: {
      borderWidth: 1,
      borderColor: nowTheme.COLORS.PLATINUM,
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
    },
    social: {
      width: theme.SIZES.BASE * 3.5,
      height: theme.SIZES.BASE * 3.5,
      borderRadius: theme.SIZES.BASE * 1.75,
      justifyContent: "center",
      marginHorizontal: 10,
    },
    validation: {
      fontFamily: "montserrat-regular",
      color: nowTheme.COLORS.RED,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    forgotPasswordText: {
      fontFamily: "montserrat-regular",
      marginTop: 10,
      color: nowTheme.COLORS.RED,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    loginButtonText: {
      fontFamily: "montserrat-bold",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
      color: nowTheme.COLORS.WHITE,
    },
    signupContent: {
      color: nowTheme.COLORS.HEADER,
      fontFamily: "montserrat-regular",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    signup: {
      color: nowTheme.COLORS.RED,
      fontFamily: "montserrat-regular",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    signUpMainContent: {
      marginHorizontal: 15,
      justifyContent: "center",
    },
    passwordInput: {
      marginBottom: 5,
      width: width * 0.8,
    },
  });

function mapStateToProps(state) {
  return {
    loginLoading: state.auth.login.loading,
    loginSuccess: state.auth.login.success,
    loginFailed: state.auth.login.failed,
    logingError: state.auth.login.error,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,
    messages: i18n.translations,
    deviceLocale: i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginUser,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
