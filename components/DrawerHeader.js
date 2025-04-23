import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Block, Text } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import i18n from "i18n-js";
import { nowTheme } from "../constants";
import { parse } from "react-native-svg";

import * as authActions from "../store/actions";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

import { connect } from "react-redux";
class DrawerHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolTipVisible: false,
      defaultLang: "en",
    };

    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }

  componentDidMount() {
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      let defaultLang = await AsyncStorage.getItem("selectedLanguage");
      this.setState({ defaultLang: defaultLang });
    });
  }

  render() {
    const { navigation, Images } = this.props;

    let { currentuser, tokenStatus } = this.props;
    return (
      <Block>
        {tokenStatus ? (
          <Block style={styles.blockContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <Image
                style={styles.logo}
                source={
                  currentuser && currentuser.profileImage
                    ? { uri: currentuser.profileImage }
                    : Images.User
                }
              />
            </TouchableOpacity>
            <Block style={styles.profileCard}>
              <Tooltip
                isVisible={this.state.toolTipVisible}
                content={
                  <Text style={styles.tooltipText}>
                    {currentuser ? currentuser.fullName : "name"}
                  </Text>
                }
                placement="bottom"
                onClose={() => this.setState({ toolTipVisible: false })}
                animated={false}
                contentStyle={{
                  backgroundColor: nowTheme.COLORS.HEADER_BACKGROUND,
                }}
                topAdjustment={0}
                backgroundColor={"transparent"}
              >
                <Text
                  onPress={() => this.setState({ toolTipVisible: true })}
                  numberOfLines={1}
                  style={styles.profileName}
                >
                  {currentuser ? currentuser.fullName : "name"}
                </Text>
              </Tooltip>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Profile");
                }}
              >
                <Text style={styles.profile}>
                  {i18n.t("drawer_viewProfile")}
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        ) : (
          <Block style={styles.loginBlockContainer}>
            <Block style={styles.subLoginBlockContainer}>
              <Block flex={1} left>
                <Image style={styles.logo} source={Images.User} />
              </Block>
              <Block flex={1}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text style={[styles.signUpButton, styles.loginButton]}>
                    {i18n.t("header_login")}
                  </Text>
                </TouchableOpacity>
              </Block>
              <Block flex={1}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text style={styles.signUpButton}>
                    {i18n.t("header_signUp")}
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>
        )}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blockContainer: {
    flexDirection: "row",
  },
  loginBlockContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLoginBlockContainer: {
    flexDirection: "row",
    margin: 8,
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 40,
    margin: 8,
    borderRadius: 20,
  },
  profileCard: {
    justifyContent: "space-evenly",
    paddingLeft: nowTheme.SIZES.BASE,
  },
  profileName: {
    width: nowTheme.SIZES.BASE * 10,
    color: nowTheme.COLORS.WHITE,
    flexWrap: "nowrap",
    fontWeight: "bold",
    fontSize: nowTheme.SIZES.BASE * 1.3,
    textTransform: "capitalize",
  },
  profile: {
    color: nowTheme.COLORS.WHITE,
    fontWeight: "bold",
    opacity: nowTheme.SIZES.OPACITY,
    fontSize: nowTheme.SIZES.BASE * 0.8,
    marginTop: -8,
  },
  signUpButton: {
    // margin: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: nowTheme.COLORS.HEADER_BACKGROUND,
    borderRadius: 5,
    //width: 95,
    alignItems: "center",
    textAlign: "center",
    color: nowTheme.COLORS.WHITE,
    fontSize: nowTheme.SIZES.BUTTON_TEXT_SMALL,
  },
  loginButton: {
    marginRight: 5,
  },
  tooltipText: {
    color: "white",
  },
});
function mapStateToProps(state) {
  return {
    currentuser: state.auth.user,
    tokenStatus: state.auth.tokenStatus,
    language: state.language.languageSet,
  };
}
export default connect(mapStateToProps)(DrawerHeader);
