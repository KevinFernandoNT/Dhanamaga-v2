import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  ImageBackground,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import i18n from "i18n-js";
import sinhala from "../constants/languages/sinhala.json";
import english from "../constants/languages/english.json";
import tamil from "../constants/languages/tamil.json";

import Articles from "./Articles";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";

// Now UI themed components
import { Images, nowTheme, articles, tabs } from "../constants";
// import { Button, Select, Icon, Input, Header, Switch } from '../components';
// import { Button, Icon, Input, Loader } from '../components';

import Img from "../components/Img";
import { Card, CourseBlock, Loader } from "../components";
import {
  getTrendingLessons,
  getmostWatchedLessons,
} from "../store/modules/home/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bindActionCreators } from "redux";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const EmptyComponent = ({ messageHandler }) => (
  <Block flex center style={styles.EmptyComponentStyle}>
    <Text center style={styles.EmptyComponentTextStyle}>
      {messageHandler()}
    </Text>
  </Block>
);
class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      trendingVideosReqLoading: false,
      mostWatchedVideosReqLoading: false,
      screen: "",
      pageNo: 1,
      token: null,
    };
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
  }

  componentDidMount() {
    this.setState({ screen: this.props.route.params.screen });
    this.getDataHandler();
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      this.setState({ items: [] });
      this.getDataHandler();
    });
  }

  componentWillUnmount() {
    this.setState({ items: [] });
  }

  getMessageHandler = () => {
    if (this.state.screen == "Trending Videos") {
      return `${i18n.t("empty_message_trending_videos")}`;
    } else if (this.state.screen == "Most Watched Videos") {
      return `${i18n.t("empty_message_most_watched_videos")}`;
    }
  };

  getDataHandler = async () => {
    const token = await AsyncStorage.getItem("token");
    this.setState({ token: token });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    if (this.state.screen == "Trending Videos") {
      this.setState({ trendingVideosReqLoading: true, loading: true });
      this.props.getTrendingLessons(defaultLang).then((res) => {
        this.fullLoader();
        this.setState({ loading: false });
      });
    } else if (this.state.screen == "Most Watched Videos") {
      this.setState({ mostWatchedVideosReqLoading: true, loading: true });
      this.props.getmostWatchedLessons(defaultLang).then((res) => {
        this.fullLoader();
        this.setState({ loading: false });
      });
    }
  };

  renderItem = (item, index) => {
    const { token } = this.state;
    let sample = this.props.tokenStatus ? true : item.isFree ? true : false;
    return (
      <CourseBlock index item={item} horizontal watchedVideo sample={sample} />
    );
  };

  renderCards = () => {
    const { trendingVideosSuccess, mostWatchedSuccess } = this.props;
    let data = this.state.items;
    if (
      trendingVideosSuccess &&
      trendingVideosSuccess.length != 0 &&
      this.state.screen == "Trending Videos"
    ) {
      data = [...data, ...trendingVideosSuccess.lessons];
    } else if (
      mostWatchedSuccess &&
      mostWatchedSuccess.length != 0 &&
      this.state.screen == "Most Watched Videos"
    ) {
      data = [...data, ...mostWatchedSuccess.lessons];
    }
    return (
      <Block flex style={styles.cardContainer}>
        <Loader
          show={
            this.state.trendingVideosReqLoading ||
            this.state.mostWatchedVideosReqLoading
          }
        />
        {!this.state.loading ? (
          data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${item.title}_${index}`}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyComponent messageHandler={this.getMessageHandler} />
          )
        ) : null}
      </Block>
    );
  };

  fullLoader = () => {
    if (
      this.state.trendingVideosReqLoading &&
      this.state.screen == "Trending Videos"
    ) {
      const checkLoading = () => {
        let { trendingVideosReqLoading } = this.state;
        let {
          trendingVideosLoading,
          trendingVideosFailed,
          trendingVideosError,
        } = this.props;

        if (!trendingVideosLoading && trendingVideosReqLoading) {
          if (!trendingVideosFailed) {
            this.setState({ trendingVideosReqLoading: false });
          } else {
            this.setState({ trendingVideosReqLoading: false });
            Alert.alert("", trendingVideosError, [{ text: "OK" }], {
              cancelable: false,
            });
          }
        }
      };
      checkLoading();
    } else if (
      this.state.mostWatchedVideosReqLoading &&
      this.state.screen == "Most Watched Videos"
    ) {
      const checkLoading = () => {
        let { mostWatchedVideosReqLoading } = this.state;
        let {
          mostWatchedLoading,
          mostWatchedFailed,
          mostWatchedSuccess,
          navigation,
          mostWatchedError,
        } = this.props;

        if (!mostWatchedLoading && mostWatchedVideosReqLoading) {
          if (!mostWatchedFailed) {
            {
              mostWatchedSuccess &&
                this.setState({ mostWatchedVideosReqLoading: false });
            }
          } else {
            this.setState({ mostWatchedVideosReqLoading: false });
            Alert.alert("", mostWatchedError, [{ text: "OK" }], {
              cancelable: false,
            });
          }
        }
      };
      checkLoading();
    }
  };
  render() {
    return (
      <Block flex center style={styles.container}>
        {this.renderCards()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Platform.OS === "android" ? theme.SIZES.BASE : 0,
    marginLeft: Platform.OS === "ios" ? 10 : 40,
  },
  title: {
    fontFamily: "montserrat-bold",
    paddingBottom: theme.SIZES.BASE,
    color: nowTheme.COLORS.HEADER,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  categoryTitle: {
    height: "100%",
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4,
    marginHorizontal: 10,
  },
  albumThumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  EmptyComponentStyle: {
    marginVertical: "70%",
  },
  EmptyComponentTextStyle: {
    fontFamily: "montserrat-bold",
  },
  cardContainer: {
    paddingBottom: 30,
    width: Platform.OS === "android" ? width : width * 0.98,
  },
});

function mapStateToProps(state) {
  return {
    mostWatchedLoading: state.home.mostWatchedLessons.loading,
    mostWatchedSuccess: state.home.mostWatchedLessons.success,
    mostWatchedFailed: state.home.mostWatchedLessons.failed,
    mostWatchedError: state.home.mostWatchedLessons.error,

    trendingVideosLoading: state.home.trendingLessons.loading,
    trendingVideosSuccess: state.home.trendingLessons.success,
    trendingVideosFailed: state.home.trendingLessons.failed,
    trendingVideosError: state.home.trendingLessons.error,

    tokenStatus: state.auth.tokenStatus,
    language: state.language.languageSet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTrendingLessons,
      getmostWatchedLessons,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);
