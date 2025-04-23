import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { connect } from "react-redux";
import { withNavigation } from "@react-navigation/compat";
import Icon from "./Icon";
import nowTheme from "../constants/Theme";
// import Home from "../screens/Home";
import * as authActions from "../store/actions";
import { Dimensions } from "react-native";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

class DrawerItem extends React.Component {
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
    token: null,
    drawerLogoutLoading: false,
    drawerSelectLanguageLoading: false,
  };

  async componentDidMount() {
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    i18n.locale = defaultLang;
    i18n.fallbacks = true;
    this.forceUpdate();
  }

  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            name="app2x"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "My Timeline":
        return (
          <Icon
            name="atom2x"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "My Bookmarked":
        return (
          <Icon
            name="paper"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "Profile":
        return (
          <Icon
            name="profile-circle"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "Terms of use":
        return (
          <Icon
            name="badge2x"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "Privacy Policy":
        return (
          <Icon
            name="settings-gear-642x"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
            style={styles.icon}
          />
        );
      case "Disclaimer":
        return (
          <Icon
            name="album"
            family="NowExtra"
            size={14}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
          />
        );
      case "GETTING STARTED":
        return (
          <Icon
            name="spaceship2x"
            family="NowExtra"
            size={18}
            style={styles.borderedIcon}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
          />
        );
      case "LOGOUT":
        return (
          <Icon
            name="share"
            family="NowExtra"
            size={18}
            style={styles.borderedIcon}
            color={focused ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT : "black"}
          />
        );
      default:
        return null;
    }
  };

  renderFontSize = (itemIndex, title) => {
    if (
      itemIndex === 0 ||
      itemIndex === 1 ||
      itemIndex === 2 ||
      itemIndex === 3 ||
      title === "LOGOUT" ||
      title === "YOUR LANGUAGE"
    ) {
      return (nowTheme.SIZES.FONT / 4) * 3;
    } else if (
      title === "Terms of use" ||
      title === "Privacy Policy" ||
      title === "Disclaimer"
    ) {
      return nowTheme.SIZES.SMALL_FONT;
    } else {
      return nowTheme.SIZES.SECONDARY_FONT;
    }
  };

  setLocalizationTitle = () => {
    const { title } = this.props;

    switch (title) {
      case "Home":
        return `${i18n.t("drawer_home")}`;
      case "Course Details":
        return `${i18n.t("drawer_courseDetails")}`;
      case "My Timeline":
        return `${i18n.t("drawer_myTimeline")}`;
      case "My Bookmarked":
        return `${i18n.t("drawer_myBookmarked")}`;
      case "Terms of use":
        return `${i18n.t("drawer_termsOfUse")}`;
      case "Privacy Policy":
        return `${i18n.t("drawer_privacyPolicy")}`;
      case "Disclaimer":
        return `${i18n.t("drawer_disclaimer")}`;
      case "LOGOUT":
        return `${i18n.t("drawer_logout")}`;
      case "English":
        return "English";
      case "සිංහල":
        return "සිංහල";
      case "தமிழ்":
        return "தமிழ்";
      default:
        return title;
    }
  };

  navigationProcess = async (navigation, title) => {
    if (title == "LOGOUT") {
      this.setState({ drawerLogoutLoading: true });
      await this.props.logoutUser();
      navigation.reset({
        routes: [{ name: "App" }],
      });
    } else if (title == "English") {
      this.setState({ drawerSelectLanguageLoading: true });
      await this.props.setLanguage("en");
      await AsyncStorage.setItem("selectedLanguage", "en");
      navigation.reset({
        routes: [{ name: "App" }],
      });
    } else if (title == "සිංහල") {
      this.setState({ drawerSelectLanguageLoading: true });
      await this.props.setLanguage("si");
      await AsyncStorage.setItem("selectedLanguage", "si");
      navigation.reset({
        routes: [{ name: "App" }],
      });
    } else if (title == "தமிழ்") {
      this.setState({ drawerSelectLanguageLoading: true });
      await this.props.setLanguage("ta");
      await AsyncStorage.setItem("selectedLanguage", "ta");
      navigation.reset({
        routes: [{ name: "App" }],
      });
    } else if (title == "My Bookmarked") {
      if (!this.props.token) {
        navigation.navigate("Login");
      } else {
        navigation.navigate(title, { screen: "myBookmarked" });
      }
    } else if (title == "My Timeline") {
      if (!this.props.token) {
        navigation.navigate("Login");
      } else {
        navigation.navigate(title, { screen: "myTimeline" });
      }
    } else if (title == "Course Details") {
      navigation.navigate("Courses", { screen: "courses" });
    } else if (title == "Disclaimer") {
      navigation.navigate(title, { screen: "Disclaimer" });
    } else if (title == "Terms Of Use") {
      navigation.navigate(title, { screen: "TermsOfUse" });
    } else if (title == "Privacy Policy") {
      navigation.navigate(title, { screen: "PrivacyPolicy" });
    } else {
      navigation.navigate(title);
    }
  };

  checkLogout = () => {
    let { drawerLogoutLoading } = this.state;
    let {
      logoutLoading,
      logoutFailed,
      logoutSuccess,
      navigation,
      logoutError,
    } = this.props;

    if (!logoutLoading && drawerLogoutLoading) {
      if (!logoutFailed) {
        this.setState({ drawerLogoutLoading: false });
        {
          logoutSuccess && navigation.navigate("Home");
        }
      } else {
        Alert.alert("", logoutError, [{ text: "OK" }], {
          cancelable: false,
        });
        this.setState({ drawerLogoutLoading: false });
        this.resetState();
      }
    }
  };

  checkLanguageSelect = () => {
    let { drawerSelectLanguageLoading } = this.state;
    let {
      languageLoading,
      languageFailed,
      languageSuccess,
      navigation,
      languageError,
    } = this.props;

    if (!languageLoading && drawerSelectLanguageLoading) {
      if (!languageFailed) {
        this.setState({ drawerSelectLanguageLoading: false });
        {
          languageSuccess && navigation.navigate("Home");
        }
      } else {
        Alert.alert("", languageError, [{ text: "OK" }], {
          cancelable: false,
        });
        this.setState({ drawerSelectLanguageLoading: false });
        this.resetState();
      }
    }
  };

  render() {
    const { focused, title, itemIndex, navigation } = this.props;

    const containerStyles = [styles.defaultStyle];
    // {this.state.drawerLogoutLoading && this.checkLogout()}
    // {this.state.drawerSelectLanguageLoading && this.checkLanguageSelect()}
    return (
      <>
        {!this.props.token && title == "LOGOUT" ? (
          <Block style={styles.blockLogout} />
        ) : (
          <TouchableOpacity
            style={styles.thouchableOpacity}
            onPress={() => this.navigationProcess(navigation, title)}
          >
            <Block flex row style={containerStyles}>
              <Block middle flex={0.1} style={styles.subContainer}>
                {/* {this.renderIcon()} */}
              </Block>
              <Block row center flex={0.9}>
                <Text
                  style={styles.text}
                  size={this.renderFontSize(itemIndex, title)}
                  bold={focused ? true : false}
                  color={
                    focused
                      ? nowTheme.COLORS.DRAWER_ACTIVE_TEXT
                      : nowTheme.COLORS.BLACK
                  }
                >
                  {this.setLocalizationTitle()}
                </Text>
              </Block>
            </Block>
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    // paddingHorizontal: 14,
    color: nowTheme.COLORS.BLACK,
  },
  activeStyle: {
    backgroundColor: nowTheme.COLORS.DRAWER_ACTIVE_BACKGROUND,
    borderRadius: 30,
    marginVertical: 8,
    color: nowTheme.COLORS.BLACK,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
  thouchableOpacity: {
    //height: 60
  },
  subContainer: {
    marginRight: 0,
  },
  text: {
    fontFamily: "montserrat-regular",
    textTransform: "uppercase",
    fontWeight: "300",
  },
  icon: {
    opacity: 0.5,
  },
  borderedIcon: {
    borderColor: "rgba(0,0,0,0.5)",
    opacity: 0.5,
  },
  blockLogout: {
    borderColor: nowTheme.COLORS.BORDER_COLOR,
    width: "93%",
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
});

function mapStateToProps(state) {
  return {
    currentLanguage: state.auth.currentLanguage,
    language: state.language.languageSet,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLanguage: (userLanguage) => {
      dispatch(authActions.setUserLanguage(userLanguage));
    },
  };
}

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(DrawerItem)
);
