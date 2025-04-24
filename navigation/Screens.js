import React, { useEffect } from 'react';
import { Block } from "galio-framework";
import { Easing, Animated, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// screens
import Home from '../screens/Home';
import Pro from '../screens/Pro';
import Profile from '../screens/Profile';
import Register from '../screens/Register';
import Login from '../screens/Login';
import ResetPassword from '../screens/ResetPassword';
import Components from '../screens/Components';
import Articles from '../screens/Articles';
import CourseDetails from '../screens/CourseDetails';
import ListContainer from '../screens/ListContainer';
import LanguageSelect from '../screens/LangugeSelect';
import WatchedLessons from '../screens/WatchedLessons';
import Onboarding from '../screens/Onboarding';
import AppUpdate from '../screens/AppUpdate';

import SettingsScreen from '../screens/Settings';
import Disclaimer from '../screens/Disclaimer';
import TermsOfUse from '../screens/TermsOfUse';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import ChangePassword from '../screens/ChangePassword';

// drawer
import CustomDrawerContent from "./Menu";
// header for screens
import { Header, Icon } from '../components';
import { nowTheme, tabs } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ComponentsStack(props) {
  return (
    <Stack.Navigator initialRouteName="Components" mode="card" headerMode="screen">
      <Stack.Screen name="Components" component={Components} options={{
        header: ({ navigation, scene }) => (<Header title="Components" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function SampleVideosStack(props) {
  return (
    <Stack.Navigator initialRouteName="SampleVideos" mode="card" headerMode="screen">
      <Stack.Screen name="Components" component={ListContainer} initialParams={{ screen: props.route.params.screen }} options={{
        header: ({ navigation, scene }) => (<Header title="Sample Videos" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function TimelineStack(props) {
  return (
    <Stack.Navigator initialRouteName="TimeLine" mode="card" headerMode="screen">
      <Stack.Screen name="Components" component={ListContainer} initialParams={{ screen: props.route.params.screen }} options={{
        header: ({ navigation, scene }) => (<Header title="My Timeline" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: "#E9A2AD"
      }} />
    </Stack.Navigator>
    // this.props.route.params.screen
  );
}
function BookmarkedStack(props) {
  return (
    <Stack.Navigator initialRouteName="Bookmarked" mode="card" headerMode="screen">
      <Stack.Screen name="Components" component={ListContainer} initialParams={{ screen: props.route.params.screen }} options={{
        header: ({ navigation, scene }) => (<Header title="My Bookmarked" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function CoursesStack(props) {
  return (
    <Stack.Navigator initialRouteName="Courses" mode="card" headerMode="screen">
      <Stack.Screen name="Components" component={ListContainer} initialParams={{ screen: props.route.params.screen }} options={{
        header: ({ navigation, scene }) => (<Header title="Courses" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function SearchResultsStack(props) {
  return (
    <Stack.Navigator initialRouteName="Courses" mode="card" headerMode="screen">
      <Stack.Screen name={`${props.route.params.search}`} component={ListContainer} initialParams={{ screen: props.route.params.screen }} options={{
        header: ({ navigation, scene }) => (<Header title={'Search Results of : ' + props.route.params.search} back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}

function CourseDetailsStack(props) {
  return (
    <Stack.Navigator initialRouteName="CourseDetails" mode="card" headerMode="screen">
      <Stack.Screen name="CourseDetails" component={CourseDetails} initialParams={props.route.params} options={{
        header: ({ navigation, scene }) => (<Header title="Course Details" back={true} contentOverlaps={false} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function TrendingLessonsStack(props) {
  return (
    <Stack.Navigator initialRouteName="TrendingVedios" mode="card" headerMode="screen">
      <Stack.Screen name="TrendingVedios" component={WatchedLessons} initialParams={props.route.params} options={{
        header: ({ navigation, scene }) => (<Header title="Trending Videos" back={true} contentOverlaps={false} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function MostWatchedLessonsStack(props) {
  return (
    <Stack.Navigator initialRouteName="MostWatchedLessonsStack" mode="card" headerMode="screen">
      <Stack.Screen name="MostWatchedLessonsStack" component={WatchedLessons} initialParams={props.route.params} options={{
        header: ({ navigation, scene }) => (<Header title="Most Watched Videos" back={true} contentOverlaps={false} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}
function PrivacyPolicyStack(props) {
  return (
    <Stack.Navigator initialRouteName="PrivacyPolicy" mode="card" headerMode="screen">
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
        header: ({ navigation, scene }) => (<Header title="Privacy Policy" back={true} contentOverlaps={false} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}


function ArticlesStack(props) {
  return (
    <Stack.Navigator initialRouteName="Articles" mode="card" headerMode="screen">
      <Stack.Screen name="Articles" component={Articles} options={{
        header: ({ navigation, scene }) => (<Header title="Articles" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}

function DisclaimerStack(props) {
  return (
    <Stack.Navigator initialRouteName="Disclaimer" mode="card" headerMode="screen">
      <Stack.Screen name="Disclaimer" component={Disclaimer} options={{
        header: ({ navigation, scene }) => (<Header title='Disclaimer' back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}

function TermsOfUseStack(props) {
  return (
    <Stack.Navigator initialRouteName="TermsOfUse" mode="card" headerMode="screen">
      <Stack.Screen name="TermsOfUse" component={TermsOfUse} options={{
        header: ({ navigation, scene }) => (<Header title="Terms Of Use" back={true} contentOverlaps={true} navigation={navigation} scene={scene} />),
        backgroundColor: nowTheme.COLORS.WHITE
      }} />
    </Stack.Navigator>
  );
}



function RegisterStack(props) {
  return (
    <Stack.Navigator initialRouteName="Register" mode="card" headerMode="screen">
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title="Create Account"
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function LoginStack(props) {
  return (
    <Stack.Navigator initialRouteName="Login" mode="card" headerMode="screen">
      <Stack.Screen
        name="components"
        component={Login}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title="Login"
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Reset Password"
        component={ResetPassword}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title="Reset Your Password"
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          cardStyle: { backgroundColor: nowTheme.COLORS.WHITE },
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        contentOverlaps={false}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Change Password"
              back
              white
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: nowTheme.COLORS.WHITE }
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />

    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        contentOverlaps={false}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              // search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: nowTheme.COLORS.WHITE }
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Language Select"
        component={LanguageSelect}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title=""
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title="Create Account"
              navigation={navigation}
              scene={scene}
              back={true}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: nowTheme.COLORS.PRIMARY,
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintcolor: nowTheme.COLORS.WHITE,
        inactiveTintColor: nowTheme.COLORS.WHITE,
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="My Timeline" component={TimelineStack} />
      <Drawer.Screen name="My Bookmarked" component={BookmarkedStack} />
      <Drawer.Screen name="Courses" component={CoursesStack} />
      <Drawer.Screen name="Sample Videos" component={SampleVideosStack} />
      <Drawer.Screen name="Search Results" component={SearchResultsStack} />
      <Drawer.Screen name="Components" component={ComponentsStack} />
      <Drawer.Screen name="Articles" component={ArticlesStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="Register" component={RegisterStack} />
      <Drawer.Screen name="Login" component={LoginStack} /> 
      <Drawer.Screen name="Trending Videos" component={TrendingLessonsStack} />
      <Drawer.Screen name="Most Watched Videos" component={MostWatchedLessonsStack} />
      <Drawer.Screen options={{
        swipeEnabled: false,
      }} name="Course Details" component={CourseDetailsStack} />
      <Drawer.Screen name="Disclaimer" component={DisclaimerStack} />
      <Drawer.Screen name="Terms of use" component={TermsOfUseStack} />
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicyStack} />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="AppUpdate"
        component={AppUpdate}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeStack}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

