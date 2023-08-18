import React from 'react';
import { DimensionValue, View } from 'react-native';
import { scale, verticalScale } from '../../utils';

type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
};

const Spacer: React.FC<Props> = ({ width, height }) => {
  const actualWidth = typeof width === 'number' ? scale(width ?? 0) : width;
  const actualHeight =
    typeof height === 'number' ? verticalScale(height ?? 0) : height;
  return <View style={{ width: actualWidth, height: actualHeight }} />;
};

export default Spacer;
