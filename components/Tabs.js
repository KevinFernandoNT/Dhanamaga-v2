import React from 'react';
import { StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Block, theme } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';
import {en} from '../constants/languages/english.json'
import {si} from '../constants/languages/sinhala.json'
import {ta} from '../constants/languages/tamil.json'

const { width } = Dimensions.get('screen');
import nowTheme from '../constants/Theme';

const defaultMenu = [
  { id: 'music', title: 'Music', },
  { id: 'beauty', title: 'Beauty', },
  { id: 'fashion', title: 'Fashion', },
  { id: 'motocycles', title: 'Motocycles', },
];

i18n.translations = {
  en,
  si,
  ta
}
export default class Tabs extends React.Component {
  static defaultProps = {
    data: defaultMenu,
    // initialIndex: null,
  }

  state = {
    active: null,
  }

  componentDidMount() {
    const { initialIndex } = this.props;
    initialIndex && this.selectMenu(initialIndex);
    this.forceUpdate()
  }

  animatedValue = new Animated.Value(1);

  animate() {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  menuRef = React.createRef();

  onScrollToIndexFailed = () => {
    this.menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5
    });
  }

  selectMenu = (id) => {
    this.setState({ active: id });

    this.menuRef.current.scrollToIndex({
      index: this.props.data.findIndex(item => item.id === id),
      viewPosition: 0.5
    });

    this.animate();
    this.props.onChange && this.props.onChange(id);
  }

  renderItem = (item) => {
    const isActive = this.state.active === item.id;

    const textColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [nowTheme.COLORS.TEXT, isActive ? nowTheme.COLORS.WHITE : nowTheme.COLORS.SECONDARY],
      extrapolate: 'clamp',
    });

    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: nowTheme.COLORS.TABS },
      isActive && styles.containerShadow,
      this.props.vertical && { marginVertical: 10 }
    ];

    const renderTitleLanguageWise = (title) => {
      if(title == 'Lessons') {
        return i18n.t('corseDetails_screen_tab1')
      } else if(title == 'Questions') {
        return i18n.t('corseDetails_screen_tab2')
      } else if(title == 'More') {
        return i18n.t('corseDetails_screen_tab3')
      } 
      return title
    }

    return (
      <Block style={containerStyles}>
        <Animated.Text
          style={[
            styles.menuTitle,
            { color: textColor },
            this.props.vertical && { paddingHorizontal: 5 },
            { fontFamily: 'montserrat-regular' },
          ]}
          onPress={() => this.selectMenu(item.id)}>
          {renderTitleLanguageWise(item.title)}
        </Animated.Text>
      </Block>
    )
  }

  renderMenu = () => {
    const { data, ...props } = this.props;

    return (
      <FlatList
        {...props}
        data={data}
        horizontal={props.vertical ? false : true}
        ref={this.menuRef}
        extraData={this.state}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={this.onScrollToIndexFailed}
        renderItem={({ item }) => this.renderItem(item)}
        contentContainerStyle={[styles.menu, this.props.vertical && styles.menuVertical]}
      />
    )
  }

   mainContainerStyles = [
    styles.container,
    this.props.vertical && styles.containerVertical
  ];

  render() {
    return (
      <Block style={this.mainContainerStyles} >
        {this.renderMenu()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: theme.COLORS.WHITE,
    zIndex: 2,
  },
  containerVertical: {
    marginVertical: 20
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  menu: {
    paddingHorizontal: theme.SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuVertical: {
    paddingHorizontal: theme.SIZES.BASE * 7.5,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: nowTheme.COLORS.ACTIVE,
    borderRadius: 21,
    marginRight: 9,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  containerShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: nowTheme.COLORS.MUTED
  },
});
