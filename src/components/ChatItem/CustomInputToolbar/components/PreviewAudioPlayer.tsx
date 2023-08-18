import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DateTimeHelper, st, vs } from '../../../../utils';
import Spacer from '../../../CustomView/Spacer';
import images from '../../../../utils/theme/image';
import colors from '../../../../utils/theme/colors';
import { isIOS } from '../../../../utils/constants/constants';
import AudioRecorderPlayer, {
  PlayBackType,
} from 'react-native-audio-recorder-player';

export type PreviewAudioPlayerProps = {
  audioPath: string;
  onRemove?: () => any;
  extraButtonUI?: React.ReactNode;
  onExtraButtonPress?: () => any;
};

const PreviewAudioPlayer: React.FC<PreviewAudioPlayerProps> = ({
  audioPath,
  onRemove,
  extraButtonUI,
  onExtraButtonPress,
}) => {
  //States
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMillis, setPlaybackMillis] = useState(0);

  const handleStartPlay = async () => {
    console.log('handleStartPlay', audioPath);

    try {
      const msg = await audioRecorderPlayer.startPlayer(audioPath);
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
    <>
      <View style={styles.rowContainer}>
        <Text style={styles.text}>
          {DateTimeHelper.msToHMS(playbackMillis)}
        </Text>
        <Image source={images.ic_record_line} style={styles.recordLineImage} />
      </View>
      <Spacer height={16} />
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => {
            handleStopPlay();
            onRemove?.();
          }}
        >
          <Image
            source={images.ic_trash_bin}
            resizeMode={'contain'}
            style={styles.imageTrashBtn}
          />
        </TouchableOpacity>
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
        {extraButtonUI ? (
          <TouchableOpacity
            onPress={() => {
              onExtraButtonPress?.();
            }}
          >
            {extraButtonUI}
          </TouchableOpacity>
        ) : (
          <Spacer width={20} />
        )}
      </View>
    </>
  );
};

export default PreviewAudioPlayer;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontSize: st(12),
    fontWeight: isIOS ? '500' : 'normal',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  recordLineImage: {
    flex: 1,
    height: vs(24),
  },
  imageTrashBtn: {
    width: st(20),
    height: st(20),
  },
  imageRecordButton: {
    width: st(32),
    height: st(32),
  },
});
