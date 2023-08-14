import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { s, st, vs } from '../../utils';
import Lightbox, { LightboxProps } from 'react-native-lightbox-v2'
import colors from '../../utils/theme/colors';

const IMAGE_DEFAULT_WIDTH = s(189);
const IMAGE_DEFAULT_HEIGHT = vs(112);

export type CustomImageProps = {
    uri: string;
    fixedWidth?: number,
    fixedHeight?: number,
}

const CustomImage: React.FC<CustomImageProps> = ({
    uri,
    fixedWidth,
    fixedHeight,
}) => {
    const defaultWidth = fixedWidth ? fixedWidth : IMAGE_DEFAULT_WIDTH;
    const defaultHeight = fixedHeight ? fixedHeight: IMAGE_DEFAULT_HEIGHT;
    //States
    const [imageWidth, setImageWidth] = useState(0);
    const [imageheight, setImageHeight] = useState(0);
    const [isImageFetching, setIsImageFetching] = useState<boolean>();

    //Vars
    const calculatedHeight = (imageheight * defaultWidth / (imageWidth ? imageWidth : 1));
    const calculatedWidth = (imageWidth * defaultHeight / (imageheight ? imageheight : 1));
    //Effects
    useEffect(() => {
        getSize();
    }, [uri]);

    const getSize = async () => {
        if (uri) {
            Image.getSize(uri, (width, height) => {
                // console.log(width, height);
                setImageWidth(isNaN(width) ? defaultWidth : width);
                setImageHeight(isNaN(height) ? defaultHeight : height);
            },
                (e) => {
                    console.log(e);
                    setImageWidth(defaultWidth);
                    setImageHeight(defaultHeight);
                })
        }
    }

    return (
        <View>
            {/* @ts-ignore */}
            <Lightbox
                activeProps={{
                    style: styles.imageActive,
                }}
            // {...lightboxProps}
            >
                <Image
                    source={{ uri: uri }}
                    style={[
                        styles.image,
                        {
                            width: fixedWidth ? defaultWidth : calculatedWidth,
                            height: fixedHeight ? defaultHeight : calculatedHeight,
                        }
                    ]}
                    onLoadStart={() => {
                        if (isImageFetching !== false) { // false mean it already loaded
                            setIsImageFetching(true);
                        }
                    }}
                    onLoadEnd={() => {
                        setIsImageFetching(false);
                    }}
                />

            </Lightbox>
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

export default CustomImage;

const styles = StyleSheet.create({
    image: {
        // width: s(214),
        height: vs(112),
        borderRadius: st(5),
        margin: st(3),
        // resizeMode: 'cover',
        alignSelf: 'center'
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
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