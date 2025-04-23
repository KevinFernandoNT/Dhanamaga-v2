import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import * as Progress from 'react-native-progress';
import { Rating, AirbnbRating } from 'react-native-ratings';
import SampleVideoPlayerModal from './VideoPlayerModal'
import { nowTheme, Images } from '../constants';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
class Card extends React.Component {
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
      progress,
      value,
      onpress,
      sample,
      tokenStatus,
      idStatus,
      ratings
    } = this.props;

    const titleStyles = [styles.cardTitle, titleStyle];
    const cardContainer = [ styles.card, styles.shadow, style  ];
    const cardHorizantalContainer = [ styles.cardHorizantal, styles.shadow, style  ];

    const primaryFontSize = this.props.currentLanguage == 'en' ? nowTheme.SIZES.PRIMARY_FONT : nowTheme.SIZES.SUB_PRIMARY_FONT; //14
    const largePrimaryFontSize = this.props.currentLanguage == 'en' ? nowTheme.SIZES.LARGE_FONT_PRIMARY : nowTheme.SIZES.SUB_LARGE_FONT_PRIMARY;//32
    const secondartFontSize = this.props.currentLanguage == 'en' ? nowTheme.SIZES.SECONDARY_FONT : nowTheme.SIZES.SUB_SECONDARY_FONT;//12
    return (
      <Block row={horizontal} card flex style={horizontal ? cardHorizantalContainer : cardContainer}>
        <SampleVideoPlayerModal show={this.state.modalOpen} videoUrl={item.videoUrl} brackDropPressHandler={this.brackDropPressHandler} />
        <Block flex >
          <TouchableWithoutFeedback onPress={sample ? () => this.sampleHandler(item) : () => navigation.navigate(onpress, { _id: idStatus ? item._id : item.course, title: item.title })}>
            <Image style={horizontal ? styles.horizontalImageContent:styles.nonHorizontalImageContent} resizeMode={'stretch'}  source={item.thumbnailUrl && item.thumbnailUrl != null ? { uri: item.thumbnailUrl } : Images.NoImagePlaceholder}  />
            </TouchableWithoutFeedback>
          </Block>
          <Block flex style={styles.cardDescription }>
          <TouchableWithoutFeedback onPress={sample ? () => this.sampleHandler(item) : () => navigation.navigate(onpress, { _id: idStatus ? item._id : item.course, title: item.title })}>
            <Block>
              <Text
                style={styles.textFont}
                size={primaryFontSize}
                style={titleStyles}
                color={nowTheme.COLORS.SECONDARY}
              >
                {item.title}
              </Text>
              {ratings && <Block flex row right>
                <Block center row>
                <Rating
                  ratingCount={5}
                  startingValue={item.rating ? item.rating : 0}
                  style={styles.ratingStyle}
                  imageSize={nowTheme.SIZES.SECONDARY_FONT}
                  jumpValue={1}
                  readonly
                />
                <Text
                  size={nowTheme.SIZES.SECONDARY_FONT}
                  color={nowTheme.COLORS.SECONDARY_TEXT}
                  center
                >
                  {item.rating ? item.rating : 0}
                </Text>
                </Block>
              </Block>
              }
              {progress ? (
                <Progress.Bar
                  height={10}
                  borderWidth={1}
                  color={nowTheme.COLORS.DRAWER_ACTIVE_TEXT}
                  style={styles.progressBar}
                  progress={value} />) : (<Block />)}
              {item.subtitle ? (
                <Block flex center>
                  <Text
                    style={styles.textFont}
                    size={largePrimaryFontSize}
                    color={nowTheme.COLORS.BLACK}
                  >
                    {item.subtitle}
                  </Text>

                </Block>
              ) : (
                <Block />
              )}
              {item.description ? (
                <Block flex center>
                  <Text
                    style={styles.descriptionText}
                    size={primaryFontSize}
                    color={nowTheme.COLORS.NOBEL}
                  >
                    {item.description}
                  </Text>
                </Block>
              ) : (
                <Block />
              )}
              {item.body ? (
                <Block flex left>
                  <Text
                    style={styles.textFont}
                    size={secondartFontSize}
                    color={nowTheme.COLORS.TEXT}
                  >
                    {item.body}
                  </Text>
                </Block>
              ) : (
                <Block />
              )}
            </Block>
            {/* <Block right={ctaRight ? true : false}>
              <Text
                style={styles.articleButton}
                size={secondartFontSize}
                muted={!ctaColor}
                color={ctaColor || nowTheme.COLORS.ACTIVE}
                bold
              >
                {item.cta}
              </Text>
            </Block> */}
            </TouchableWithoutFeedback>
          </Block>
        
      </Block>
    );
  }
}

Card.propTypes = {
  item: PropTypes.any,
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
    minHeight: Dimensions.get('window').width / 100 * 25,
    marginBottom: 4
  },
  cardHorizantal: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0.5,
    minHeight: Dimensions.get('window').width / 100 * 25,
    marginBottom: 4
  },
  progressBar: {
    marginHorizontal: 9,
    marginTop:7,
    marginBottom:8,
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 8
  },
  cardDescription: {
    // padding: theme.SIZES.BASE / 2
    justifyContent:'center'
  },
  horizontalImageContent:{
    height:'100%',
    borderBottomLeftRadius:6,
    borderTopLeftRadius:6,
    width:'100%'
  },
  nonHorizontalImageContent:{
    height:Dimensions.get('window').width / 100 * 25,
    borderTopLeftRadius:6,
    borderTopLeftRadius:6,
    width:'100%'
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden'
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto'
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: nowTheme.COLORS.MUTED,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  articleButton: {
    fontFamily: 'montserrat-bold',
    paddingHorizontal: 9,
    paddingVertical: 7
  },
  textFont: {
    fontFamily: 'montserrat-regular'
  },
  descriptionText: {
    fontFamily: 'montserrat-regular',
    textAlign: 'center', 
    padding: 15
  },
  ratingStyle:{ 
    marginLeft: 10, 
    marginRight: 5, 
    textAlign: 'left' }
});

function mapStateToProps(state) {
  return {
    tokenStatus: state.auth.tokenStatus,
    currentLanguage: state.auth.currentLanguage,
  };
}

export default withNavigation(connect(mapStateToProps)(Card));
