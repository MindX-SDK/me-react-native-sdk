import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { s, screenWidth } from '../../utils';
import Video, { VideoProperties } from 'react-native-video';
import SvgPlayButton from '../../assets/png/ReactSvgs/SvgPlayButton';

export type VideoPlayerProps = Partial<VideoProperties> & {
    uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    uri, ...restProps
}) => {
    //State
    const [pause, setPaused] = useState(true);
    //Refs
    const videoRef = useRef<Video>(null);

    const renderVideo = useMemo(() => {
        return (
            <Video
                {...restProps}
                ref={videoRef}
                source={{ uri }}
                resizeMode={'contain'}
                style={[styles.video, restProps?.style]}
                onLoad={(videoData) => {
                    videoRef?.current?.seek(0);
                    // setPaused(true);
                }}
                paused={pause}
                onLoadStart={() => { }}
                // controls={true}
            />
        );

    }, [uri, restProps, pause])

    return (
        <TouchableHighlight 
            onPress={() => {
                setPaused(prev => !prev);
            }}
        >
            <View style={styles.videoWrapper}>
                {renderVideo}
                {pause 
                ? <SvgPlayButton
                    style={styles.absoluteCenter}
                />
                : undefined}
                
            </View>
        </TouchableHighlight>
        
    );
}

export default VideoPlayer;

const styles = StyleSheet.create({
    videoWrapper: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: screenWidth * 3 / 4,
        height: screenWidth * 3 / 4 * 9 / 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    absoluteCenter: {
        position: 'absolute',
        alignSelf: 'center',
    },
});