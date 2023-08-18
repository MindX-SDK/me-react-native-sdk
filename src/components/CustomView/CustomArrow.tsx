/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ColorValue, StyleSheet, View, ViewProps } from 'react-native';
import colors from '../../utils/theme/colors';
import { s, vs } from '../../utils';

export type CustomArrowProps = ViewProps & {
  position: 'left' | 'right';
  borderColor?: ColorValue;
  borderWidth?: number;
};

const CustomArrow: React.FC<CustomArrowProps> = ({
  children,
  position,
  borderColor,
  borderWidth = 0,
  ...restProps
}) => {
  const sideStyle =
    position === 'right' ? styles.rightTriangle : styles.leftTriangle;
  return (
    <View {...restProps}>
      {children}
      <View
        style={[
          styles.triangle,
          sideStyle,
          {
            borderBottomColor: borderColor,
            transform: [
              { scale: (10 + borderWidth * 2) / 10 },
              { rotate: '-90deg' },
            ],
            marginLeft: position === 'left' ? -borderWidth * 2 - 1 : 0,
            marginRight: position === 'right' ? -borderWidth * 2 - 1 : 0,
            left:
              position === 'left' && sideStyle?.left
                ? sideStyle?.left - borderWidth
                : undefined,
            right:
              position === 'right' && sideStyle?.right
                ? sideStyle?.right - borderWidth
                : undefined,
          },
        ]}
      />
      <View style={[styles.triangle, sideStyle]} />
    </View>
  );
};

export default CustomArrow;

const styles = StyleSheet.create({
  triangle: {
    position: 'absolute',
    top: vs(5),
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: s(10),
    borderBottomWidth: s(10),
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    zIndex: 10,
  },
  leftTriangle: {
    borderBottomColor: colors.white,
    left: -s(10),
    right: undefined,
    transform: [{ rotate: '-90deg' }],
    borderRightWidth: 0,
    borderLeftWidth: s(10),
  },
  rightTriangle: {
    borderBottomColor: colors.blueBayoux,
    left: undefined,
    right: -s(10),
    transform: [{ rotate: '90deg' }],
    borderRightWidth: s(10),
    borderLeftWidth: 0,
  },
});
