import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text } from 'react-native';
import Modal from 'react-native-modal';
import {Video} from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';

import nowUITheme from "../constants/Theme";

export default class SampleVideoPlayerModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
      loading: false,
      isPotraitLocked:false,
      isOrientationLandscape: true,
  }

  activityIndicatorOpenHandle = () => {
    this.setState({loading: true})
  }

  activityIndicatorCloseHandle = () => {
    this.setState({loading: false})
  }
  onFullscreenUpdate = async ({fullscreenUpdate}) => {
    if(Platform.OS === 'android') {
      
      if(this.state.isOrientationLandscape && fullscreenUpdate == 0) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        this.setState({isOrientationLandscape: !this.state.isOrientationLandscape})
      } else if(!this.state.isOrientationLandscape && fullscreenUpdate == 3){
        this.setState({isPotraitLocked: true})
        // await ScreenOrientation.unlockAsync()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) 
        this.setState({isOrientationLandscape: !this.state.isOrientationLandscape})
        
      } 
    }
}

  render() {
    const { show, videoUrl, brackDropPressHandler } = this.props;
    return (
      <Modal
        isVisible={show}
        style={{ justifyContent: 'center', alignItems: 'center', }}
        backdropColor='black'
        backdropOpacity={0.7}
        animationIn={'fadeIn'}
        onBackdropPress={brackDropPressHandler}
      >
         {this.state.loading && <ActivityIndicator size="large" color={nowUITheme.COLORS.DRAWER_HEADER_BACKGROUND}/>}
        <Video
        // ref={video}
        shouldPlay={true}
        style={{width: '100%', height: 200}}
        source={{
          uri: videoUrl,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onLoadStart={() => this.activityIndicatorOpenHandle()}
        onLoad={() => this.activityIndicatorCloseHandle()}
        onFullscreenUpdate={(e) => this.onFullscreenUpdate(e)}
        // onPlaybackStatusUpdate={status => setStatus(() => status)}
      />

      </Modal>
    );
  }
}
const styles = StyleSheet.create({});