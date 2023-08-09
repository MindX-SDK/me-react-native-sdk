import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { MessageImage, MessageImageProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../../';
import { s, st, vs } from '../../utils';

export type CustomMessageImageProps = MessageImageProps<CustomIMessage> & {}

const IMAGE_DEFAULT_WIDTH = s(260);
const IMAGE_DEFAULT_HEIGHT = vs(150);

const CustomMessageImage: React.FC<CustomMessageImageProps> = ({
  ...restProps
}) => {
  //States
  const [imageWidth, setImageWidth] = useState(IMAGE_DEFAULT_WIDTH);
  const [imageheight, setImageHeight] = useState(0);
  //Vars
  const calculatedHeight = (imageheight * IMAGE_DEFAULT_WIDTH / (imageWidth ?? 1));
  //Effects
  useEffect(() => {
    getSize();
  }, [restProps?.currentMessage]);

  const getSize = async () => {
    const uri = restProps?.currentMessage?.image;
    if (uri) {
      Image.getSize(uri, (width, height) => {
        console.log(width, height);
        setImageWidth(isNaN(width) ? 0 : width);
        setImageHeight(isNaN(height) ? 0 : height);
      },
      (e) => console.log(e))
    }
  }

  return (
    <MessageImage
      {...restProps}
      imageStyle={[
        styles.image,
        {
          width: IMAGE_DEFAULT_WIDTH,
          height: calculatedHeight ? calculatedHeight : IMAGE_DEFAULT_HEIGHT,
        }
      ]}
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