import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { s, st } from '../../../utils/scaler';
import { isIOS } from '../../../utils/constants/constants';
import colors from '../../../utils/theme/colors';

export type SvgCustomFileProps = SvgProps & {
  fileExtensions?: string;
};

function SvgCustomFile({
  fileExtensions = '',
  ...restProps
}: SvgCustomFileProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: s(28),
          height: s(37),
        },
      ]}
    >
      <Svg
        width={s(28)}
        height={s(37)}
        viewBox="0 0 28 37"
        fill="none"
        // xmlns="http://www.w3.org/2000/svg"
        {...restProps}
      >
        <Path
          d="M27 13.356v17.831c0 1.045-.41 2.046-1.142 2.785a3.881 3.881 0 01-2.758 1.153H4.9a3.881 3.881 0 01-2.758-1.153A3.957 3.957 0 011 31.187V4.938c0-1.044.41-2.045 1.142-2.784A3.881 3.881 0 014.9 1h9.506c.69 0-.132.277.355.769L26.24 13.356c.487.492.76-.696.761 0z"
          fill="#5848E3"
          stroke="#5848E3"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M14.813 1v9.622a2.566 2.566 0 002.565 2.566H27"
          fill="#BCB5FF"
        />
        <Path
          d="M14.813 1v9.622a2.566 2.566 0 002.565 2.566H27L14.812 1z"
          stroke="#BCB5FF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{fileExtensions?.toLowerCase()}</Text>
      </View>
    </View>
  );
}

export default SvgCustomFile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textWrapper: {
    position: 'absolute',
    left: 'auto',
    top: 'auto',
    right: st(4),
    bottom: st(4),
  },
  text: {
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: s(8),
    lineHeight: s(12),
    color: colors.concrete,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
