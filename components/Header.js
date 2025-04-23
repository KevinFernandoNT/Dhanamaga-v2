import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  Image,
} from "react-native";
import {
  Button,
  Block,
  NavBar,
  Text,
  theme,
  Button as GaButton,
} from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import Icon from "./Icon";
import Input from "./Input";
import Tabs from "./Tabs";
import nowTheme from "../constants/Theme";
import { block } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Images } from "../constants/";
import { connect } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import reducer from "../store/modules/auth";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

const { height, width } = Dimensions.get("window");

class Header extends React.Component {
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
  };

  handleLeftPress = () => {
    const { back, navigation, currentRoute } = this.props;
    // return back ? navigation.goBack() :navigation.openDrawer()
    return back
      ? currentRoute == "CourseDetails" || "Profile"
        ? navigation.dispatch({
            ...CommonActions.reset({
              index: 0,
              routes: [{ name: "App" }],
            }),
          })
        : navigation.goBack()
      : navigation.openDrawer();
  };
  renderRight = () => {
    const { white, title, navigation, tokenStatus } = this.props;
    if (title == "Home" && !tokenStatus) {
      return (
        <Block flex row center style={styles.rightContentMain}>
          <Block flex={0.35}>
            <TouchableOpacity
              style={styles.signInButtonCont}
              onPress={() => navigation.navigate("Login")}
            >
              <Text center style={styles.signInButton}>
                {i18n.t("header_login")}
              </Text>
            </TouchableOpacity>
          </Block>
          <Block flex={0.2}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text center style={styles.signUpButtonText}>
                {i18n.t("header_signUp")}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      );
    }
  };
  renderSearch = () => {
    const { navigation, currentLanguage } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={nowTheme.COLORS.MUTED}
        // onFocus={() => {Keyboard.dismiss(); navigation.navigate('Pro')}}
        iconContent={
          <Icon
            size={
              currentLanguage == "en"
                ? nowTheme.SIZES.FONT
                : nowTheme.SIZES.SUB_FONT
            }
            color={theme.COLORS.MUTED}
            name="zoom-bold2x"
            family="NowExtra"
          />
        }
      />
    );
  };
  renderOptions = () => {
    const { navigation, optionLeft, optionRight, currentLanguage } = this.props;
    const fontSize =
      currentLanguage == "en" ? nowTheme.SIZES.FONT : nowTheme.SIZES.SUB_FONT; //16
    const mediumFontSize =
      currentLanguage == "en"
        ? nowTheme.SIZES.MEDIUM_FONT_SIZE
        : nowTheme.SIZES.SUB_MEDIUM_FONT_SIZE; //18
    return (
      <Block row style={styles.options}>
        <Button
          shadowless
          style={[styles.tab, styles.divider]}
          onPress={() => console.log(navigation.navigate("Home"))}
        >
          <Block row middle>
            <Icon
              name="bulb"
              family="NowExtra"
              size={mediumFontSize}
              style={styles.padding_R}
              color={nowTheme.COLORS.HEADER}
            />
            <Text
              style={styles.textFontFamily}
              size={fontSize}
              style={styles.tabTitle}
            >
              {optionLeft || "Beauty"}
            </Text>
          </Block>
        </Button>
        <Button
          shadowless
          style={styles.tab}
          onPress={() => navigation.navigate("Home")}
        >
          <Block row middle>
            <Icon
              size={mediumFontSize}
              name="bag-162x"
              family="NowExtra"
              style={styles.padding_R}
              color={nowTheme.COLORS.HEADER}
            />
            <Text
              style={styles.textFontFamily}
              size={fontSize}
              style={styles.tabTitle}
            >
              {optionRight || "Fashion"}
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={(id) => navigation.setParams({ tabId: id })}
      />
    );
  };
  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {/* {options ? this.renderOptions() : null} */}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    const lang = await AsyncStorage.getItem("selectedLanguage");
    i18n.locale = lang;
    i18n.fallbacks = true;
    this.setState({ token: token });
    this.forceUpdate();
  }

  setLocalizedLabel = () => {
    const { title } = this.props;

    switch (title) {
      case "Home":
        return "";
      case "My Timeline":
        return `${i18n.t("header_myTimeline")}`;
      case "My Bookmarked":
        return `${i18n.t("header_myBookmarked")}`;
      case "Courses":
        return `${i18n.t("header_courses")}`;
      case "Sample Videos":
        return `${i18n.t("header_sampleVideos")}`;
      case "Course Details":
        return `${i18n.t("header_courseDetails")}`;
      case "Create Account":
        return `${i18n.t("header_createAcount")}`;
      case "Login":
        return `${i18n.t("header_login")}`;
      case "Profile":
        return `${i18n.t("header_profile")}`;
      case "Language Select":
        return `${i18n.t("header_languageSelect")}`;
      case "Reset Your Password":
        return `${i18n.t("header_resetPassword")}`;
      case "Change Password":
        return `${i18n.t("header_changePassword")}`;
      case "Privacy Policy":
        return `${i18n.t("drawer_privacyPolicy")}`;
      case "Terms Of Use":
        return `${i18n.t("drawer_termsOfUse")}`;
      case "Disclaimer":
        return `${i18n.t("drawer_disclaimer")}`;
      case "Most Watched Videos":
        return `${i18n.t("home_screen_mostWatchedVideos")}`;
      case "Trending Videos":
        return `${i18n.t("home_screen_trendingVideos")}`;
      default:
        if (title.substring(0, 19) == "Search Results of :") {
          return `${i18n.t("header_serch_result_of")}` + title.substring(19);
        } else {
          return title;
        }
        break;
    }
  };

  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      contentOverlaps,
      ...props
    } = this.props;

    const noShadow = [
      "Search",
      "Categories",
      "Deals",
      "Pro",
      "Profile",
    ].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      { backgroundColor: nowTheme.COLORS.HEADER_BACKGROUND },
      { paddingBottom: 40 },
    ];
    const lable = title === "Home" ? "" : title;
    var headerLogo = Images.LogoER;
    if (i18n.locale == "si") {
      headerLogo = Images.LogoSR;
    } else if (i18n.locale == "ta") {
      headerLogo = Images.LogoTR;
    } else {
      headerLogo = Images.LogoER;
    }

    return (
      <Block style={headerStyles}>
        {/* {title=="Home" ? (
          <Block style={styles.logContainer}>
            <Image source={Images.LogoER} style={{ width:70, height: 56 }}  onPress={this.handleLeftPress} />
          </Block>
        ) : (<></>)} */}

        <NavBar
          back={false}
          title={this.setLocalizedLabel()}
          style={navbarStyles}
          right={this.renderRight()}
          rightStyle={styles.center}
          left={
            <Block flex={1} row style={styles.leftContentMain}>
              <TouchableOpacity onPress={this.handleLeftPress}>
                <Icon
                  name={back ? "minimal-left2x" : "align-left-22x"}
                  family="NowExtra"
                  size={
                    this.props.currentLanguage == "en"
                      ? nowTheme.SIZES.MEDIUM_PRIMARY_FONT_SIZE
                      : nowTheme.SIZES.SUB_MEDIUM_PRIMARY_FONT_SIZE
                  }
                  onPress={this.handleLeftPress}
                  color={nowTheme.COLORS.WHITE}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
              <Block>
                <Image
                  source={headerLogo}
                  style={styles.imageStyle}
                  onPress={this.handleLeftPress}
                />
              </Block>
            </Block>
          }
          titleStyle={[
            styles.title,
            { color: nowTheme.COLORS.WHITE },
            titleColor && { color: titleColor },
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    position: "relative",
  },
  marginLeftStyle: {
    marginLeft: -40,
  },
  imageStyle: {
    width: 70,
    height: 56,
    marginLeft: 7,
  },
  title: {
    paddingTop: 0,
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "montserrat-regular",
    marginLeft: 140,
  },
  iconStyle: {
    marginRight: 10,
    width: 20,
    height: 20,
    marginTop: 20,
    marginLeft: 0,
  },
  blockContainer: {
    flex: 1,
    flexDirection: "row",
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop:
      Platform.OS === "android"
        ? 40
        : Platform.OS === "ios" &&
          (height === 812 ||
            width === 812 ||
            height === 896 ||
            width === 896 ||
            height === 844 ||
            height === 926)
        ? 80
        : 65,
    // paddingTop: Platform.OS === 'android' ? theme.SIZES.BASE * 2.5 : theme.SIZES.BASE * 3.5,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "400",
    color: nowTheme.COLORS.HEADER,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
  },
  signUpButton: {
    // marginRight: 105,
    paddingVertical: 10,
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 5,
    width: (Dimensions.get("window").width / 4) * 0.9,
    alignItems: "center",
  },
  signInButtonCont: {
    paddingVertical: 10,
    borderRadius: 5,
    width: (Dimensions.get("window").width / 4) * 0.9,
    alignItems: "center",
  },
  signUpButtonText: {
    paddingHorizontal: 10,
    color: nowTheme.COLORS.WHITE,
    fontSize: nowTheme.SIZES.BUTTON_TEXT_SMALL,
  },
  signInButton: {
    paddingHorizontal: 10,
    color: nowTheme.COLORS.WHITE,
    fontSize: nowTheme.SIZES.BUTTON_TEXT_SMALL,
  },
  logContainer: {
    paddingVertical: 10,
    display: "flex",
    alignItems: "center",
    backgroundColor: nowTheme.COLORS.HEADER_BACKGROUND,
  },
  padding_R: {
    paddingRight: nowTheme.SIZES.BASE / 2,
  },
  textFontFamily: {
    fontFamily: "montserrat-regular",
  },
  center: {
    alignItems: "center",
  },
  rightContentMain: {
    marginRight: (width / 2) * 0.15,
    width: (width / 2) * 1.5,
  },
  leftContentMain: {
    width: (width / 2) * 1,
  },
});

function mapStateToProps(state) {
  return {
    tokenStatus: state.auth.tokenStatus,
    currentRoute: state.home.currentRoute,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,
  };
}

export default withNavigation(connect(mapStateToProps)(Header));
