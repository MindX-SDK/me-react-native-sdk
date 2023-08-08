import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { screenWidth } from '../../utils';
import Video, { VideoProperties } from 'react-native-video';

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
    return (
        <Video
            {...restProps}
            ref={videoRef}
            source={{ uri }}
            resizeMode={'contain'}
            style={[styles.video, restProps?.style]}
            onLoad={(videoData) => {
                videoRef?.current?.seek(0);
                setPaused(true);
            }}
            paused={pause}
            onLoadStart={() => { }}
            controls={true}
        />
    );
}

export default VideoPlayer;

const styles = StyleSheet.create({
    video: {
        width: screenWidth * 3 / 4,
        height: screenWidth * 3 / 4 * 9 / 16,
    },
});