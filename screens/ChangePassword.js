import React from "react";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Block, Text } from "galio-framework";
import ValidationComponent from "react-native-form-validator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button, Input, Loader } from "../components";
import { Images, nowTheme } from "../constants";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePassword } from "../store/modules/auth/auth";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

const { width, height } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class ChangePassword extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      currentUserEmail: "",
    };
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem("auth_user");
    const currentUser = JSON.parse(user);
    this.setState({ currentUserEmail: currentUser.email });
    this.forceUpdate();
  }

  validateCheck = (state, validateField) => {
    this.validate({
      [validateField]: { required: true },
    });
    this.setState({ [validateField]: state });
  };

  submit = () => {
    this.validate({
      confirmPassword: {
        equalPassword: this.state.newPassword,
        required: true,
      },
      newPassword: { required: true },
      currentPassword: { required: true },
    });

    let resetSubmit = {
      identifier: this.state.currentUserEmail,
      password: this.state.currentPassword,
      newPassword: this.state.newPassword,
      confirmPassword: this.state.confirmPassword,
    };
    this.props.changePassword(resetSubmit).then((res) => {
      if (res) {
        this.setState({
          currentUserEmail: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        this.props.navigation.navigate("Profile");
      }
    });
  };

  render() {
    const { auth } = this.props;
    return (
      <DismissKeyboard>
        <Block flex>
          <Loader show={auth.chnagePassword.loading} />
          <Block style={styles(this.props).mainContanier}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              enableAutomaticScroll={Platform.OS === "ios"}
            >
              <Block flex>
                <Block flex={15}>
                  <Block flex={10} style={styles(this.props).subContanier}>
                    <Block flex={2} middle>
                      <Text style={styles(this.props).mainTitle}>
                        {i18n.t("change_password_title")}
                      </Text>
                    </Block>
                    <Block
                      flex={8}
                      middle
                      style={styles(this.props).currentPasswordMainContent}
                    >
                      <Input
                        ref="currentPassword"
                        placeholder={i18n.t("change_password_current_password")}
                        password
                        viewPass
                        style={styles(this.props).inputs}
                        iconContent={
                          <AntDesign
                            name="key"
                            family="NowExtra"
                            style={styles(this.props).inputIcons}
                          />
                        }
                        onChangeText={(currentPassword) =>
                          this.validateCheck(currentPassword, "currentPassword")
                        }
                        value={this.state.currentPassword}
                      />
                      {this.isFieldInError("currentPassword") &&
                        this.getErrorsInField("currentPassword").map(
                          (errorMessage, index) => (
                            <Block center key={index}>
                              <Text style={styles(this.props).validation}>
                                {errorMessage}
                              </Text>
                            </Block>
                          )
                        )}
                      <Input
                        ref="newPassword"
                        placeholder={i18n.t("change_password_new_password")}
                        password
                        viewPass
                        style={styles(this.props).inputs}
                        iconContent={
                          <AntDesign
                            name="key"
                            family="NowExtra"
                            style={styles(this.props).inputIcons}
                          />
                        }
                        onChangeText={(newPassword) =>
                          this.validateCheck(newPassword, "newPassword")
                        }
                        value={this.state.newPassword}
                      />
                      {this.isFieldInError("newPassword") &&
                        this.getErrorsInField("newPassword").map(
                          (errorMessage, index) => (
                            <Block center key={index}>
                              <Text style={styles(this.props).validation}>
                                {errorMessage}
                              </Text>
                            </Block>
                          )
                        )}
                      <Input
                        ref="confirmPassword"
                        placeholder={i18n.t("change_password_confirm_password")}
                        password
                        viewPass
                        style={styles(this.props).inputs}
                        iconContent={
                          <AntDesign
                            name="key"
                            family="NowExtra"
                            style={styles(this.props).inputIcons}
                          />
                        }
                        onChangeText={(confirmPassword) =>
                          this.validateCheck(confirmPassword, "confirmPassword")
                        }
                        value={this.state.confirmPassword}
                      />
                      {this.isFieldInError("confirmPassword") &&
                        this.getErrorsInField("confirmPassword").map(
                          (errorMessage, index) => (
                            <Block center key={index}>
                              <Text style={styles(this.props).validation}>
                                {errorMessage}
                              </Text>
                            </Block>
                          )
                        )}

                      <Block center>
                        <Button
                          onPress={this.submit}
                          color="active"
                          style={styles(this.props).createButton}
                        >
                          <Text style={styles(this.props).buttonText}>
                            {i18n.t("change_password_button_title")}
                          </Text>
                        </Button>
                      </Block>
                    </Block>
                  </Block>
                  <Block flex={5}></Block>
                </Block>
              </Block>
            </KeyboardAwareScrollView>
            <Block />
          </Block>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = (props) =>
  StyleSheet.create({
    mainContanier: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    subContanier: {
      backgroundColor: nowTheme.COLORS.WHITE,
      marginHorizontal: 20,
      borderRadius: 10,
    },
    inputs: {
      borderWidth: 1,
      borderColor: nowTheme.COLORS.PLATINUM,
      borderRadius: 21.5,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.FONT
          : nowTheme.SIZES.PRIMARY_FONT,
    },

    createButton: {
      marginTop: 15,
    },
    profileContainer: {
      width,
      height,
      padding: 0,
      zIndex: 1,
    },
    profileBackground: {
      width,
    },
    inputIcons: {
      marginRight: 12,
      color: nowTheme.COLORS.ICON_INPUT,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
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
    currentPasswordMainContent: {
      marginHorizontal: 20,
    },
    validation: {
      fontFamily: "montserrat-regular",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
      color: nowTheme.COLORS.RED,
    },
    buttonText: {
      fontFamily: "montserrat-bold",
      textAlign: "center",
      color: nowTheme.COLORS.WHITE,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
  });

function mapStateToProps(state) {
  return {
    messages: i18n.translations,
    deviceLocale: i18n.locale,
    auth: state.auth,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePassword,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
