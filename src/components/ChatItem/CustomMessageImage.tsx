import React from 'react';
import { StyleSheet } from 'react-native';
import { MessageImage, MessageImageProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../../';
import { s, st, vs } from '../../utils';

export type CustomMessageImageProps = MessageImageProps<CustomIMessage> & {}

const CustomMessageImage: React.FC<CustomMessageImageProps> = ({
  ...restProps
}) => {
  return (
    <MessageImage
      {...restProps}
      imageStyle={styles.image}
      containerStyle={styles.container}
    />
  );
}
export default CustomMessageImage;

const styles = StyleSheet.create({
  container: {
    borderRadius: st(5),
  },
  image: {
    width: s(260),
    height: vs(150),
    borderRadius: st(5),
    margin: st(5),
  },
});