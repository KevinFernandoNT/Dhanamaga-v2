import React from "react";
import "react-native-gesture-handler";
import { Image, SafeAreaView, StatusBar, Platform, LogBox } from "react-native";
import { showMessage } from "react-native-flash-message";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screens from "./navigation/Screens";
import { Images, articles, nowTheme } from "./constants";
import NetInfo from "@react-native-community/netinfo";
import i18n from "i18n-js";

import { Provider, connect } from "react-redux";
import configureStore from "./store";
import FlashMessage from "react-native-flash-message";
import { currentRoute } from "./store/modules/home/home";

import * as Notifications from "expo-notifications";
// import { registerForPushNotificationsAsync } from './constants'

const store = configureStore();
// cache app images
const assetImages = [Images.ProfilePicture, Images.ProfileBackground];

// cache product images
articles.map((article) => assetImages.push(article.image));

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
  }

  state = {
    isLoadingComplete: false,
    fontLoaded: false,
    setConnectivity: false,
  };

  checkConnection = async () => {
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        showMessage({
          message: i18n.t("network_state"),
          type: "danger",
        });
      }
    });
  };

  componentDidMount() {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    this.checkConnection();
    this.connectionListener = NetInfo.addEventListener(this.checkConnection);
    // registerForPushNotificationsAsync().then(token => console.warn('ddddd=>>>', token));
    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    this.responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});
  }

  componentWillUnmount() {
    Notifications.removeNotificationSubscription(
      this.notificationListener.current
    );
    Notifications.removeNotificationSubscription(this.responseListener.current);
    this.connectionListener();
  }

  // componentDidMount() {
  //     this.languageSetterWhenAppStarts()
  // }
  // async componentDidMount() {
  //   Font.loadAsync({
  //     'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
  //     'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf')
  //   });

  //   this.setState({ fontLoaded: true });
  // }

  render() {
    const navigationRef = React.createRef();
    let currentRouteName =
      navigationRef.current != null
        ? navigationRef.current.getCurrentRoute().name
        : null;
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={() => {
              currentRouteName =
                navigationRef.current != null
                  ? navigationRef.current.getCurrentRoute().name
                  : null;
              store.dispatch(currentRoute(currentRouteName));
            }}
          >
            <GalioProvider theme={nowTheme}>
              <StatusBar
                barStyle={Platform.OS === "ios" ? "light-content" : "default"}
              />
              <Block flex>
                <Screens />
              </Block>
              <FlashMessage position="top" />
            </GalioProvider>
          </NavigationContainer>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    await Font.loadAsync({
      "montserrat-regular": require("./assets/font/Montserrat-Regular.ttf"),
      "montserrat-bold": require("./assets/font/Montserrat-Bold.ttf"),
    });

    await this._languageSetterWhenAppStarts();

    this.setState({ fontLoaded: true });
    return Promise.all([...cacheImages(assetImages)]);
  };

  _languageSetterWhenAppStarts = async () => {
    const language = await AsyncStorage.getItem("selectedLanguage");
    if (!language) {
      await AsyncStorage.setItem("selectedLanguage", "en");
    }
  };

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    if (this.state.fontLoaded) {
      this.setState({ isLoadingComplete: true });
    }
  };
}
