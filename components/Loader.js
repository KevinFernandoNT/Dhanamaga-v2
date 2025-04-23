import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import nowUITheme from "../constants/Theme";
export default class Loader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { show } = this.props;
    return (
      <Modal
        isVisible={show}
        style={styles.loader}
        backdropColor='white'
        backdropOpacity={0.40}
        animationIn={'fadeIn'}
      >
        <ActivityIndicator size="large" color={nowUITheme.COLORS.DRAWER_HEADER_BACKGROUND} />
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});