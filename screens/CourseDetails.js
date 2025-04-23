import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
  BackHandler,
} from "react-native";
//galio
import { Block, Text, theme, Input, Button } from "galio-framework";
import { Video, AVPlaybackStatus } from "expo-av";
import { Rating, AirbnbRating } from "react-native-ratings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { articles, nowTheme, tabs } from "../constants/";
import { Card, Icon, Loader } from "../components/";
import Tabs from "../components/Tabs";
import { en } from "../constants/languages/english.json";
import { si } from "../constants/languages/sinhala.json";
import { ta } from "../constants/languages/tamil.json";

import { showMessage } from "react-native-flash-message";

import * as lessonsActions from "../store/actions";
import * as coursesActions from "../store/actions";
import * as questionActions from "../store/actions";
import { connect } from "react-redux";

const { width } = Dimensions.get("screen");

i18n.translations = {
  en,
  si,
  ta,
};
class CourseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.video = React.createRef(null);
    this.state = this.initialState();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  initialState() {
    return (this.state = {
      title: this.props.route.params.title ? this.props.route.params.title : "",
      selectedTab: "lessons",
      courseId: this.props.route.params._id ? this.props.route.params._id : "",
      getLessonsByCourseWaiting: false,
      getCourseWaiting: false,
      lessonVideos: this.props.lessons ? this.props.lessons : [],
      question: "",
      rating: this.props.course ? this.props.course.rating : 0,
      likeCount: this.props.course ? this.props.course.likeCount : 0,
      isLiked: this.props.course ? this.props.course.isLiked : false,
      selectedVideo: this.props.lessons ? this.props.lessons[0] : [],
      autoPlay: false,
      loading: true,
      paused: false,
      index: 0,
      sendQuestionWaiting: false,
    });
  }

  shouldComponentUpdate() {
    return this.props.lessonsSuccess;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.questionLoading !== this.props.questionLoading) {
      if (this.props.questionSuccess) {
        showMessage({
          message: this.props.question.message,
          type: "success",
          position: "bottom",
        });

        this.setState({ sendQuestionWaiting: false });
      }
    }
    if (prevProps.lessonVideos !== this.props.lessonVideos) {
      this.setState(
        {
          lessonVideos: this.props.lessonVideos,
          getLessonsByCourseWaiting: flase,
        },
        () => {
          this.forceUpdate();
        }
      );
    }
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", async () => {
      this.setState(this.initialState);
      this.getData();
    });
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.forceUpdate();
  }

  getData = async () => {
    try {
      let defaultLang = await AsyncStorage.getItem("selectedLanguage");
      let userData;
      if (this.props.user == null) {
        userData = {
          courseId: this.state.courseId,
          language: defaultLang,
        };
      } else {
        userData = {
          userId: this.props.user._id,
          courseId: this.state.courseId,
          language: defaultLang,
        };
      }

      this.props.lessond_by_course(userData);
      this.props.getCourseDetails(userData);

      this.setState({
        getLessonsByCourseWaiting: true,
        getCourseWaiting: true,
        defaultLang: defaultLang,
      });
    } catch (e) {}
  };
  componentWillUnmount() {
    this.video.pauseAsync();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  finishedVideo(index) {
    let lessons = this.state.lessonVideos.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          watchStatus: "done",
        };
      } else {
        return item;
      }
    });
    this.setState({ lessonVideos: lessons });
  }
  isAuthorizedToPlay(item) {
    if (!item.isFree && this.props.user == null) {
      showMessage({
        message: "This Lesson is not authorized to play, Please login",
        type: "warn",
        position: "bottom",
      });
      return false;
    } else {
      this.setState({ selectedVideo: item });
      return true;
    }
  }

  changeStatus(item, index) {
    this.setState({ selectedVideo: item, index: index });
    if (this.isAuthorizedToPlay(item)) {
      this.setState({ autoPlay: true });
      let lessons = this.state.lessonVideos.map((item, i) => {
        if (i == index) {
          if (this.state.user !== null && item.watchStatus !== "done") {
            let data = {
              userId: this.props?.user?._id,
              courseId: this.state?.courseId,
              lessonId: item?._id,
              watchStatus: "watching",
            };
            this.props.updateWatchStatus(data);
          }

          return {
            ...item,
            watchStatus: "watchingNow",
          };
        } else if (item.watchStatus === "watchingNow") {
          return {
            ...item,
            watchStatus: "watching",
          };
        } else if (index === this.state.finishedIndex) {
          return {
            ...item,
            watchStatus: "done",
          };
        } else {
          return item;
        }
      });

      this.setState({ lessonVideos: lessons, autoPlay: true });
    }
  }
  renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.changeStatus(item, index);
        }}
      >
        <Block
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderColor: nowTheme.COLORS.BORDER_COLOR,
          }}
        >
          <Block flex row style={{ marginBottom: 5 }}>
            <Text
              style={{ width: "90%" }}
              size={nowTheme.SIZES.FONT}
              color={
                item.watchStatus == "watchingNow"
                  ? nowTheme.COLORS.INPROGRESS
                  : item.watchStatus == "watching"
                  ? nowTheme.COLORS.HEADER_BACKGROUND
                  : "black"
              }
            >
              {index + 1}. {item.title}
            </Text>
            {item.watchStatus == "done" && (
              <Icon
                style={{ marginLeft: "auto" }}
                name="checkcircleo"
                family="AntDesign"
                size={nowTheme.SIZES.FONT}
                color={nowTheme.COLORS.SUCCESS}
              />
            )}
            {item.watchStatus == "watchingNow" && (
              <Icon
                style={{ marginLeft: "auto" }}
                name="eye"
                family="AntDesign"
                size={nowTheme.SIZES.FONT}
                color={nowTheme.COLORS.INPROGRESS}
              />
            )}
            {item.watchStatus == "watching" && (
              <Icon
                style={{ marginLeft: "auto" }}
                name="eye"
                family="AntDesign"
                size={nowTheme.SIZES.FONT}
                color={nowTheme.COLORS.HEADER_BACKGROUND}
              />
            )}
          </Block>
          <Text
            size={nowTheme.SIZES.SECONDARY_FONT}
            color={nowTheme.COLORS.SECONDARY_TEXT}
          >
            {item.duration}
          </Text>
        </Block>
      </TouchableOpacity>
    );
  };

  //handle rating value
  ratingCompleted = (ratingValue) => {
    this.setState({ rating: ratingValue });
    if (this.props.tokenStatus) {
      const ratingUpdate = {
        course: this.state.courseId,
        user: this.props.user._id,
        review: ratingValue,
      };
      this.props.updateRating(ratingUpdate);
    } else {
      this.video.pauseAsync();
      this.props.navigation.navigate("Login");
    }
  };

  handleBackButtonClick() {
    this.video.pauseAsync();
    this.props.navigation.goBack(null);
    return true;
  }

  tabHandler = (tab) => {
    console.log();
    if (this.props.user == null && tab !== "lessons") {
      showMessage({
        message:
          tab == "more"
            ? "Please login to Add Bookmark"
            : "Please Login to Add Questions",
        type: "warn",
        position: "bottom",
      });
    } else {
      this.setState({ selectedTab: tab });
    }
  };

  addToBookMark = () => {
    const bookMarkDetails = {
      user: this.props.user._id,
      course: this.state.courseId,
      bookmarked: true,
    };
    this.props.addBookMark(bookMarkDetails);
  };
  sendMessage = () => {
    let data = {
      user: this.props.user._id,
      course: this.state.courseId,
      language: this.state.defaultLang,
      question: this.state.question,
    };
    if (this.state.question !== "") {
      this.props.sendQuestion(data);
      this.setState({ sendQuestionWaiting: true, question: "" });
    }
  };
  renderTabBlocks = () => {
    if (this.state.selectedTab == "lessons") {
      return (
        <Block flex>
          {this.state.lessonVideos && this.state.lessonVideos.length !== 0 ? (
            <FlatList
              data={this.state.lessonVideos}
              keyExtractor={(item) => item.title}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>Lessons not available for this course </Text>
          )}
        </Block>
      );
    } else if (this.state.selectedTab == "questions") {
      return (
        <Block flex style={{ marginTop: 20 }}>
          <Block style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              underlineColorAndroid="transparent"
              placeholder={i18n.t("corseDetails_screen_textAreaPlaceholder")}
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              value={this.state.question}
              onChangeText={(text) => this.setState({ question: text })}
            />
          </Block>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.sendMessage();
            }}
            color="blue"
          >
            <Text style={styles.buttonText}>
              {i18n.t("corseDetails_screen_send")}
            </Text>
          </TouchableOpacity>
        </Block>
      );
    } else if (this.state.selectedTab == "more") {
      return (
        <Block flex style={{ marginTop: 30 }}>
          <TouchableOpacity onPress={() => this.addToBookMark()}>
            <Block flex row left style={{ alignItems: "center" }}>
              <MaterialCommunityIcons
                name="bookmark-plus"
                size={35}
                color="red"
              />
              <Text size={20} color="red" style={{ marginLeft: 10 }}>
                {i18n.t("corseDetails_screen_addToBookmark")}
              </Text>
            </Block>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ marginTop: 20 }}>
            <Block flex row left style={{ alignItems: 'center' }}>
              <Icon name="star" family="Entypo" size={35} color="red" />
              <Text size={20} color="red" style={{ marginLeft: 10 }}>
                {i18n.t('corseDetails_screen_reviewThisCourse')}
              </Text>
            </Block>
          </TouchableOpacity> */}
        </Block>
      );
    }
  };

  likeHandler = () => {
    console.log(this.props.user);
    if (!this.props.user) {
      this.props.navigation.navigate("Login");
    } else {
      if (this.state.isLiked && this.state.courseId && this.props.user) {
        try {
          const courseData = {
            course: this.state.courseId,
            user: this.props.user._id,
            liked: false,
          };

          this.props.likeCourse(courseData);

          this.setState({ likeCount: this.state.likeCount - 1 });
          this.setState({ isLiked: !this.state.isLiked });
        } catch (e) {}
      } else if (
        !this.state.isLiked &&
        this.state.courseId &&
        this.props.user
      ) {
        try {
          const courseData = {
            course: this.state.courseId,
            user: this.props.user._id,
            liked: true,
          };

          this.props.likeCourse(courseData);
          this.setState({ likeCount: this.state.likeCount + 1 });
          this.setState({ isLiked: !this.state.isLiked });
        } catch (e) {}
      }
    }
  };

  progress = () => {};

  onPlaybackStatusUpdate = (playbackStatus) => {
    let { lessonVideos, index } = this.state;
    if (playbackStatus.didJustFinish) {
      this.setState({ paused: true, autoPlay: false, finishedIndex: index });
      if (this.state.user !== null) {
        let data = {
          userId: this.props.user._id,
          courseId: this.state.courseId,
          lessonId: this.state.selectedVideo._id,
          watchStatus: "done",
        };
        this.props.updateWatchStatus(data);
      }
      this.finishedVideo(index);
      // if (index + 1 < this.state.lessonVideos.length) {
      //   this.changeStatus(lessonVideos[index + 1], index + 1);
      //   this.setState({
      //     selectedVideo: lessonVideos[index],
      //     index: index + 1,
      //     autoPlay: true,
      //   });
      // } else {
      //   this.setState({ selectedVideo: [] });
      // }
    }
  };
  // endLesson() {
  // }
  renderCards = () => {
    return (
      <Block>
        <Video
          ref={(video) => (this.video = video)}
          style={{
            height:
              Platform.OS === "android"
                ? (Dimensions.get("screen").height / 10) * 2.9
                : (Dimensions.get("screen").height / 10) * 3.2,
          }}
          source={{
            uri: this.state.selectedVideo
              ? this.state.selectedVideo.videoUrl
              : null,
          }}
          orientation="portrait"
          paused={this.state.paused}
          shouldPlay={this.selectedVideo !== [] && this.state.autoPlay}
          useNativeControls
          resizeMode="contain"
          // isLooping
          // onEnd={this.endLesson()}
          posterSource={
            this.state.selectedVideo
              ? this.state.selectedVideo.thumbnailUrl
              : null
          }
          onPlaybackStatusUpdate={(playbackStatus) =>
            this.onPlaybackStatusUpdate(playbackStatus)
          }
        />
        <Block style={[styles.container, styles.titleContainer]}>
          <Text size={nowTheme.SIZES.FONT} style={styles.title}>
            {this.state.title}
          </Text>
          <Block flex row style={{ marginBottom: nowTheme.SIZES.BASE }}>
            <TouchableOpacity
              onPress={this.likeHandler}
              style={{ flexDirection: "row" }}
            >
              <Text
                size={nowTheme.SIZES.SECONDARY_FONT}
                color={nowTheme.COLORS.SECONDARY_TEXT}
              >
                {this.state.likeCount}
              </Text>
              {
                !this.state.isLiked ? (
                  <Icon
                    name="like2"
                    family="AntDesign"
                    size={nowTheme.SIZES.SECONDARY_FONT}
                    style={{
                      marginHorizontal: 5,
                      color: nowTheme.COLORS.SECONDARY_TEXT,
                    }}
                  />
                ) : (
                  <Icon
                    name="like2"
                    family="AntDesign"
                    size={nowTheme.SIZES.SECONDARY_FONT}
                    style={{
                      marginHorizontal: 5,
                      color: nowTheme.COLORS.HEADER_BACKGROUND,
                    }}
                  />
                )
                // <Icon name='like1' family='AntDesign' size={nowTheme.SIZES.SECONDARY_FONT} style={{ marginHorizontal: 5 }} />
              }
            </TouchableOpacity>
            <Rating
              ratingCount={5}
              startingValue={this.state.rating}
              onFinishRating={(value) => this.ratingCompleted(value)}
              style={{ marginLeft: 20, marginRight: 10 }}
              imageSize={nowTheme.SIZES.SECONDARY_FONT}
              jumpValue={1}
            />
            <Text
              size={nowTheme.SIZES.SECONDARY_FONT}
              color={nowTheme.COLORS.SECONDARY_TEXT}
            >
              {this.state.rating}
            </Text>
          </Block>
        </Block>
        <Block style={{ marginBottom: nowTheme.SIZES.BASE }}>
          <Tabs
            data={tabs.details || []}
            initialIndex={this.state.selectedTab}
            onChange={(id) => this.tabHandler(id)}
          />
        </Block>
        <Block style={[styles.container]}>
          <Block style={[styles.tabsContainer]}>{this.renderTabBlocks()}</Block>
        </Block>
      </Block>
    );
  };

  checkLessons() {
    let { getLessonsByCourseWaiting } = this.state;
    let {
      lessonsLoading,
      lessonsFailed,
      lessonsSuccess,
      navigation,
      lessonsgError,
      lessons,
    } = this.props;

    if (getLessonsByCourseWaiting && !lessonsLoading) {
      if (lessonsSuccess) {
        this.setState(
          {
            lessonVideos: lessons,
          },
          () => {
            this.forceUpdate();
          }
        );
        // this.props.navigation.reset({
        //   routes: [{ name: "CourseDetails", params:{_id: this.state.courseId} }]
        // });
      }
    }
    this.setState({ getLessonsByCourseWaiting: false });
  }

  checkQuestion() {
    let { sendQuestionWaiting } = this.state;
    let { questionLoading, questionSuccess, question } = this.props;

    console.log(questionLoading, questionSuccess, question);
    if (sendQuestionWaiting && questionLoading) {
      if (questionSuccess) {
        showMessage({
          message: question.payload.message,
          type: "success",
          position: "bottom",
        });
      }
    }
  }
  render() {
    let { getLessonsByCourseWaiting, getCourseWaiting, sendQuestionWaiting } =
      this.state;
    {
      getLessonsByCourseWaiting && this.checkLessons();
    }
    //  { sendQuestionWaiting && this.checkQuestion() }
    return (
      <Block flex>
        {/* <Loader show={getLessonsByCourseWaiting} /> */}
        <Loader show={sendQuestionWaiting} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ width }}
        >
          {this.renderCards()}
        </ScrollView>
      </Block>
    );
  }
  componentWillUnmount() {
    this.video.stopAsync();
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
  },
  titleContainer: {
    backgroundColor: nowTheme.COLORS.WHITE,
  },
  tabsContainer: {
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: nowTheme.COLORS.WHITE,
  },
  title: {
    fontFamily: "montserrat-bold",
    paddingBottom: theme.SIZES.BASE,
    marginTop: 0,
    color: nowTheme.COLORS.HEADER,
  },
  textAreaContainer: {
    borderColor: "#bdc2d0",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 8,
    padding: 5,
  },
  textArea: {
    marginTop: Platform.OS === "android" ? -60 : 0,
    height: Platform.OS === "android" ? 150 : 90,
    justifyContent: "flex-start",
  },
  button: {
    width: 100,
    backgroundColor: nowTheme.COLORS.ACTIVE,
    padding: nowTheme.SIZES.BASE / 2,
    margin: nowTheme.SIZES.BASE / 2,
    borderRadius: nowTheme.SIZES.BASE,
  },
  buttonText: {
    color: nowTheme.COLORS.WHITE,
    padding: 4,
    fontSize: nowTheme.SIZES.BASE * 1,
    textAlign: "center",
  },
});

