import React from 'react';
import { StyleSheet,Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import { Block, Text } from 'galio-framework';

const { width, height } = Dimensions.get('screen');
import Icon from './Icon';
import { nowTheme } from '../constants';

class DropDown extends React.Component {
  state = {
    value: 1
  };

  handleOnSelect = (index, value) => {
    const { onSelect } = this.props;

    this.setState({ value: value });
    onSelect && onSelect(index, value);
  };

  render () {
    const {
      onSelect,
      iconName,
      iconFamily,
      iconSize,
      iconColor,
      color,
      textStyle,
      style,
      ...props
    } = this.props;

    const modalStyles = [styles.qty, color && { backgroundColor: color }, style];

    const textStyles = [styles.text, textStyle];

    return (
      <ModalDropdown
        style={modalStyles}
        onSelect={this.handleOnSelect}
        dropdownStyle={styles.dropdown}
        dropdownTextStyle={{ paddingLeft: 16, fontSize: 12 }}
        {...props}
      >
        <Block row space="between">
          <Text size={12} style={textStyles}>
            {this.props.value}
          </Text>
          <Icon
            name={iconName || 'minimal-down2x'}
            family={iconFamily || 'NowExtra'}
            size={iconSize || 10}
            color={iconColor || nowTheme.COLORS.SECONDARY_TEXT}
          />
        </Block>
      </ModalDropdown>
    );
  }
}

DropDown.propTypes = {
  onSelect: PropTypes.func,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.any
};

const styles = StyleSheet.create({
  qty: {
    width: 100,
    backgroundColor: nowTheme.COLORS.DEFAULT,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1
    
  },
  text: {
    color: nowTheme.COLORS.SECONDARY_TEXT,
    fontWeight: '400', 
  },
  dropdown: {
    marginTop: 8,
    marginLeft: -16,
    width: width*0.7,
    height:100
  }
});

export default DropDown;
