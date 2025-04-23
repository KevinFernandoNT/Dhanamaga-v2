import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Dimensions, FlatList, ScrollView, View, SafeAreaView } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTMLView from 'react-native-htmlview';

import Icon from './Icon';
import Input from './Input';
import nowTheme from '../constants/Theme';

import { getAllCourses } from '../store/modules/courses/courses'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
class SearchBar extends React.Component {
  state = {
    searchInput: '',
    searchDetails: [],
    viewSeachTab: false,
    viewTabOther: this.props.removeSearchView
  }
  search() {
    let search = this.state.searchInput
    this.setState({ viewSeachTab: false })
    if (search != '') {
      this.setState({ searchInput: '' })
      // this.props.navigation.setParams({search: search, screen: 'search'})
      this.props.navigation.navigate('Search Results', { search: search, screen: 'search' })
    } else {
      return
    }
  }

  searchTest = async (value) => {
    this.props.checkView()
    this.props.onFoucs()
    this.setState({ searchInput: value, viewSeachTab: true })
    const defaultLang = await AsyncStorage.getItem('selectedLanguage')
    if(value != ''){
      this.props.getAllCourses(defaultLang, 'All', value).then((res) => {
        this.setState({ searchDetails: res.data.courses.courses, viewSeachTab: true })
      })
    }else{
      this.setState({ searchDetails: [], viewSeachTab: false,searchInput:'' })
    }
  }

  handleSearch(title) {
    this.props.pressSearchItem()
    this.setState({ searchInput: title, viewSeachTab: false })
    this.props.navigation.navigate('Search Results', { search: title, screen: 'search' })
    this.setState({ searchDetails: [] })
  }

  ItemView = ({ item }) => {
    return (
      <Block style={styles.itemSet}>
        <TouchableOpacity onPress={() => this.handleSearch(item.title)}>
          <Block>
            <HTMLView
              value={item.searchTitle}
              stylesheet={styles.itemStyle}
            />
            <Text style={styles.titleType}>{item.type}</Text>
          </Block>
        </TouchableOpacity>

      </Block>
    );
  };

  onFocus() {
    this.setState({ searchInput: '', searchDetails: [] })
    this.props.onFoucs()
  }

  renderSearch = () => {
    const { navigation, placeholder, removeSearchView } = this.props;
    return (
      <Block onStartShouldSetResponder={evt => {
        evt.persist();
        this.props.checkView()
      }} >
        <Input
          right
          name="searchInput"
          color={nowTheme.COLORS.BLACK}
          style={styles.search}
          placeholder={placeholder}
          placeholderTextColor={nowTheme.COLORS.MUTED}
          value={this.state.searchInput}
          onChangeText={(value) => this.searchTest(value)}
          iconContent={
            <TouchableOpacity onPress={() => this.search()}>
              <Icon size={16} color={theme.COLORS.MUTED} name="zoom-bold2x" family="NowExtra" />
            </TouchableOpacity>
          }
          onFocus={() => this.onFocus()}
        />
        {this.state.searchDetails.length > 0 && this.state.viewSeachTab && removeSearchView && this.state.searchInput != '' ?
          <Block style={styles.searchView}>
            <FlatList
              data={this.state.searchDetails}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.ItemView}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="always"
            />
          </Block> : null
        }
      </Block>
    );
  };

  renderHeader = () => {
    const { search, options, tabs } = this.props;
    return (
      <Block onStartShouldSetResponder={evt => {
        evt.persist();
        this.props.checkView()
      }} center>
        {this.renderSearch()}
      </Block>
    );
  };
  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      removeSearchView,
      ...props
    } = this.props;

    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: nowTheme.COLORS.BLACKRGB } : null
    ];
    return (
      <Block>
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    position: 'relative'
  },
  title: {
    width: '100%',
    fontSize: nowTheme.SIZES.FONT,
    fontWeight: 'bold',
    fontFamily: 'montserrat-regular'
  },
  titleType: {
    fontFamily: 'montserrat-regular',
    fontSize: nowTheme.SIZES.BUTTON_TEXT_SMALL,
    color: nowTheme.COLORS.DARK_GRAY,
    marginTop: 3
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: nowTheme.COLORS.BLACKRGB,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: nowTheme.COLORS.HEADER
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
  searchView: {
    paddingLeft: 20,
    paddingRight: 20,
    maxHeight: 200,
    minHeight: 10,
    borderColor: nowTheme.COLORS.GRAY,
    borderWidth: 0.8,
    marginHorizontal: 20,
    // overflow: 'scroll',
    borderRadius: 10,
    paddingBottom: 10,
  },
  itemStyle: {
    fontSize: nowTheme.SIZES.PRIMARY_FONT,
    fontFamily: 'montserrat-regular',
  },
  itemSet: {
    marginTop: 10,
    borderBottomColor: nowTheme.COLORS.GRAY,
    borderBottomWidth: 2, paddingBottom: 2
  }
});


function mapStateToProps(state) {
  return {
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllCourses
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);