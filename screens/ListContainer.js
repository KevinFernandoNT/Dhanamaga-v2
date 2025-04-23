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

import Articles from "../screens/Articles";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";

// Now UI themed components
import { Images, nowTheme, articles, tabs } from "../constants";
// import { Button, Select, Icon, Input, Header, Switch } from '../components';
// import { Button, Icon, Input, Loader } from '../components';

import Img from "../components/Img";
import { Card, CourseBlock, Loader } from "../components";
import {
  getAllCourses,
  getAllBookmarkedCourses,
  getAllTimelineCourses,
  getAllSampleVideos,
} from "../store/modules/courses/courses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bindActionCreators } from "redux";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const EmptyComponent = ({ messageHandler }) => (
  <Block flex center style={styles.emptyComponent}>
    <Text center style={styles.emptyComponentText}>
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
      coursesReqLoading: false,
      bookmarkedCoursesReqLoading: false,
      timelineCoursesReqLoading: false,
      sampleAllVideosReqLoading: false,
      screen: "",
      pageNo: 1,
      token: null,
      loadMore: 0,
      loadMoreInc: 9,
    };
    const updatedTranslations = {
      en: this.props?.language?.english?.en || english.en,
      si: this.props?.language?.sinhala?.si || sinhala.si,
      ta: this.props?.language?.tamil?.ta || tamil.ta,
    };

    i18n.translations = updatedTranslations;
    // this.renderCards = this.renderCards.bind(this);
    this.flatListRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ screen: this.props.route.params.screen });
    this.listnerr = this.props.navigation.addListener("focus", async () => {
      this.setState({ items: [] });
      this.getDataHandler();
    });
    // this.props.navigation.addListener('blur', async () => {
    //     this.handleBackButtonClick()
    //   });
  }

  // handleBackButtonClick() {
  //     this.props.navigation.reset({
  //       routes: [{ name: 'App' }],
  //     })
  //   }

  componentWillUnmount() {
    this.setState({ items: [] });
  }

  getMessageHandler = () => {
    if (this.state.screen == "courses") {
      return `${i18n.t("empty_message_courses")}`;
    } else if (this.state.screen == "search") {
      return `${i18n.t("empty_message_search")}`;
    } else if (this.state.screen == "myTimeline") {
      return `${i18n.t("empty_message_timeline")}`;
    } else if (this.state.screen == "myBookmarked") {
      return `${i18n.t("empty_message_bookmarked")}`;
    } else if (this.state.screen == "sampleVideos") {
      return `${i18n.t("empty_message_sampleVideos")}`;
    }
  };

  getDataHandler = async () => {
    const token = await AsyncStorage.getItem("token");
    this.setState({ token: token });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    if (this.state.screen == "courses" || this.state.screen == "search") {
      this.setState({ coursesReqLoading: true, loading: true });
      this.props
        .getAllCourses(defaultLang, this.state.pageNo, this.props.route.name)
        .then((res) => {
          this.fullLoader();
          this.setState({ loading: false });
        });
    } else if (this.state.screen == "sampleVideos") {
      this.setState({ sampleAllVideosReqLoading: true, loading: true });
      this.props
        .getAllSampleVideos(defaultLang, this.state.pageNo)
        .then((res) => {
          this.fullLoader();
          this.setState({ loading: false });
        });
    } else if (this.state.screen == "myTimeline") {
      this.setState({ timelineCoursesReqLoading: true, loading: true });
      this.props
        .getAllTimelineCourses(defaultLang, this.state.pageNo)
        .then((res) => {
          this.fullLoader();
          this.setState({ loading: false });
        });
    } else if (this.state.screen == "myBookmarked") {
      this.setState({ bookmarkedCoursesReqLoading: true, loading: true });
      this.props
        .getAllBookmarkedCourses(defaultLang, this.state.pageNo)
        .then((res) => {
          this.fullLoader();
          this.setState({ loading: false });
        });
    }
  };

  loadMoreCourses = async (data) => {
    let { loadMore, loadMoreInc } = this.state;
    this.setState({ items: data });
    this.setState({
      pageNo: this.state.pageNo + 1,
      loadMore: loadMore + loadMoreInc,
      loadMoreInc: 10,
    });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    this.setState({ coursesReqLoading: true });
    this.props.getAllCourses(
      defaultLang,
      this.state.pageNo,
      this.props.route.name
    );
    this.setState({ coursesReqLoading: false });
  };

  loadMoreSampleVideos = async (data) => {
    let { loadMore, loadMoreInc } = this.state;
    this.setState({ items: data });
    this.setState({
      pageNo: this.state.pageNo + 1,
      loadMore: loadMore + loadMoreInc,
      loadMoreInc: 10,
    });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    this.setState({ sampleAllVideosReqLoading: true });
    await this.props.getAllSampleVideos(defaultLang, this.state.pageNo);
    this.setState({ sampleAllVideosReqLoading: false });
  };

  loadMoreMyTimelineCourses = async (data) => {
    let { loadMore, loadMoreInc } = this.state;
    this.setState({ items: data });
    this.setState({
      pageNo: this.state.pageNo + 1,
      loadMore: loadMore + loadMoreInc,
      loadMoreInc: 10,
    });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    this.setState({ timelineCoursesReqLoading: true });
    await this.props.getAllTimelineCourses(defaultLang, this.state.pageNo);
    this.setState({ timelineCoursesReqLoading: false });
  };

  loadMoreMyBookmarkedCourses = async (data) => {
    let { loadMore, loadMoreInc } = this.state;
    this.setState({ items: data });
    this.setState({
      pageNo: this.state.pageNo + 1,
      loadMore: loadMore + loadMoreInc,
      loadMoreInc: 10,
    });
    const defaultLang = await AsyncStorage.getItem("selectedLanguage");
    this.setState({ bookmarkedCoursesReqLoading: true });
    this.props.getAllBookmarkedCourses(defaultLang, this.state.pageNo);
    this.setState({ bookmarkedCoursesReqLoading: false });
  };

  loadMoreRender = (data) => {
    const {
      coursesSuccess,
      bookmarkedCoursesSuccess,
      timelineCoursesSuccess,
      sampleAllVideosSuccess,
    } = this.props;

    if (
      coursesSuccess.isNext &&
      (this.state.screen == "courses" || this.state.screen == "search")
    ) {
      return (
        <Block flex center style={styles.loadMore}>
          <TouchableOpacity onPress={() => this.loadMoreCourses(data)}>
            <Text style={styles.loadMoreText}>{i18n.t("common_loadMore")}</Text>
          </TouchableOpacity>
        </Block>
      );
    } else if (
      sampleAllVideosSuccess.isNext &&
      this.state.screen == "sampleVideos"
    ) {
      return (
        <Block flex center style={styles.loadMore}>
          <TouchableOpacity onPress={() => this.loadMoreSampleVideos(data)}>
            <Text style={styles.loadMoreText}>{i18n.t("common_loadMore")}</Text>
          </TouchableOpacity>
        </Block>
      );
      // console.warn('this is sampleVideos load more jsx');
    } else if (
      timelineCoursesSuccess.isNext &&
      this.state.screen == "myTimeline"
    ) {
      return (
        <Block flex center style={styles.loadMore}>
          <TouchableOpacity
            onPress={() => this.loadMoreMyTimelineCourses(data)}
          >
            <Text style={styles.loadMoreText}>{i18n.t("common_loadMore")}</Text>
          </TouchableOpacity>
        </Block>
      );
      // console.warn('this is myTimeline load more jsx');
    } else if (
      bookmarkedCoursesSuccess.isNext &&
      this.state.screen == "myBookmarked"
    ) {
      return (
        <Block flex center style={styles.loadMore}>
          <TouchableOpacity
            onPress={() => this.loadMoreMyBookmarkedCourses(data)}
          >
            <Text style={styles.loadMoreText}>{i18n.t("common_loadMore")}</Text>
          </TouchableOpacity>
        </Block>
      );
    }
  };

  renderItem = (item, index) => {
    const { token } = this.state;
    return (
      <CourseBlock
        index
        item={item}
        horizontal
        searchItem={this.state.screen == "search" ? true : false}
        ratings={this.state.screen == "sampleVideos" ? false : true}
        idStatus={this.state.screen == "sampleVideos" ? true : false}
        courseId={this.state.screen == "myBookmarked" ? true : false}
        sample={this.state.screen == "sampleVideos" ? true : false}
      />
    );
  };

  renderCards = () => {
    const scrollX = new Animated.Value(0);
    const cards = [articles[5], articles[6]];

    const {
      coursesSuccess,
      bookmarkedCoursesSuccess,
      timelineCoursesSuccess,
      sampleAllVideosSuccess,
    } = this.props;
    let data = this.state.items;
    if (
      coursesSuccess.data &&
      coursesSuccess.data.length != 0 &&
      (this.state.screen == "courses" || this.state.screen == "search")
    ) {
      data = [...data, ...coursesSuccess.data];
    } else if (
      sampleAllVideosSuccess.data &&
      sampleAllVideosSuccess.data.length != 0 &&
      this.state.screen == "sampleVideos"
    ) {
      data = [...data, ...sampleAllVideosSuccess.data];
    } else if (
      timelineCoursesSuccess.data &&
      timelineCoursesSuccess.data.length != 0 &&
      this.state.screen == "myTimeline"
    ) {
      data = [...data, ...timelineCoursesSuccess.data];
    } else if (
      bookmarkedCoursesSuccess.data &&
      bookmarkedCoursesSuccess.data.length != 0 &&
      this.state.screen == "myBookmarked"
    ) {
      data = [...data, ...bookmarkedCoursesSuccess.data];
    }

    return (
      <Block flex style={styles.cards}>
        <Loader
          show={
            this.state.timelineCoursesReqLoading ||
            this.state.bookmarkedCoursesReqLoading ||
            this.state.coursesReqLoading ||
            this.state.sampleAllVideosReqLoading
          }
        />
        {!this.state.loading ? (
          data.length > 0 ? (
            <FlatList
              data={data}
              ref={(ref) => {
                this.flatListRef = ref;
              }}
              keyExtractor={(item, index) => `${item.title}_${index}`}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={this.loadMoreRender(data)}
              onContentSizeChange={() =>
                this.flatListRef?.scrollToIndex({
                  index: this.state.loadMore,
                  animated: true,
                })
              }
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
      this.state.coursesReqLoading &&
      (this.state.screen == "courses" || this.state.screen == "search")
    ) {
      const checkLoading = () => {
        let { coursesReqLoading } = this.state;
        let {
          coursesLoading,
          coursesFailed,
          coursesSuccess,
          navigation,
          coursesError,
        } = this.props;

        if (!coursesLoading && coursesReqLoading) {
          if (!coursesFailed) {
            this.setState({ coursesReqLoading: false });
          } else {
            this.setState({ coursesReqLoading: false });
            Alert.alert("", coursesError, [{ text: "OK" }], {
              cancelable: false,
            });
          }
        }
      };
      checkLoading();
    } else if (
      this.state.sampleAllVideosReqLoading &&
      this.state.screen == "sampleVideos"
    ) {
      const checkLoading = () => {
        let { sampleAllVideosReqLoading } = this.state;
        let {
          sampleAllVideosLoading,
          sampleAllVideosFailed,
          sampleAllVideosSuccess,
          navigation,
          sampleAllVideosError,
        } = this.props;

        if (!sampleAllVideosLoading && sampleAllVideosReqLoading) {
          if (!sampleAllVideosFailed) {
            {
              sampleAllVideosSuccess &&
                this.setState({ sampleAllVideosReqLoading: false });
            }
          } else {
            this.setState({ sampleAllVideosReqLoading: false });
            Alert.alert("", sampleAllVideosError, [{ text: "OK" }], {
              cancelable: false,
            });
          }
        }
      };
      checkLoading();
    } else if (
      this.state.timelineCoursesReqLoading &&
      this.state.screen == "myTimeline"
    ) {
      const checkLoading = () => {
        let { timelineCoursesReqLoading } = this.state;
        let {
          timelineCoursesLoading,
          timelineCoursesFailed,
          timelineCoursesSuccess,
          navigation,
          timelineCoursesError,
        } = this.props;

        if (!timelineCoursesLoading && timelineCoursesReqLoading) {
          if (!timelineCoursesFailed) {
            this.setState({ timelineCoursesReqLoading: false });
          } else {
            this.setState({ timelineCoursesReqLoading: false });
            Alert.alert("", timelineCoursesError, [{ text: "OK" }], {
              cancelable: false,
            });
          }
        }
      };
      checkLoading();
    } else if (
      this.state.bookmarkedCoursesReqLoading &&
      this.state.screen == "myBookmarked"
    ) {
      const checkLoading = () => {
        let { bookmarkedCoursesReqLoading } = this.state;
        let {
          bookmarkedCoursesLoading,
          bookmarkedCoursesFailed,
          bookmarkedCoursesSuccess,
          navigation,
          bookmarkedCoursesError,
        } = this.props;

        if (!bookmarkedCoursesLoading && bookmarkedCoursesReqLoading) {
          if (!bookmarkedCoursesFailed) {
            this.setState({ bookmarkedCoursesReqLoading: false });
          } else {
            this.setState({ bookmarkedCoursesReqLoading: false });
            Alert.alert("", bookmarkedCoursesError, [{ text: "OK" }], {
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
    // marginHorizontal: Platform.OS === 'android' ? theme.SIZES.BASE : 0,
    // marginRight: Platform.OS === 'ios' ? 30 : null,
    marginLeft: Platform.OS === "ios" ? 10 : 20,
    // marginTop: -60,
    // zIndex:
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
  productTitle: {
    color: nowTheme.COLORS.PRIMARY,
    textAlign: "center",
    fontFamily: "montserrat-bold",
    fontSize: 18,
  },
  loadMore: {
    marginTop: 10,
  },
  loadMoreText: {
    fontFamily: "montserrat-bold",
    textAlign: "center",
  },
  cards: {
    paddingBottom: 30,
    width: Platform.OS === "android" ? width : width * 0.98,
  },
  emptyComponent: {
    marginVertical: "70%",
  },
  emptyComponentText: {
    fontFamily: "montserrat-bold",
  },
});

function mapStateToProps(state) {
  return {
    coursesLoading: state.courses.courses.loading,
    coursesSuccess: state.courses.courses.success,
    coursesFailed: state.courses.courses.failed,
    coursesError: state.courses.courses.error,

    bookmarkedCoursesLoading: state.courses.bookmarkedCourses.loading,
    bookmarkedCoursesSuccess: state.courses.bookmarkedCourses.success,
    bookmarkedCoursesFailed: state.courses.bookmarkedCourses.failed,
    bookmarkedCoursesError: state.courses.bookmarkedCourses.error,

    timelineCoursesLoading: state.courses.timelineCourses.loading,
    timelineCoursesSuccess: state.courses.timelineCourses.success,
    timelineCoursesFailed: state.courses.timelineCourses.failed,
    timelineCoursesError: state.courses.timelineCourses.error,

    sampleAllVideosLoading: state.courses.sampleVideosAll.loading,
    sampleAllVideosSuccess: state.courses.sampleVideosAll.success,
    sampleAllVideosFailed: state.courses.sampleVideosAll.failed,
    sampleAllVideosError: state.courses.sampleVideosAll.error,

    tokenStatus: state.auth.tokenStatus,
    language: state.language.languageSet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllCourses,
      getAllBookmarkedCourses,
      getAllTimelineCourses,
      getAllSampleVideos,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);
