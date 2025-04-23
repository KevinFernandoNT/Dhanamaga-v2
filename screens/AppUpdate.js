import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import AppLink from "react-native-app-link";
import { Block, Button, Text, theme } from "galio-framework";
import { showMessage } from "react-native-flash-message";

const { height, width } = Dimensions.get("screen");
import { Images, nowTheme } from "../constants/";
import { connect } from "react-redux";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

import i18n from "i18n-js";

import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";
import { Platform } from "react-native";

class AppUpdate extends React.Component {
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
    selectedLanguage: "en",
    selectLanguageWaiting: false,
    isNewUserIn: "",
    bgImage: Images.LogoE,
    loader: true,
    // selectedLang: 'en'
  };

  setLanguage = async () => {
    let language = this.props.route.params.language;
    if (!language || language == null) {
      language = "en";
      i18n.locale = language;
      this.setIMage(language);
      await this.setState({ selectedLanguage: language });
    } else {
      i18n.locale = language;
      this.setIMage(language);
      await this.setState({ selectedLanguage: language });
    }
  };

  componentDidMount() {
    // const { navigation, dispatch } = this.props;
    // this.setState({ loader: true })
    this.setLanguage();
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }
  setIMage = (language) => {
    let image;
    switch (language) {
      case "en":
        image = Images.LogoE;
        break;
      case "si":
        image = Images.LogoS;
        break;
      case "ta":
        image = Images.LogoT;
        break;
      default:
        image = Images.LogoE;
        break;
    }
    this.setState({ bgImage: image });
  };

  handleIgnore = async () => {
    const { navigation } = this.props;
    // await AsyncStorage.removeItem('iosVersion')
    // await AsyncStorage.removeItem('androidVersion')
    navigation.goBack();
  };

  handleUpdate = () => {
    const { navigation } = this.props;
    let appName =
      Platform.OS == "ios" ? "DhanaMaga" : "DhanaMaga (ධනමග / தன மார்க்கம்)";
    let appStoreId = "1576484215";
    let appStoreLocale = "us";
    let playStoreId = "lk.dhanamaga";

    AppLink.openInStore({ appName, appStoreId, appStoreLocale, playStoreId })
      .then(() => {
        showMessage({
          message: i18n.t("appUpdate_update_state"),
          type: "warn",
          position: "bottom",
        });
      })
      .catch((err) => {
        {
          languageSelectSuccess &&
            navigation.dispatch({
              ...CommonActions.reset({
                index: 0,
                routes: [{ name: "App" }],
              }),
            });
        }
      });
  };

  render() {
    return (
      <Block style={styles(this.props).mainContanier}>
        <ImageBackground
          source={Images.bg}
          style={styles(this.props).imgBackground}
        >
          <Block style={styles(this.props).mainImageContanier}>
            <Image
              source={this.state.bgImage}
              style={styles(this.props).imag}
            />
          </Block>
          <Block style={styles(this.props).selectImageText}>
            <Block middle row>
              <Text
                color={nowTheme.COLORS.ACTIVE}
                size={
                  this.props.route.params.language == "en"
                    ? nowTheme.SIZES.PAGE_TITLE_SMALL
                    : nowTheme.SIZES.SUB_PAGE_TITLE_SMALL
                }
                style={styles(this.props).titleText}
                center
              >
                {i18n.t("appUpdate_title")}
              </Text>
            </Block>
            <Block middle row style={styles(this.props).languageBtnBlock}>
              <Block middle row style={styles(this.props).btnBlock}>
                {/* <Button
                  shadowless
                  style={styles(this.props).languageButton}
                  onPress={() => this.handleIgnore()}
                >
                  <Text
                    style={styles(this.props).btnText}
                    color={theme.COLORS.WHITE}
                    center
                  >
                    {i18n.t('appUpdate_ignore')}
                  </Text>
                </Button> */}

                <Button
                  shadowless
                  style={styles(this.props).languageButtonSelected}
                  onPress={() => this.handleUpdate()}
                >
                  <Text
                    style={styles(this.props).btnText}
                    color={theme.COLORS.WHITE}
                    center
                  >
                    {i18n.t("appUpdate_update")}
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = (props) =>
  StyleSheet.create({
    imgBackground: {
      flex: 8,
      resizeMode: "cover",
      flexDirection: "column",
    },

    mainContanier: {
      flex: 1,
      flexDirection: "column",
    },
    imag: {
      height: (height / 100) * 30,
      width: (width / 100) * 50,
      resizeMode: "contain",
    },
    languageBtnBlock: {
      marginTop: 30,
      marginBottom: 30,
    },
    languageButton: {
      backgroundColor: nowTheme.COLORS.BLACK,
      width:
        props.route.params.language == "ta"
          ? theme.SIZES.BASE * 8
          : theme.SIZES.BASE * 6,
      height: theme.SIZES.BASE * 3,
      shadowRadius: 0,
      shadowOpacity: 0,
      paddingHorizontal: 10,
    },
    button: {
      marginHorizontal: theme.SIZES.BASE * 3,
      flex: 1,
      shadowRadius: 0,
      shadowOpacity: 0,
    },
    languageButtonSelected: {
      backgroundColor: nowTheme.COLORS.ACTIVE,
      width:
        props.route.params.language == "ta"
          ? theme.SIZES.BASE * 8
          : theme.SIZES.BASE * 6,
      height: theme.SIZES.BASE * 3,
      shadowRadius: 0,
      shadowOpacity: 0,
      justifyContent: "space-evenly",
      paddingHorizontal: 10,
    },

    mainImageContanier: {
      flex: 5,
      alignItems: "center",
      justifyContent: "flex-end",
    },

    selectImageText: {
      flex: 3,
      alignItems: "center",
    },
    selectButton: {
      alignItems: "center",
    },
    screenTitleText: {
      fontFamily: "montserrat-regular",
    },
    languageText: {
      fontFamily: "montserrat-bold",
      fontSize:
        props.route.params.language == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
    titleText: {
      fontFamily: "montserrat-bold",
      marginHorizontal: 20,
    },
    btnText: {
      fontFamily: "montserrat-regular",
      fontSize:
        props.route.params.language == "en"
          ? nowTheme.SIZES.PRIMARY_FONT
          : nowTheme.SIZES.SUB_PRIMARY_FONT,
    },
  });

function mapStateToProps(state) {
  return {
    languageSelectLoading: state.auth.language.loading,
    languageSelectSuccess: state.auth.language.success,
    languageSelectFailed: state.auth.language.failed,
    languageSelectError: state.auth.language.error,
    language: state.language.languageSet,
    currentLanguage: state.auth.currentLanguage,
  };
}

export default connect(mapStateToProps)(AppUpdate);
