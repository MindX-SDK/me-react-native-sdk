import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;
const verticalScale = (size: number) =>
  (screenHeight / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const scaleText = (size: number) =>
  screenHeight > screenWidth ? scale(size) : verticalScale(size);

export {
  scale as s,
  verticalScale as vs,
  scaleText as st,
  scale,
  verticalScale,
  scaleText,
  moderateScale,
  screenWidth,
  screenHeight,
};
