import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Linking, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Block, Text, theme } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import Images from "../constants/Images";
import {
  DrawerItem as DrawerCustomItem,
  Icon,
  DrawerHeader,
} from "../components";
import nowTheme from "../constants/Theme";
import { logoutUser, resetToken } from "../store/modules/auth";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

const CustomDrawerContent = ({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) => {
  const { languageSet } = useSelector((state) => state.language);

  useEffect(() => {
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }, []);

  const dispatch = useDispatch();

  const [languages, setLanguage] = useState();
  const [token, setToken] = useState();
  const [version, setVersion] = useState();
  const [IosVersion, setIosVersion] = useState();

  const { loading, success, falied, error } = useSelector(
    (state) => state.auth.logout
  );

  const disatchFuction = () => {
    dispatch(resetToken()).then((res) => {
      if (res) {
        dispatch({ type: "AUTH_TOKEN", payload: false });
        dispatch({ type: "RESET_AUTH" });
        dispatch(logoutUser());
      }
    });
  };

  // const changeUserLanguage = (selectedLanguage) => {
  //   dispatch(setUserLanguage(selectedLanguage))
  // }

  const getLanguage = async () => {
    await AsyncStorage.getItem("selectedLanguage").then((userLanguage) => {
      setLanguage(userLanguage);
    });
    await AsyncStorage.getItem("token").then((token) => {
      setToken(token);
    });

    await AsyncStorage.getItem("androidVersion").then((androidVersion) => {
      setVersion(androidVersion);
    });
    await AsyncStorage.getItem("iosVersion").then((iosVersion) => {
      setIosVersion(iosVersion);
    });
  };

  useEffect(() => {
    getLanguage();
  }, [languages, token]);

  const screens = ["Home", "Course Details", "My Timeline", "My Bookmarked"];

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block style={styles.header}>
        <DrawerHeader Images={Images} navigation={navigation} />
        {/* <Block right style={styles.headerIcon}>
          <Icon
            name="align-left-22x"
            family="NowExtra"
            size={15}
            color={nowTheme.COLORS.BLACK}
          />
        </Block> */}
      </Block>
      <Block flex style={styles.darwerCustom}>
        <ScrollView style={styles.flexDir} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                itemIndex={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
                token={token}
              />
            );
          })}
          <Block flex style={styles.mainBlock}>
            <Block style={styles.customStyles} />
            <Text color={nowTheme.COLORS.BLACK} style={styles.customTextStyles}>
              {i18n.t("drawer_yourLanguage")}
            </Text>
            <DrawerCustomItem
              title="English"
              focused={languages == "en" ? true : false}
              languageLoading={languageSet.loading}
              languageSuccess={languageSet.success}
              languageFailed={languageSet.falied}
              languageError={languageSet.error}
              navigation={navigation}
            />
            <DrawerCustomItem
              title="සිංහල"
              focused={languages == "si" ? true : false}
              languageLoading={languageSet.loading}
              languageSuccess={languageSet.success}
              languageFailed={languageSet.falied}
              languageError={languageSet.error}
              navigation={navigation}
            />
            <DrawerCustomItem
              title="தமிழ்"
              focused={languages == "ta" ? true : false}
              languageLoading={languageSet.loading}
              languageSuccess={languageSet.success}
              languageFailed={languageSet.falied}
              languageError={languageSet.error}
              navigation={navigation}
            />
          </Block>
          <DrawerCustomItem
            logoutUser={() => disatchFuction()}
            logoutLoading={loading}
            logoutSuccess={success}
            logoutFailed={falied}
            logoutError={error}
            title="LOGOUT"
            navigation={navigation}
            token={token}
          />
          <DrawerCustomItem title="Disclaimer" navigation={navigation} />
          <DrawerCustomItem title="Terms of use" navigation={navigation} />
          <DrawerCustomItem title="Privacy Policy" navigation={navigation} />
          <Text color={nowTheme.COLORS.BLACK} style={styles.drawerText}>
            {i18n.t("drawer_followUsOn")}
          </Text>
          <Block flex row style={styles.socialIcon}>
            <Icon
              onPress={() =>
                Linking.openURL(
                  "https://www.facebook.com/AsiaSecuritiesSriLanka/"
                )
              }
              name="facebook-with-circle"
              family="Entypo"
              size={35}
              color={nowTheme.COLORS.LIGHTBLUE}
            />
            <Icon
              onPress={() =>
                Linking.openURL(
                  "https://www.linkedin.com/company/asia-securities-private-limited/mycompany/"
                )
              }
              style={styles.socialIconStyle}
              name="linkedin-square"
              family="AntDesign"
              size={35}
              color="blue"
            />
          </Block>
          <Block style={styles.builtBy}>
            <Text style={styles.builtByText}>
              Built with Love by{" "}
              <Text
                style={styles.builtByLink}
                onPress={() => Linking.openURL("https://nuclei.tech/")}
              >
                Nuclei
              </Text>
            </Text>
          </Block>
          {Platform.OS == "android" ? (
            <Block style={styles.version}>
              <Text
                style={styles.versionStyle}
                color={nowTheme.COLORS.LIGHTBLUECOLOR}
              >
                Version: {version}
              </Text>
            </Block>
          ) : (
            <Block style={styles.version}>
              <Text
                style={styles.versionStyle}
                color={nowTheme.COLORS.LIGHTBLUECOLOR}
              >
                Version: {IosVersion}
              </Text>
            </Block>
          )}
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
    backgroundColor: nowTheme.COLORS.DRAWER_HEADER_BACKGROUND,
  },
  headerIcon: {
    marginTop: -20,
  },
  logo: {
    height: 40,
    width: 40,
    margin: 8,
  },
  profileCard: {
    justifyContent: "space-evenly",
    paddingLeft: nowTheme.SIZES.BASE,
  },
  profileName: {
    color: nowTheme.COLORS.WHITE,
    fontWeight: "bold",
    fontSize: nowTheme.SIZES.BASE * 1.3,
  },
  profile: {
    color: nowTheme.COLORS.WHITE,
    fontWeight: "bold",
    opacity: nowTheme.SIZES.OPACITY,
    fontSize: nowTheme.SIZES.BASE * 0.8,
    marginTop: -8,
  },
  builtBy: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  version: {
    marginLeft: 20,
    marginBottom: 5,
  },
  builtByText: {
    color: nowTheme.COLORS.TEXT,
    fontFamily: "montserrat-bold",
  },
  builtByLink: {
    color: nowTheme.COLORS.LIGHTBLUECOLOR,
    fontFamily: "montserrat-bold",
  },
  versionStyle: {
    fontFamily: "montserrat-regular",
    fontSize: nowTheme.SIZES.BUTTON_TEXT_SMALL,
  },
  darwerCustom: {
    paddingLeft: 8,
    paddingRight: 14,
  },
  customStyles: {
    borderColor: nowTheme.COLORS.BORDER_COLOR,
    width: "93%",
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
  mainBlock: {
    marginTop: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  customTextStyles: {
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: "montserrat-regular",
    fontWeight: "300",
    fontSize: (nowTheme.SIZES.MEDIUM_FONT_SIZE / 4) * 3.5,
  },
  drawerText: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: "montserrat-regular",
    fontWeight: "300",
    fontSize: (nowTheme.SIZES.MEDIUM_FONT_SIZE / 4) * 3.5,
  },
  socialIcon: {
    marginVertical: 5,
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  socialIconStyle: {
    marginLeft: 15,
  },
  flexDir: {
    flex: 1,
  },
});

export default CustomDrawerContent;
