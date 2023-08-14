import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { MessageImage, MessageImageProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../../';
import { s, st, vs } from '../../utils';
import colors from '../../utils/theme/colors';

export type CustomMessageImageProps = MessageImageProps<CustomIMessage> & {}

const IMAGE_DEFAULT_WIDTH = s(260);
const IMAGE_DEFAULT_HEIGHT = vs(150);

const CustomMessageImage: React.FC<CustomMessageImageProps> = ({
  ...restProps
}) => {
  //States
  const [imageWidth, setImageWidth] = useState(0);
  const [imageheight, setImageHeight] = useState(0);
  const [isImageFetching, setIsImageFetching] = useState<boolean>();
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
        // console.log(width, height);
        setImageWidth(isNaN(width) ? IMAGE_DEFAULT_WIDTH : width);
        setImageHeight(isNaN(height) ? IMAGE_DEFAULT_HEIGHT : height);
      },
        (e) => {
          console.log(e);
          setImageWidth(IMAGE_DEFAULT_WIDTH);
          setImageHeight(IMAGE_DEFAULT_HEIGHT);
        })
    }
  }

  return (
    <View>
      <MessageImage
        {...restProps}
        imageStyle={[
          styles.image,
          {
            width: IMAGE_DEFAULT_WIDTH,
            height: calculatedHeight ? calculatedHeight : IMAGE_DEFAULT_HEIGHT,
          }
        ]}
        imageProps={{
          onLoadStart: () => {
            if (isImageFetching !== false) { // false mean it already loaded
              setIsImageFetching(true);
            }
          },
          onLoadEnd: () => {
            setIsImageFetching(false);
          },
        }}
        containerStyle={styles.container}
      />
      {!imageWidth || !imageheight || isImageFetching
        ? <ActivityIndicator
          style={styles.activityIndicator}
          color={colors.mountainMeadow}
        />
        : undefined
      }
    </View>
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
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: st(10),
  },
});