function mapStateToProps(state) {
  return {
    user: state.auth.user,

    question: state.question.question.payload,
    questionLoading: state.question.question.loading,
    questionSuccess: state.question.question.success,
    questionError: state.question.question.error,

    lessonsLoading: state.lessons.lessons_by_course.loading,
    lessonsSuccess: state.lessons.lessons_by_course.success,
    lessonsFailed: state.lessons.lessons_by_course.failed,
    lessonsgError: state.lessons.lessons_by_course.error,
    lessons: state.lessons.lessons_by_course.lessons,

    courseLoading: state.courses.course.loading,
    courseSuccess: state.courses.course.success,
    courseFailed: state.courses.course.failed,
    coursegError: state.courses.course.error,
    course: state.courses.course.course,

    tokenStatus: state.auth.tokenStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    lessond_by_course: (data) => {
      dispatch(lessonsActions.getLessonsByCourse(data));
    },
    updateWatchStatus: (data) => {
      dispatch(lessonsActions.updateWatchStatus(data));
    },
    getCourseDetails: (data) => {
      dispatch(coursesActions.getCourse(data));
    },
    addBookMark: (data) => {
      dispatch(lessonsActions.addBookMark(data));
    },
    updateRating: (data) => {
      dispatch(lessonsActions.updateRating(data));
    },
    likeCourse: (data) => {
      dispatch(lessonsActions.likeCourse(data));
    },
    sendQuestion: (data) => {
      dispatch(questionActions.addQuestion(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetails);
