import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Platform,
  AlertIOS,
  Keyboard,
} from "react-native";
import { Block, theme, Text } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import i18n from "i18n-js";
import { Card, Button, Search, Loader } from "../components";
import courses from "../constants/courses";
import { nowTheme, Images, constants } from "../constants";
import * as homeActions from "../store/actions";
import { showMessage } from "react-native-flash-message";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";
const { width } = Dimensions.get("screen");

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {},
      sampleVideosReqLoading: false,
      randomTopicVideoLoading: false,
      mostWatchedicVideoLoading: false,
      trendingVideoLoading: false,
      token: null,
      heroImage: Images.HomeBackground,
      removeSearchView: true,
      verticalScroll: 0,
      defaultLanuage: "",
    };
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    this.ScrollView = React.createRef();
  }

  async componentDidMount() {
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      const token = await AsyncStorage.getItem("token");

      this.setState({ token: token });
      let defaultLang = await AsyncStorage.getItem("selectedLanguage");
      this.setState({ defaultLanuage: defaultLang });
      this.setHeroImage(defaultLang);
      i18n.locale = defaultLang;
      i18n.fallbacks = true;
      this.setState({ sampleVideosReqLoading: true });
      this.setState({
        randomTopicVideoLoading: true,
        mostWatchedicVideoLoading: true,
        trendingVideoLoading: true,
      });

      this.props.getRandomTopic(defaultLang);
      this.props.getSampleVideos(defaultLang);
      this.props.getmostWatchedLessons(defaultLang);
      this.props.gettrendingLessons(defaultLang);

      {
        (this.state.sampleVideosReqLoading ||
          this.state.randomTopicVideoLoading ||
          this.state.mostWatchedicVideoLoading ||
          this.state.trendingVideoLoading) &&
          this.checkLogin();
      }
      this.forceUpdate();
    });
  }

  componentDidUpdate(preProps) {
    if (this.props.heroImages.heroImageE != preProps.heroImages.heroImageE) {
      this.setHeroImage(this.state.defaultLanuage);
    }
  }

  autosScroll() {
    let verticalScroll = this.state.verticalScroll - 10;
    this.ScrollView.scrollTo({ x: 0, y: verticalScroll, animated: true });
  }

  autosScrollTop() {
    if (this.state.removeSearchView) {
      let verticalScroll = 0;
      this.ScrollView.scrollTo({ x: 0, y: verticalScroll, animated: true });
    }
  }

  logout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      await AsyncStorage.removeItem("token");
    }
  };

  setHeroImage(language) {
    let { heroImages } = this.props;
    let heroImage;
    switch (language) {
      case "en":
        heroImage =
          heroImages?.heroImageE !== [] ? heroImages?.heroImageE?.url : null;
        break;
      case "si":
        heroImage =
          heroImages?.heroImageS !== []
            ? heroImages?.heroImageS?.url
            : heroImages?.heroImageE !== []
            ? heroImages?.heroImageE?.url
            : null;
        break;
      case "ta":
        heroImage =
          heroImages?.heroImageT !== []
            ? heroImages?.heroImageT?.url
            : heroImages?.heroImageE !== []
            ? heroImages?.heroImageE?.url
            : null;
        break;
      default:
        heroImage =
          heroImages?.heroImageE !== [] ? heroImages.heroImageE?.url : null;
        break;
    }
    this.setState({
      heroImage: heroImage ? { uri: heroImage } : Images.HomeBackground,
    });
  }

  checkView = () => {
    this.setState({ removeSearchView: true });
  };

  onFoucs = () => {
    this.setState({ removeSearchView: true });
    this.autosScroll();
  };

  searchItem = () => {
    this.autosScrollTop();
  };

  renderArticles = () => {
    const {
      navigation,
      sampleVideosSuccess,
      randomTopicSuccess,
      mostWatchedSuccess,
      tendingViedsSuccess,
      tokenStatus,
    } = this.props;
    const { token } = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
        nestedScrollEnabled={true}
        ref={(ref) => (this.ScrollView = ref)}
        onScroll={(event) =>
          this.setState({
            horizontalScroll: 0,
            VerticalScroll: event.nativeEvent.contentOffset.y,
          })
        }
        keyboardShouldPersistTaps="always"
      >
        <Block
          onStartShouldSetResponder={(evt) => {
            evt.persist();
            this.setState({ removeSearchView: false });
            this.autosScrollTop();
            Keyboard.dismiss();
          }}
          style={styles.ImageContainer}
        >
          <Image
            resizeMode="stretch"
            source={this.state.heroImage}
            style={styles.imageContainer}
          />
        </Block>
        <Block
          onStartShouldSetResponder={(evt) => {
            evt.persist();
            this.checkView();
          }}
          flex
          style={styles.blockContainer}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            this.setState({ verticalScroll: layout.y });
          }}
        >
          <Search
            pressSearchItem={this.searchItem}
            onFoucs={this.onFoucs}
            checkView={this.checkView}
            removeSearchView={this.state.removeSearchView}
            placeholder={i18n.t("home_screen_searchPlaceholder")}
            {...this.props}
          />
        </Block>
        <Block
          onStartShouldSetResponder={(evt) => {
            evt.persist();
            this.setState({ removeSearchView: false });
            this.autosScrollTop();
            Keyboard.dismiss();
          }}
        >
          <Block flex style={styles.blockContainer}>
            <Block flex row style={styles.BlockStyle}>
              <Text>{i18n.t("home_screen_courses")}</Text>
            </Block>
            {randomTopicSuccess != undefined &&
              randomTopicSuccess !== [] &&
              (randomTopicSuccess.watchProgress ? (
                <Card
                  onpress={"Course Details"}
                  item={randomTopicSuccess}
                  idStatus={true}
                  ratings={randomTopicSuccess.rating ? true : false}
                  progress
                  value={randomTopicSuccess.watchProgress}
                  horizontal
                />
              ) : (
                <Card
                  onpress={"Course Details"}
                  item={randomTopicSuccess}
                  idStatus={true}
                  ratings={randomTopicSuccess.rating ? true : false}
                  horizontal
                />
              ))}
            <TouchableOpacity
              style={styles.btnShowAll}
              onPress={() =>
                this.props.navigation.navigate("Courses", { screen: "courses" })
              }
            >
              <Text color="white" style={styles.viewAllBUtton}>
                {i18n.t("home_screen_view_all_courses")}
              </Text>
            </TouchableOpacity>
          </Block>
          <Block flex style={styles.blockContainer}>
            <Block flex row style={styles.BlockStyle}>
              <Text>{i18n.t("home_screen_sampleVideos")}</Text>
              <TouchableOpacity
                style={styles.autoMarginLeft}
                onPress={() =>
                  this.props.navigation.navigate("Sample Videos", {
                    screen: "sampleVideos",
                  })
                }
              >
                <Text color="red">{i18n.t("common_viewAll")}</Text>
              </TouchableOpacity>
            </Block>
            {sampleVideosSuccess && sampleVideosSuccess.length != 0 && (
              <Block>
                <Block style={styles.sampleVideos}>
                  {sampleVideosSuccess[0] && (
                    <Card
                      style={styles.card}
                      onpress={"Course Details"}
                      item={sampleVideosSuccess[0]}
                      sample={true}
                    />
                  )}
                  {sampleVideosSuccess[1] && (
                    <Card
                      style={styles.card}
                      onpress={"Course Details"}
                      item={sampleVideosSuccess[1]}
                      sample={true}
                    />
                  )}
                </Block>
                <Block style={styles.sampleVideos}>
                  {sampleVideosSuccess[2] && (
                    <Card
                      style={styles.card}
                      onpress={"Course Details"}
                      item={sampleVideosSuccess[2]}
                      sample={true}
                    />
                  )}
                  {sampleVideosSuccess[3] && (
                    <Card
                      style={styles.card}
                      onpress={"Course Details"}
                      item={sampleVideosSuccess[3]}
                      sample={true}
                    />
                  )}
                </Block>
              </Block>
            )}
          </Block>
          {tendingViedsSuccess && tendingViedsSuccess.length != 0 && (
            <Block flex style={styles.blockContainer}>
              <Block flex row style={styles.BlockStyle}>
                <Text>{i18n.t("home_screen_trendingVideos")}</Text>
                <TouchableOpacity
                  style={styles.autoMarginLeft}
                  onPress={() =>
                    this.props.navigation.navigate("Trending Videos", {
                      screen: "Trending Videos",
                    })
                  }
                >
                  <Text color="red">{i18n.t("common_viewAll")}</Text>
                </TouchableOpacity>
              </Block>

              <Block>
                <Block style={styles.sampleVideos}>
                  {tendingViedsSuccess.lessons.map((item, key) => {
                    if (key < 2) {
                      let sample = this.props.tokenStatus
                        ? true
                        : item.isFree
                        ? true
                        : false;
                      return (
                        <Card
                          style={styles.card}
                          key={key}
                          onpress={"Login"}
                          item={item}
                          sample={sample}
                        />
                      );
                    }
                  })}
                </Block>
              </Block>
            </Block>
          )}
          {mostWatchedSuccess && mostWatchedSuccess.length != 0 && (
            <Block flex style={styles.blockContainer}>
              <Block flex row style={styles.BlockStyle}>
                <Text>{i18n.t("home_screen_mostWatchedVideos")}</Text>
                <TouchableOpacity
                  style={styles.autoMarginLeft}
                  onPress={() =>
                    this.props.navigation.navigate("Most Watched Videos", {
                      screen: "Most Watched Videos",
                    })
                  }
                >
                  <Text color="red">{i18n.t("common_viewAll")}</Text>
                </TouchableOpacity>
              </Block>

              <Block>
                <Block style={styles.sampleVideos}>
                  {mostWatchedSuccess.lessons.map((item, key) => {
                    if (key < 2) {
                      let sample = this.props.tokenStatus
                        ? true
                        : item.isFree
                        ? true
                        : false;
                      return (
                        <Card
                          style={styles.card}
                          key={key}
                          onpress={"Login"}
                          item={item}
                          sample={sample}
                        />
                      );
                    }
                  })}
                </Block>
              </Block>
            </Block>
          )}
        </Block>
      </ScrollView>
    );
  };

  checkLogin() {
    const {
      sampleVideosReqLoading,
      randomTopicVideoLoading,
      mostWatchedicVideoLoading,
      trendingVideoLoading,
    } = this.state;
    const {
      navigation,
      sampleVideosLoading,
      sampleVideosFailed,
      sampleVideosSuccess,
      sampleVideosError,
      randomTopicLoading,
      randomTopicSuccess,
      randomTopicFailed,
      randomTopicError,

      mostWatchedLoading,
      mostWatchedSuccess,
      mostWatchedFailed,
      mostWatchedError,

      tendingviedsLoading,
      tendingViedsSuccess,
      tendingViedsFailed,
      tendingViedsError,
    } = this.props;

    if (!sampleVideosLoading && sampleVideosReqLoading) {
      if (!sampleVideosSuccess && !Array.isArray(sampleVideosError)) {
        const message = sampleVideosError.data.data[0].messages[0].message;
        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }
      this.setState({ sampleVideosReqLoading: false });
    }

    if (!randomTopicLoading && randomTopicVideoLoading) {
      if (!randomTopicSuccess && !Array.isArray(randomTopicError)) {
        const message =
          randomTopicError &&
          randomTopicError.data &&
          randomTopicError.data.data
            ? randomTopicError.data.data[0].messages[0].message
            : i18n.t("something_went_wrong");

        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }

      this.setState({ randomTopicVideoLoading: false });
    }

    if (!mostWatchedLoading && mostWatchedicVideoLoading) {
      if (!mostWatchedSuccess && !Array.isArray(tendingViedsError)) {
        const message =
          tendingViedsError &&
          tendingViedsError.data &&
          tendingViedsError.data.data
            ? tendingViedsError.data.data[0].messages[0].message
            : i18n.t("something_went_wrong");

        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }

      this.setState({ tendingviedsicVideoLoading: false });
    }
    if (!tendingviedsLoading && trendingVideoLoading) {
      if (!tendingViedsSuccess && !Array.isArray(mostWatchedError)) {
        const message =
          mostWatchedError &&
          mostWatchedError.data &&
          mostWatchedError.data.data
            ? mostWatchedError.data.data[0].messages[0].message
            : i18n.t("something_went_wrong");

        showMessage({
          message: message,
          type: "warn",
          position: "bottom",
        });
      }

      this.setState({ trendingVideoLoading: false });
    }
  }

  render() {
    let {
      sampleVideosReqLoading,
      randomTopicVideoLoading,
      mostWatchedicVideoLoading,
    } = this.state;
    return (
      <Block flex center style={styles.home}>
        <Loader
          show={
            sampleVideosReqLoading &&
            randomTopicVideoLoading &&
            mostWatchedicVideoLoading
          }
        />
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: nowTheme.COLORS.BORDER_COLOR_ON_WHITE_BG,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  blockContainer: {
    backgroundColor: nowTheme.COLORS.WHITE,
    padding: nowTheme.SIZES.BASE,
    marginBottom: nowTheme.SIZES.BASE / 2,
  },
  ImageContainer: {
    // marginTop: nowTheme.SIZES.BASE/2
  },
  articles: {
    width: width,
    fontFamily: "montserrat-regular",
  },
  sampleVideos: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  card: {
    margin: nowTheme.SIZES.BASE / 4,
  },
  btnShowAll: {
    flex: 1,
    backgroundColor: nowTheme.COLORS.DRAWER_HEADER_BACKGROUND,
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    marginTop: 8,
  },
  imageContainer: {
    width: width,
    height: (Dimensions.get("window").width / 100) * 60,
  },
  BlockStyle: {
    marginTop: nowTheme.SIZES.BASE,
  },
  autoMarginLeft: {
    marginLeft: "auto",
  },
  viewAllBUtton: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

function mapStateToProps(state) {
  return {
    sampleVideosLoading: state.home.sampleVideos.loading,
    sampleVideosSuccess: state.home.sampleVideos.success,
    sampleVideosFailed: state.home.sampleVideos.failed,
    sampleVideosError: state.home.sampleVideos.error,

    randomTopicLoading: state.home.randomTopic.loading,
    randomTopicSuccess: state.home.randomTopic.success,
    randomTopicFailed: state.home.randomTopic.failed,
    randomTopicError: state.home.randomTopic.error,

    mostWatchedLoading: state.home.mostWatchedLessons.loading,
    mostWatchedSuccess: state.home.mostWatchedLessons.success,
    mostWatchedFailed: state.home.mostWatchedLessons.failed,
    mostWatchedError: state.home.mostWatchedLessons.error,

    tendingViedsLoading: state.home.trendingLessons.loading,
    tendingViedsSuccess: state.home.trendingLessons.success,
    tendingViedsFailed: state.home.trendingLessons.failed,
    tendingViedsError: state.home.trendingLessons.error,

    tokenStatus: state.auth.tokenStatus,
    language: state.language.languageSet,
    heroImages: state.language.heroImageSet,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSampleVideos: (userLanguage) => {
      dispatch(homeActions.getSampleLessons(userLanguage));
    },
    getRandomTopic: (userLanguage) => {
      dispatch(homeActions.getRandomTopic(userLanguage));
    },
    getmostWatchedLessons: (userLanguage) => {
      dispatch(homeActions.getmostWatchedLessons(userLanguage, 2));
    },
    gettrendingLessons: (userLanguage) => {
      dispatch(homeActions.getTrendingLessons(userLanguage, 2));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
