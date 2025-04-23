import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import ValidationComponent from "react-native-form-validator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";

import { Button, Input, Icon, Select } from "../components";
import { Images, nowTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { proPicUpload, userDataUpdate } from "../store/modules/auth/auth";
import { he } from "date-fns/locale";
import { constants } from "../constants";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class Profile extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      birthday: "",
      province: "",
      gender: "",
      showDate: false,
      enableUpdateBtn: false,
      isValidEmail: true,
      userImage: "",
      provinceList: [],
      genderList: [],
      hideUpdateButton: true,
    };
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    this.defaultDate = new Date();
    this.year = this.defaultDate.getFullYear();
    this.month = this.defaultDate.getMonth();
    this.day = this.defaultDate.getDate();
    this.defaultDate.setFullYear(
      this.year - constants.REVERSE_YEAR,
      this.month,
      this.day
    );
  }

  setStartDateHandler = (date) => {
    let formatDate = format(date, "yyyy-MM-dd");
    this.setState({ showDate: false });
    if (date) {
      this.setState({ birthday: formatDate });
      this.setState({ enableUpdateBtn: true });
    } else {
      this.setState({ birthday: "" });
    }
  };

  componentDidMount() {
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      this.loadUserData();
    });
    this.loadUserData();
    this.loadProvinceAndGenderList();
    this.forceUpdate();
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => this._keyboardDidShow(e)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (e) => this._keyboardDidHide(e)
    );
  }

  async loadUserData() {
    const user = await AsyncStorage.getItem("auth_user");
    const currentUser = JSON.parse(user);
    this.setState({
      name: currentUser.fullName,
      email: currentUser.email,
      birthday: currentUser.dateOfBirth ? currentUser.dateOfBirth : "",
      province: currentUser.province
        ? currentUser.province
        : "Select Province...",
      gender: currentUser.gender ? currentUser.gender : "Select Gender...",
      showDate: false,
      enableUpdateBtn: false,
      isValidEmail: true,
      userImage: currentUser.profileImage ? currentUser.profileImage : null,
    });
  }

  eventCheck = (field, value) => {
    this.setState({ enableUpdateBtn: true });
    this.validate({
      name: { required: true },
      email: { email: true, required: true },
      birthday: { required: true },
    });
    this.setState({ [field]: value });
  };

  loadProvinceAndGenderList = () => {
    this.setState({
      provinceList: [
        "Central",
        "Eastern",
        "North Central",
        "Northern",
        "North Western",
        "Sabaragamuwa",
        "Southern",
        "Uva",
        "Western",
      ],
      genderList: ["Male", "Female", "Other"],
    });
  };
  onBlurDateTimeCloseHandler = () => {
    this.setState({ showDate: false });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    this.setState({ hideUpdateButton: false });
  }

  _keyboardDidHide() {
    this.setState({ hideUpdateButton: true });
  }

  handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({ userImage: result.uri });
        this.createFormData(result);
      }
    }
  };

  createFormData = async (photo) => {
    const data = new FormData(photo);
    let uri = photo.uri;
    let fileType = uri.substring(uri.lastIndexOf(".") + 1);
    let fileTypeAndroid = `${photo.type}/${fileType}`;
    await data.append("files", {
      uri,
      name: `photo.${fileType}`,
      type: Platform.OS === "ios" ? `${fileType}` : fileTypeAndroid,
    });
    this.props.proPicUpload(data);
  };

  updateProfileHandler = () => {
    Keyboard.dismiss();
    this.validate({
      name: { required: true },
      email: { email: true, required: true },
      birthday: { required: true },
    });
    if (this.isFormValid()) {
      this.setState({ enableUpdateBtn: false });
      let userDetais = {
        username: this.state.email,
        fullName: this.state.name,
        email: this.state.email,
        dateOfBirth: this.state.birthday,
        province: this.state.province,
        gender: this.state.gender,
      };
      this.props.userDataUpdate(userDetais);
    }
  };

  getValue(index, value) {}
  render() {
    const primaryFontSize =
      this.props.currentLanguage == "en"
        ? nowTheme.SIZES.FONT
        : nowTheme.SIZES.SUB_FONT; //14
    return (
      <DismissKeyboard>
        <SafeAreaView style={styles.container}>
          <Block style={styles.containee}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              enableAutomaticScroll={Platform.OS === "ios"}
              keyboardShouldPersistTaps={"always"}
            >
              <Block flex style={styles.imgBackContainer}>
                <ScrollView keyboardShouldPersistTaps={"always"}>
                  <ImageBackground
                    source={Images.ProfileBackground}
                    style={styles.profileContainer}
                    imageStyle={styles.profileBackground}
                  >
                    <Block flex>
                      <Block style={styles.imageContainer}>
                        <Block middle style={styles.imageContainerBlock}>
                          <TouchableOpacity
                            onPress={() => this.handleChoosePhoto()}
                          >
                            <Image
                              source={
                                this.state.userImage
                                  ? { uri: this.state.userImage }
                                  : Images.ProfilePicture
                              }
                              style={styles.avatar}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        </Block>

                        <Block
                          style={
                            Platform.OS === "android"
                              ? styles.androidMarginTop
                              : styles.iosMarginTop
                          }
                        >
                          <Block middle>
                            <TouchableOpacity
                              style={styles.changePassTitle}
                              onPress={() =>
                                this.props.navigation.navigate("ChangePassword")
                              }
                            >
                              <Text
                                center
                                style={styles.textStylePasswordChange}
                              >
                                {i18n.t("change_password_title")}
                              </Text>
                            </TouchableOpacity>
                            <Block
                              width={width * 0.8}
                              style={styles.BlockMargin}
                            >
                              <Input
                                ref="name"
                                placeholder=""
                                label={i18n.t("profile_fullName")}
                                style={styles.inputs}
                                noIcon
                                onChangeText={(e) => this.eventCheck("name", e)}
                                value={this.state.name}
                                color={nowTheme.COLORS.SECONDARY_TEXT}
                              />
                              {this.isFieldInError("name") &&
                                this.getErrorsInField("name").map(
                                  (errorMessage, index) => (
                                    <Block center key={index}>
                                      <Text
                                        color={nowTheme.COLORS.ERROR}
                                        style={styles.fontFamilyStyle}
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
                                placeholder=""
                                label={i18n.t("common_email")}
                                style={styles.inputs}
                                noIcon
                                onChangeText={(e) =>
                                  this.eventCheck("email", e)
                                }
                                value={this.state.email}
                                color={nowTheme.COLORS.SECONDARY_TEXT}
                              />
                              {this.isFieldInError("email") &&
                                this.getErrorsInField("email").map(
                                  (errorMessage, index) => (
                                    <Block center key={index}>
                                      <Text
                                        color={nowTheme.COLORS.ERROR}
                                        style={styles.fontFamilyStyle}
                                      >
                                        {errorMessage}
                                      </Text>
                                    </Block>
                                  )
                                )}
                            </Block>
                            <Block
                              width={width * 0.8}
                              style={styles.birthdayContent}
                            >
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ showDate: true })
                                }
                              >
                                <Input
                                  ref="birthday"
                                  placeholder="Select Birthday..."
                                  label={i18n.t("profile_dob")}
                                  style={styles.inputs}
                                  noIcon
                                  onChangeText={(text) =>
                                    this.setState({ birthday: text })
                                  }
                                  onConfirm={(e) =>
                                    this.eventCheck("birthday", e)
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
                                        color={nowTheme.COLORS.ERROR}
                                        style={styles.fontFamilyStyle}
                                      >
                                        {errorMessage}
                                      </Text>
                                    </Block>
                                  )
                                )}
                            </Block>
                            <Block
                              width={width * 0.8}
                              style={styles.BlockMargin}
                            >
                              <Text
                                style={styles.selectTitle}
                                color={nowTheme.COLORS.BLACK}
                                size={theme.SIZES.INPUT_LABEL_TEXT}
                              >
                                {i18n.t("profile_province")}
                              </Text>
                              <Select
                                ref="province"
                                defaultValue=""
                                value={this.state.province}
                                textStyle={{ fontSize: primaryFontSize }}
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
                                color={nowTheme.COLORS.PRIMARY}
                                style={styles.selects}
                                label={i18n.t("profile_province")}
                                onSelect={(index, value) =>
                                  this.eventCheck("province", value)
                                }
                                dropdownStyle={[styles.DropdownOptionStyle]}
                                dropdownTextStyle={styles.DropdownTextStyle}
                              />
                            </Block>
                            <Block
                              width={width * 0.8}
                              style={styles.BlockMargin}
                            >
                              <Text
                                style={styles.selectTitle}
                                color={nowTheme.COLORS.GITHUB}
                                size={primaryFontSize}
                              >
                                {i18n.t("profile_gender")}
                              </Text>
                              <Select
                                ref="gender"
                                value={this.state.gender}
                                options={[
                                  i18n.t("male"),
                                  i18n.t("female"),
                                  i18n.t("other"),
                                ]}
                                color={nowTheme.COLORS.PRIMARY}
                                textStyle={{
                                  fontSize: nowTheme.primaryFontSize,
                                }}
                                style={styles.selects}
                                label={i18n.t("profile_gender")}
                                onSelect={(index, value) =>
                                  this.eventCheck("gender", value)
                                }
                                dropdownStyle={[
                                  styles.DropdownOptionStyleGender,
                                ]}
                                dropdownTextStyle={styles.DropdownTextStyle}
                              />
                            </Block>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                    {!this.state.hideUpdateButton ? (
                      <Button
                        disabled={!this.state.enableUpdateBtn}
                        onPress={this.updateProfileHandler}
                        color={
                          !this.state.enableUpdateBtn ? "disable" : "active"
                        }
                        style={styles.createButton}
                      >
                        <Text
                          style={styles.fontFamilyStyle}
                          size={primaryFontSize}
                          color={nowTheme.COLORS.WHITE}
                        >
                          {i18n.t("profile_updateProfile")}
                        </Text>
                      </Button>
                    ) : null}
                  </ImageBackground>
                </ScrollView>
              </Block>
            </KeyboardAwareScrollView>

            <Block />
          </Block>

          {this.state.hideUpdateButton ? (
            <Block style={styles.ButtonBlockStyle}>
              <Button
                disabled={!this.state.enableUpdateBtn}
                onPress={this.updateProfileHandler}
                color={!this.state.enableUpdateBtn ? "disable" : "active"}
                style={styles.createButton}
              >
                <Text
                  style={styles.fontFamilyStyle}
                  size={primaryFontSize}
                  color={nowTheme.COLORS.WHITE}
                >
                  {i18n.t("profile_updateProfile")}
                </Text>
              </Button>
            </Block>
          ) : null}

          <DateTimePicker
            isVisible={this.state.showDate}
            onConfirm={this.setStartDateHandler}
            mode="date"
            onCancel={this.onBlurDateTimeCloseHandler}
            display="spinner"
            date={
              new Date(
                this.state.birthday ? this.state.birthday : this.defaultDate
              )
            }
          />
        </SafeAreaView>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? HeaderHeight + 15 : HeaderHeight,
    zIndex: -1,
  },
  ButtonBlockStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },

  ButtonBlockStyleOther: {
    position: "relative",
  },
  containee: {
    flex: 1,

    flexDirection: "column",
    justifyContent: "space-between",
  },
  BlockMargin: { marginBottom: 5 },
  imageContainer: {
    width: width,
    zIndex: 5,
    paddingHorizontal: 20,
  },
  imageContainerBlock: {
    top: Platform.OS === "android" ? height * 0.2 : height * 0.25,
  },
  createButton: {
    width: width * 0.96,
  },
  profileContainer: {
    width,
    flex: 1,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width,
    height: Platform.OS === "android" ? height * 0.27 : height * 0.33,
  },
  inputs: {
    borderWidth: 1,
    borderColor: nowTheme.COLORS.GRAY,
    borderRadius: 21.5,
  },
  selects: {
    borderWidth: 1,
    borderColor: nowTheme.COLORS.GRAY,
    borderRadius: 21.5,
    width: "100%",
    marginBottom: nowTheme.SIZES.BASE,
  },
  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 57,
    borderWidth: 0,
    backgroundColor: "white",
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
  },
  selectTitle: {
    marginLeft: nowTheme.SIZES.BASE,
    marginBottom: nowTheme.SIZES.BASE / 2,
    fontWeight: "500",
  },
  imgBackContainer: { height: height < 812 ? height * 1.2 : height * 1.15 },
  changePassTitle: { marginVertical: 10 },

  androidMarginTop: { marginTop: height * 0.21 },
  iosMarginTop: {
    marginTop: height * 0.25,
  },
  fontFamilyStyle: { fontFamily: "montserrat-bold" },
  textStylePasswordChange: {
    fontFamily: "montserrat-regular",
    textDecorationLine: "underline",
  },
  DropdownOptionStyle: {
    marginTop: 15,
    width: width * 0.7,
    minHeight: 100,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  DropdownOptionStyleGender: {
    marginTop: 15,
    width: width * 0.7,
    height: 80,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  DropdownTextStyle: {
    paddingHorizontal: nowTheme.SIZES.BASE,
    backgroundColor: "transparent",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  birthdayContent: {
    marginBottom: nowTheme.SIZES.BASE,
  },
});

function mapStateToProps(state) {
  return {
    messages: i18n.translations,
    deviceLocale: i18n.locale,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      proPicUpload,
      userDataUpdate,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
