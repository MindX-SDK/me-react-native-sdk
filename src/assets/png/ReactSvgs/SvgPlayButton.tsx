import React from 'react';
// import { StyleSheet } from 'react-native';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';
import { s } from '../../../utils/scaler';

export type SvgPlayButtonProps = SvgProps & {};

function SvgPlayButton({ ...restProps }: SvgPlayButtonProps) {
  return (
    <Svg
      width={s(47)}
      height={s(37)}
      viewBox="0 0 47 37"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <Rect width={47} height={37} rx={15} fill="#5848E3" />
      <Path
        d="M28.19 16.404c1.08.746 1.08 2.446 0 3.192l-4.481 3.1C22.539 23.507 21 22.6 21 21.1v-6.2c0-1.5 1.538-2.407 2.709-1.597l4.482 3.1z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgPlayButton;

// const styles = StyleSheet.create({});
