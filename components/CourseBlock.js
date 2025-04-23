import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback, Platform } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import * as Progress from 'react-native-progress';
import { Rating, AirbnbRating } from 'react-native-ratings';

import SampleVideoPlayerModal from './VideoPlayerModal'
import { nowTheme, Images } from '../constants';
import { connect } from 'react-redux'
import { Dimensions } from 'react-native';
class CourseBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    modalOpen: false
  }

  brackDropPressHandler = () => {
    this.setState({ modalOpen: !this.state.modalOpen })
  }

  sampleHandler = (item) => {
    this.setState({ modalOpen: true })
  }


  render() {


    const {
      navigation,
      item,
      horizontal,
      full,
      style,
      ctaColor,
      imageStyle,
      ctaRight,
      titleStyle,
      sample,
      progress,
      idStatus,
      courseId,
      ratings,
      watchedVideo,
      searchItem
    } = this.props;

    const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const titleStyles = [styles.cardTitle, titleStyle];
    const cardContainer = [styles.card, style, { paddingVertical: 20, paddingLeft: 20, backgroundColor: 'none' }];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      Platform.OS === 'ios' ? { zIndex: 10 } : null
    ];
    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <SampleVideoPlayerModal show={this.state.modalOpen} videoUrl={item.videoUrl} brackDropPressHandler={this.brackDropPressHandler} />
        <TouchableWithoutFeedback onPress={sample ? () => this.sampleHandler(item) :  watchedVideo? () => navigation.navigate('Login'): () => navigation.navigate('Course Details', { _id: idStatus ? item.course : courseId ? item.courseId : searchItem ? item.course : item._id, title: item.title,searchItem:searchItem ? item._id : null })}>
          <Block flex style={imgContainer}>
            <Image resizeMode='stretch' source={item.thumbnailUrl && item.thumbnailUrl != null ? { uri: item.thumbnailUrl } : Images.NoImagePlaceholder} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={sample ? () => this.sampleHandler(item) : watchedVideo? () => navigation.navigate('Login'): () => navigation.navigate('Course Details', { _id: idStatus ? item.course : courseId ? item.courseId : searchItem ? item.course : item._id, title: item.title,searchItem:searchItem ? item._id : null })}>
          <Block flex  style={[styles.cardDescription, styles.shadow]}>
            <Block  style={styles.subCardDescription}>
              <Text
                // style={{ fontFamily: 'montserrat-regular' }}
                size={this.props.currentLanguage == 'en' ? nowTheme.SIZES.PRIMARY_FONT : nowTheme.SIZES.SUB_PRIMARY_FONT}
                style={titleStyles}
                color={nowTheme.COLORS.SECONDARY}>
                {item.title}
              </Text>
              <Block style={styles.textType}>
                {item.type ?
                 <Text size={nowTheme.SIZES.SECONDARY_FONT}
                 color={nowTheme.COLORS.SECONDARY_TEXT}  style={styles.itemType}>{item.type}
                 </Text>
              :null}
              </Block>
              {ratings && 
              <Block row style={styles.alignRating}>
                <Rating
                  ratingCount={5}
                  startingValue={item.rating ? item.rating : 0}
                  style={styles.rating}
                  imageSize={nowTheme.SIZES.SECONDARY_FONT}
                  jumpValue={1}
                  readonly
                />
                <Text
                  size={nowTheme.SIZES.SECONDARY_FONT}
                  color={nowTheme.COLORS.SECONDARY_TEXT}
                >
                  {item.rating ? item.rating : 0}
                </Text>
              </Block>
              }
              {item.watchProgress ? (<Progress.Bar
                style={styles.watchProgress}
                height={10}
                borderWidth={1}
                color={nowTheme.COLORS.DRAWER_ACTIVE_TEXT}
                progress={item.watchProgress} />) : (<Block />)}

            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

CourseBlock.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
  ctaRight: PropTypes.bool,
  titleStyle: PropTypes.any,
  textBodyStyle: PropTypes.any
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: Dimensions.get('window').width/100*25,
    marginBottom: 4,
    marginRight:Platform.OS === 'ios' ? 10 : 20,
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 5
  },
  cardDescription: {
    padding: theme.SIZES.BASE,
    marginVertical: -20,
    backgroundColor: nowTheme.COLORS.WHITE,
    marginLeft: -160,
    paddingLeft: 170,
    paddingRight: 25,
    borderRadius: 5
  },
  subCardDescription: {
    marginBottom: Platform.OS === 'android' ? 0 : 15
  },
  itemType:{
    paddingHorizontal: 9
  },
  rating: {
    marginLeft: 8, 
    marginRight: 5, 
    textAlign: 'left', 
    marginBottom: 0,
    
  },
  textType:{
    marginBottom:5
  },
  watchProgress: {
    marginLeft: 10, 
    marginTop: 5
  },
  alignRating:{
    alignItems:'center'
  },
  imageContainer: {
    borderRadius: 5,
    zIndex:1,
    overflow: 'hidden',
    marginLeft: -20,
    justifyContent:'center'
  },
  image: {
    borderRadius: 5,
  },
  horizontalImage: {
    height: Dimensions.get('window').width/100*25,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  shadow: {
    shadowColor: nowTheme.COLORS.MUTED,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,

  },
  articleButton: {
    fontFamily: 'montserrat-bold',
    paddingHorizontal: 9,
    paddingVertical: 7
  }
});

function mapStateToProps(state) {
  return {
    currentLanguage: state.auth.currentLanguage,
  };
}


export default connect(mapStateToProps)(withNavigation(CourseBlock));
