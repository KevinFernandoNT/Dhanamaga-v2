import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import ValidationComponent from "react-native-form-validator";
import {
  Block,
  Checkbox,
  Text,
  Button as GaButton,
  theme,
} from "galio-framework";
import i18n from "i18n-js";
import { Button, Icon, Input, Loader, Select } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images, nowTheme } from "../constants";
import { format } from "date-fns";

import ModalDropdown from "react-native-modal-dropdown";
import { en } from "../constants/languages/english.json";
import { si } from "../constants/languages/sinhala.json";
import { ta } from "../constants/languages/tamil.json";
import { constants } from "../constants";

import * as authActions from "../store/actions";
import { connect } from "react-redux";

import { showMessage } from "react-native-flash-message";
import { he } from "date-fns/locale";
const { width, height } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class Register extends ValidationComponent {
  constructor(props) {
    super(props);
    this.defaultDate = new Date();
    this.year = this.defaultDate.getFullYear();
    this.month = this.defaultDate.getMonth();
    this.day = this.defaultDate.getDate();
    this.defaultDate.setFullYear(
      this.year - constants.REVERSE_YEAR,
      this.month,
      this.day
    );
    const updatedTranslations = {
      en: this.props?.language?.english?.en || en,
      si: this.props?.language?.sinhala?.si || si,
      ta: this.props?.language?.tamil?.ta || ta,
    };

    i18n.translations = updatedTranslations;
  }

  state = {
    name: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    province: "",
    gender: "",
    termsCheck: false,
    isValidEmail: true,
    isValidConfirmPassword: true,
    alertMessage: "",
    signupWaiting: false,
    showDate: false,
    language: "",
    lanWidth: 0,
    isNext: false,
  };

  checkBoxHandler = () => {
    this.setState({ termsCheck: !this.state.termsCheck });
  };

  nameHandler = (name) => {
    this.setState({ name }, () => {
      this.validate({
        name: { required: true },
      });
    });
  };

  emailHandler = (email) => {
    this.setState({ email }, () => {
      this.validate({
        email: { email: true, required: true },
      });
    });
  };

  provinceHandler = (province) => {
    this.setState({ province }, () => {
      this.validate({
        province: { required: true },
      });
    });
  };

  genderHandler = (gender) => {
    this.setState({ gender }, () => {
      this.validate({
        gender: { required: true },
      });
    });
  };

  resetState = () => {
    this.setState({
      name: "",
      email: "",
      password: "",
      isDatePickerVisible: true,
      confirmPassword: "",
      termsCheck: false,
      isValidEmail: true,
      isValidConfirmPassword: true,
      alertMessage: "",
      signupWaiting: false,
      showDate: false,
      isNext: false,
    });
  };

  passwordConfirmHandler = (confirmPassword) => {
    this.setState({ confirmPassword }, () => {
      this.validate({
        confirmPassword: { equalPassword: this.state.password, required: true },
      });
    });
  };

  checkSignup() {
    let { signupWaiting } = this.state;
    let {
      signupLoading,
      signupFailed,
      signupSuccess,
      navigation,
      signupError,
    } = this.props;

    if (!signupLoading && signupWaiting) {
      this.setState({ signupWaiting: false });
      if (!signupFailed) {
        this.setState({ signupWaiting: false });
        showMessage({
          message: i18n.t("registation_success"),
          type: "success",
          position: "bottom",
        });
        {
          signupSuccess && navigation.navigate("Language Select");
        }
      } else {
        this.setState({ signupWaiting: false });
      }
      if (!signupSuccess) {
        this.setState({ signupWaiting: false });
        const message =
          signupError.data.data[0].messages[0].message ===
          "Email is already taken."
            ? i18n.t("email_already_taken")
            : signupError.data.data[0].messages[0].message;
        if (
          signupError.data.data[0].messages[0].message ===
          "Email is already taken."
        ) {
          this.setState({ isNext: false });
        }

        showMessage({
          message: message || "Something went wrong",
          type: "warn",
          position: "bottom",
        });
      } else {
        this.setState({ signupWaiting: false });
      }
    }
  }

  next = async () => {
    this.validate({
      name: { required: true },
      email: { email: true, required: true },
      password: { required: true },
      confirmPassword: { required: true, equalPassword: this.state.password },
    });
    if (this.isFormValid() && this.state.termsCheck) {
      this.setState({ isNext: true });
    } else if (!this.state.termsCheck) {
      showMessage({
        message: i18n.t("registation_checkBox_error"),
        type: "warn",
        position: "bottom",
      });
    }
  };
  registerSubmitHandler = async () => {
    this.validate({
      name: { required: true },
      email: { email: true, required: true },
      province: { required: true },
      gender: { required: true },
      birthday: { required: true },
      password: { required: true },
      confirmPassword: { required: true, equalPassword: this.state.password },
    });
    if (this.isFormValid() && this.state.termsCheck) {
      let userDetais = {
        username: this.state.email,
        fullName: this.state.name,
        email: this.state.email,
        province: this.state.province,
        gender: this.state.gender,
        dateOfBirth: this.state.birthday,
        provider: "local",
        password: this.state.password,
      };
      this.setState({ signupWaiting: true });
      this.props.signup(userDetais);
    } else if (!this.state.termsCheck) {
      showMessage({
        message: i18n.t("registation_checkBox_error"),
        type: "warn",
        position: "bottom",
      });
    }
  };

  setStartDateHandler = (date) => {
    let formatDate = format(date, "yyyy-MM-dd");
    this.setState({ showDate: false });
    if (date) {
      this.setState({ birthday: formatDate });
    } else {
      this.setState({ birthday: "" });
    }
  };

  onBlurDateTimeCloseHandler = () => {
    this.setState({ showDate: false });
  };

  async componentDidMount() {
    const language = await AsyncStorage.getItem("selectedLanguage");
    let lanWidth = language == "ta" ? width * 0.8 : 0;
    this.setState({ language: language, lanWidth: lanWidth });
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.signupWaiting !== false) {
      this.checkSignup();
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <DismissKeyboard>
        <Block flex middle>
          <Loader show={this.state.signupWaiting} />
          <Block style={styles(this.props).mainContent}></Block>

          <Block
            style={styles(this.props).imageBackgroundContainer}
            imageStyle={styles(this.props).imageBackground}
          >
            <Block flex middle style={styles(this.props).mainContentHight}>
              <ScrollView>
                <Block style={styles(this.props).registerContainer}>
                  <Block flex>
                    <Text style={styles(this.props).mainTitle}>
                      {i18n.t("signup_screen_title")}
                    </Text>
                    <Block flex middle space="between">
                      <Block center flex>
                        {!this.state.isNext ? (
                          <Block flex>
                            <Block>
                              <Block
                                width={width * 0.8}
                                style={styles(this.props).nameMainContent}
                              >
                                <Input
                                  ref="name"
                                  placeholder={i18n.t("signup_screen_fullName")}
                                  style={styles(this.props).inputs}
                                  iconContent={
                                    <Icon
                                      name="profile-circle"
                                      family="NowExtra"
                                      style={styles(this.props).inputIcons}
                                    />
                                  }
                                  onChangeText={(name) =>
                                    this.nameHandler(name)
                                  }
                                  value={this.state.name}
                                />
                                {this.isFieldInError("name") &&
                                  this.getErrorsInField("name").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>
                              <Block width={width * 0.8}>
                                <Input
                                  ref="email"
                                  placeholder={i18n.t("common_email")}
                                  style={styles(this.props).inputs}
                                  iconContent={
                                    <Icon
                                      name="email-852x"
                                      family="NowExtra"
                                      style={styles(this.props).inputIcons}
                                    />
                                  }
                                  type="email-address"
                                  onChangeText={(email) =>
                                    this.emailHandler(email)
                                  }
                                  value={this.state.email}
                                  autoCapitalize="none"
                                  autoCorrect={false}
                                  autoCompleteType="email"
                                />
                                {this.isFieldInError("email") &&
                                  this.getErrorsInField("email").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>

                              <Block
                                width={width * 0.8}
                                style={styles(this.props).passwordMainContent}
                              >
                                <Input
                                  ref="password"
                                  placeholder={i18n.t("common_password")}
                                  password
                                  viewPass
                                  style={styles(this.props).inputs}
                                  iconContent={
                                    <Icon
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
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>
                              <Block
                                width={width * 0.8}
                                style={
                                  styles(this.props).confirmPasswordMainContent
                                }
                              >
                                <Input
                                  ref="confirmPassword"
                                  placeholder={i18n.t(
                                    "signup_screen_confirmPassword"
                                  )}
                                  password
                                  viewPass
                                  style={styles(this.props).inputs}
                                  iconContent={
                                    <Icon
                                      name="caps-small2x"
                                      family="NowExtra"
                                      style={styles(this.props).inputIcons}
                                    />
                                  }
                                  onChangeText={(confirmPassword) =>
                                    this.passwordConfirmHandler(confirmPassword)
                                  }
                                  value={this.state.confirmPassword}
                                />
                                {this.isFieldInError("confirmPassword") &&
                                  this.getErrorsInField("confirmPassword").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>

                              <Block
                                style={styles(this.props).boxMainContent}
                                width={width * 0.75}
                              >
                                <Checkbox
                                  checkboxStyle={{
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    borderColor: nowTheme.COLORS.PLATINUM,
                                  }}
                                  checked={this.state.termsCheck}
                                  color={nowTheme.COLORS.ACTIVE}
                                  labelStyle={styles(this.props).boxSubContent}
                                  label={i18n.t("signup_screen_agreeToTerms")}
                                  onChange={this.checkBoxHandler}
                                />
                              </Block>
                            </Block>
                            <Block center>
                              <Button
                                onPress={() => this.next()}
                                color="active"
                                round
                                style={styles(this.props).createButton}
                              >
                                <Text style={styles(this.props).boxText}>
                                  {i18n.t("signup_screen_next")}
                                </Text>
                              </Button>

                              <Block>
                                <Text
                                  center
                                  style={styles(this.props).boxTextOther}
                                >
                                  {i18n.t("signup_screen_alreadyRegistered")}{" "}
                                </Text>
                                <Text
                                  center
                                  style={styles(this.props).boxSubTextOther}
                                  onPress={() => navigation.navigate("Login")}
                                >
                                  {i18n.t("signup_screen_signInNow")}
                                </Text>
                              </Block>
                            </Block>
                          </Block>
                        ) : (
                          <Block flex>
                            <Block>
                              <Block
                                width={width * 0.8}
                                style={styles(this.props).birthdayaMainContent}
                              >
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({ showDate: true })
                                  }
                                >
                                  <Input
                                    ref="birthday"
                                    style={styles(this.props).inputs}
                                    placeholder={i18n.t("profile_dob")}
                                    iconContent={
                                      <Icon
                                        name="calendar-602x"
                                        family="NowExtra"
                                        style={styles(this.props).inputIcons}
                                      />
                                    }
                                    onChangeText={(text) =>
                                      this.setState({ birthday: text })
                                    }
                                    onTouchStart={() =>
                                      this.setState({ showDate: true })
                                    }
                                    showSoftInputOnFocus={false}
                                    editable={
                                      Platform.OS === "ios" ? false : false
                                    }
                                    value={this.state.birthday}
                                    color={nowTheme.COLORS.SECONDARY_TEXT}
                                  />
                                </TouchableOpacity>
                                {this.isFieldInError("birthday") &&
                                  this.getErrorsInField("birthday").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>
                              <Block
                                width={width * 0.8}
                                style={styles(this.props).provinceMainContent}
                              >
                                <ModalDropdown
                                  ref="province"
                                  defaultValue={i18n.t("central_province")}
                                  dropdownStyle={
                                    styles(this.props).DropdownOptionStyle
                                  }
                                  just
                                  style={styles(this.props).DropdownStyle}
                                  onSelect={(index, value) =>
                                    this.provinceHandler(value)
                                  }
                                  textStyle={{ color: nowTheme.COLORS.HEADER }}
                                  dropdownTextStyle={
                                    styles(this.props).DropdownTextStyle
                                  }
                                  dropdownListProps={{}}
                                  options={[
                                    i18n.t("central_province"),
                                    i18n.t("eastern_province"),
                                    i18n.t("north_central_province"),
                                    i18n.t("northern_province"),
                                    i18n.t("north_western_province"),
                                    i18n.t("sabaragamuwa_province"),
                                    i18n.t("southern_province"),
                                    i18n.t("uva_province"),
                                    i18n.t("western_province"),
                                  ]}
                                >
                                  <Block
                                    flex
                                    row
                                    middle
                                    space="between"
                                    style={
                                      styles(this.props).provinceSubContent
                                    }
                                  >
                                    <Block row>
                                      <Icon
                                        name="pin-32x"
                                        family="NowExtra"
                                        style={styles(this.props).inputIcons}
                                      />

                                      <Text
                                        style={
                                          styles(this.props).provinceTextContent
                                        }
                                      >
                                        {this.state.province == ""
                                          ? i18n.t("profile_province")
                                          : this.state.province}
                                      </Text>
                                    </Block>
                                    <Block>
                                      <Icon
                                        name="minimal-down2x"
                                        family="NowExtra"
                                        size={nowTheme.SIZES.SUB_SECONDARY_FONT}
                                        color={nowTheme.COLORS.HIT_GRAY}
                                      />
                                    </Block>
                                  </Block>
                                </ModalDropdown>
                                {this.isFieldInError("province") &&
                                  this.getErrorsInField("province").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>
                              <Block
                                width={width * 0.8}
                                style={styles(this.props).genderMainContent}
                              >
                                <ModalDropdown
                                  ref="gender"
                                  defaultValue={i18n.t("profile_gender")}
                                  dropdownStyle={[
                                    styles(this.props).DropdownOptionStyle,
                                    styles(this.props).genderDropDown,
                                  ]}
                                  style={styles(this.props).DropdownStyle}
                                  onSelect={(index, value) =>
                                    this.genderHandler(value)
                                  }
                                  textStyle={{ color: nowTheme.COLORS.HEADER }}
                                  dropdownTextStyle={
                                    styles(this.props).DropdownTextStyle
                                  }
                                  dropdownListProps={{}}
                                  options={[
                                    i18n.t("male"),
                                    i18n.t("female"),
                                    i18n.t("other"),
                                  ]}
                                >
                                  <Block
                                    flex
                                    row
                                    middle
                                    space="between"
                                    style={styles(this.props).singleMainContent}
                                  >
                                    <Block row>
                                      <Icon
                                        name="single"
                                        family="NowExtra"
                                        style={styles(this.props).inputIcons}
                                      />

                                      <Text
                                        style={
                                          styles(this.props).genderTextContent
                                        }
                                      >
                                        {this.state.gender == ""
                                          ? i18n.t("profile_gender")
                                          : this.state.gender}
                                      </Text>
                                    </Block>
                                    <Block>
                                      <Icon
                                        name="minimal-down2x"
                                        family="NowExtra"
                                        size={10}
                                        color={nowTheme.COLORS.HIT_GRAY}
                                      />
                                    </Block>
                                  </Block>
                                </ModalDropdown>
                                {this.isFieldInError("gender") &&
                                  this.getErrorsInField("gender").map(
                                    (errorMessage, index) => (
                                      <Block center key={index}>
                                        <Text
                                          style={styles(this.props).validation}
                                        >
                                          {errorMessage}
                                        </Text>
                                      </Block>
                                    )
                                  )}
                              </Block>
                            </Block>
                            <Block center>
                              <Button
                                onPress={this.registerSubmitHandler}
                                color="active"
                                round
                                style={styles(this.props).createButton}
                              >
                                <Text style={styles(this.props).boxText}>
                                  {i18n.t("signup_screen_getStarted")}
                                </Text>
                              </Button>

                              <Block>
                                <Text
                                  center
                                  style={styles(this.props).boxTextOther}
                                >
                                  {i18n.t("signup_screen_alreadyRegistered")}{" "}
                                </Text>
                                <Text
                                  center
                                  style={styles(this.props).boxSubTextOther}
                                  onPress={() => navigation.navigate("Login")}
                                >
                                  {i18n.t("signup_screen_signInNow")}
                                </Text>
                              </Block>
                            </Block>
                          </Block>
                        )}
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </ScrollView>
            </Block>
          </Block>
          <DateTimePicker
            isVisible={this.state.showDate}
            onConfirm={this.setStartDateHandler}
            mode="date"
            onCancel={this.onBlurDateTimeCloseHandler}
            display="spinner"
            date={new Date(this.defaultDate)}
          />
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = (props) =>
  StyleSheet.create({
    imageBackgroundContainer: {
      width: width,
      flex: 1,
      height: height < 812 ? height * 1.1 : height,
      padding: 0,
      zIndex: 1,
    },
    imageBackground: {
      width: width,
    },
    registerContainer: {
      justifyContent: "flex-start",
      width: width * 0.9,
      flex: 1,
      paddingVertical: 32,
      backgroundColor: nowTheme.COLORS.WHITE,
      borderRadius: 4,
      shadowColor: nowTheme.COLORS.BLACK,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 8,
      shadowOpacity: 0.1,
    },
    socialConnect: {
      backgroundColor: nowTheme.COLORS.WHITE,
      height: 10,
      justifyContent: "center",
      paddingVertical: 32,
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
      marginTop: 0,
      marginBottom: 20,
    },
    social: {
      width: theme.SIZES.BASE * 3.5,
      height: theme.SIZES.BASE * 3.5,
      borderRadius: theme.SIZES.BASE * 1.75,
      justifyContent: "center",
      marginHorizontal: 10,
    },
    DropdownStyle: {
      borderWidth: 1,
      borderColor: nowTheme.COLORS.PLATINUM,
      borderRadius: theme.SIZES.BASE * 3,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 32,
    },
    dropdown: {
      marginTop: 8,
      marginLeft: -16,
      width: 100,
      borderColor: "gray",
      borderWidth: 1,
    },
    DropdownOptionStyle: {
      marginTop: 8,
      width: width - theme.SIZES.BASE * 8,
      minHeight: 100,
      borderBottomEndRadius: 10,
      borderBottomStartRadius: 10,
    },
    DropdownTextStyle: {
      paddingHorizontal: nowTheme.SIZES.BASE,
      backgroundColor: "transparent",
      borderBottomEndRadius: 10,
      borderBottomStartRadius: 10,
    },
    mainContent: {
      height: 66,
    },
    mainContentHight: {
      marginTop: 66,
    },
    genderDropDown: {
      height: 108,
    },
    mainTitle: {
      fontFamily: "montserrat-regular",
      textAlign: "center",
      marginHorizontal: nowTheme.SIZES.BASE * 2,
      marginBottom: 8,
      color: nowTheme.COLORS.GITHUB,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PAGE_TITLE
          : nowTheme.SIZES.SUB_PAGE_TITLE,
    },
    nameMainContent: {
      marginBottom: 5,
    },
    validation: {
      fontFamily: "montserrat-regular",
      color: nowTheme.COLORS.RED,
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    birthdayaMainContent: {
      marginBottom: 10,
    },
    provinceMainContent: {
      marginBottom: 20,
    },
    provinceSubContent: {
      marginVertical: 8,
    },
    provinceTextContent: {
      fontFamily: "montserrat-regular",
      color: nowTheme.COLORS.MUTED,
      fontWeight: "400",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    genderMainContent: {
      marginBottom: 10,
    },
    genderTextContent: {
      fontFamily: "montserrat-regular",
      color: nowTheme.COLORS.MUTED,
      fontWeight: "400",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    passwordMainContent: {
      marginBottom: 5,
    },
    confirmPasswordMainContent: {
      marginBottom: 5,
    },
    boxMainContent: {
      marginVertical: theme.SIZES.BASE,
      marginLeft: 15,
    },
    boxSubContent: {
      color: nowTheme.COLORS.HEADER,
      fontFamily: "montserrat-regular",
    },
    boxText: {
      fontFamily: "montserrat-bold",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
      color: nowTheme.COLORS.WHITE,
    },
    boxTextOther: {
      color: nowTheme.COLORS.HEADER,
      fontFamily: "montserrat-regular",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    boxSubTextOther: {
      color: nowTheme.COLORS.RED,
      fontFamily: "montserrat-regular",
      fontSize:
        props.currentLanguage == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    singleMainContent: {
      marginVertical: 8,
    },
  });

function mapStateToProps(state) {
  return {
    signupLoading: state.auth.signup.loading,
    signupSuccess: state.auth.signup.success,
    signupfailed: state.auth.signup.failed,
    signupError: state.auth.signup.error,
    currentLanguage: state.auth.currentLanguage,
    language: state.language.languageSet,
    messages: i18n.translations,
    deviceLocale: i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signup: (userDetail) => {
      dispatch(authActions.registerUser(userDetail));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
