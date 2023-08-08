import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DateTimeHelper, screenWidth, st, vs } from '../../utils';
import images from '../../utils/theme/image';
import colors from '../../utils/theme/colors';
import { isIOS } from '../../utils/constants/constants';
import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player';
import Spacer from './Spacer';

export type AudioPlayerProps = {
  uri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  uri
}) => {
  //States
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMillis, setPlaybackMillis] = useState(0);

  const handleStartPlay = async () => {
    console.log('handleStartPlay', uri);

    try {
      const msg = await audioRecorderPlayer.startPlayer(uri);
      setIsPlaying(true);

      //? Default path
      // const msg = await this.audioRecorderPlayer.startPlayer();
      const volume = await audioRecorderPlayer.setVolume(1.0);
      console.log(`path: ${msg}`, `volume: ${volume}`);

      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        // console.log('playBackListener', e);
        setPlaybackMillis(e.currentPosition);
        if (e.duration === e.currentPosition) {
          handleStopPlay();
        }
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };

  const handleStopPlay = async () => {
    console.log('onStopPlay');
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              handleStopPlay();
            } else {
              handleStartPlay();
            }
          }}
        >
          <Image
            source={isPlaying ? images.ic_stop_play : images.ic_player}
            resizeMode={'contain'}
            style={styles.imageRecordButton}
          />
        </TouchableOpacity>
          <Spacer width={10} />
        <Image source={images.ic_record_line} style={styles.recordLineImage} />
      </View>
      <Spacer height={6} />
      <Text style={styles.text}>
        {DateTimeHelper.msToHMS(playbackMillis)}
      </Text>
    </View>

  );
}

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 3/4,
    paddingVertical: vs(7),
    paddingLeft: vs(10),
    paddingRight: vs(15),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.nobel,
    fontSize: st(12),
    fontWeight: isIOS ? '500' : 'normal',
    alignSelf: 'flex-start',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  recordLineImage: {
    flex: 1,
    height: vs(24),
  },
  imageRecordButton: {
    width: st(24),
    height: st(24),
  },
});