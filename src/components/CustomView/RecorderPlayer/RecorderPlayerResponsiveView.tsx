import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {st, vs} from '../../../utils/scaler';
import PopupManager from './RecorderPlayerResponsiveManager';
import colors from '../../../utils/theme/colors';
import { isIOS } from '../../../utils/constants/constants';
import images from '../../../utils/theme/image';
import Spacer from '../Spacer';
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, AVEncoderAudioQualityIOSType, AVEncodingOption, OutputFormatAndroidType, RecordBackType } from 'react-native-audio-recorder-player';
import { DateTimeHelper } from '../../../utils';
import RNBlobUtil from 'react-native-blob-util';

export type RecorderPlayerResponsiveRef = {
  showPopup: (props: RecorderPlayerShowFunctionProps) => any;
  togglePopup: () => any;
  hidePopup: () => any;
};

export type RecorderPlayerShowFunctionProps = {
  onClose?: (result?: string) => any;
  type: 'record' | 'play'; //FIXME: type play still not handled
  initalUrl?: string;
  position?: 'center' | 'topCenter' | 'bottomCenter';
  positionAt?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  maxLines?: number;
  extraButtonUI?: React.ReactNode;
  onExtraButtonPress?: () => any;
};

const RecorderPlayerResponsivePopup = (
  props: any,
  ref: Ref<RecorderPlayerResponsiveRef>,
) => {
  //States
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isVisible, setIsVisible] = useState(false);
  const [showProps, setShowProps] = useState<RecorderPlayerShowFunctionProps>();
  const [recordMillis, setRecordMillis] = useState(0);
  const {
    type,
    initalUrl,
    position,
    positionAt,
    onClose,
    extraButtonUI,
    onExtraButtonPress,
  } = showProps ?? {};
  // variables that use multiple times
  audioRecorderPlayer.setSubscriptionDuration(0.1);
  var path = Platform.select({
    ios: 'sound.m4a',
    android: `${RNBlobUtil?.fs?.dirs?.CacheDir}/sound.mp3`,
  });

  useImperativeHandle(ref, () => ({
    showPopup,
    togglePopup,
    hidePopup,
  }));

  useEffect(() => {
    const passData: RecorderPlayerResponsiveRef = {
      showPopup,
      togglePopup,
      hidePopup,
    };
    PopupManager.register(passData);
    return function cleanUp() {
      PopupManager.unregister(passData);
    };
  });

  const togglePopup = () => {
    setIsVisible(prev => !prev);
  };

  const showPopup = (showPopupProps: RecorderPlayerShowFunctionProps) => {
    setIsVisible(true);
    setShowProps(showPopupProps);

    if (showPopupProps?.type === 'record') {
      handleStartRecord();
    }
  };

  const hidePopup = () => {
    setIsVisible(false);
    return 
  };

  const selectPosition = (): ViewStyle => {
    if (positionAt) {
      return {
        position: 'absolute',
        ...positionAt,
      };
    }
    switch (position) {
      case 'topCenter': {
        return styles.absoluteTopCenter;
      }
      case 'bottomCenter': {
        return styles.absoluteBottomCenter;
      }
      case 'center':
      default: {
        return styles.absoluteCenter;
      }
    }
  };

  const handleStartRecord = async () => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      // console.log('record-back', e);
      setRecordMillis(e?.currentPosition);
    });
    const uri = await audioRecorderPlayer?.startRecorder(
      path,
      audioSet,
    );
    console.log(`uri: ${uri}`);
  }

  const handleStopRecord = async (isClose?: boolean) => {
    audioRecorderPlayer.removeRecordBackListener();
    const result = await audioRecorderPlayer.stopRecorder();
    setRecordMillis(0);
    console.log(result);

    //Close popup
    hidePopup();
    onClose?.(isClose ? undefined : result);
  };

  const renderContent = () => {
    return (
      <View style={[styles.container, selectPosition()]}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>
            {DateTimeHelper.msToHMS(recordMillis)}
          </Text>
          <Image source={images.ic_record_line} style={styles.recordLineImage} />
        </View>
        <Spacer height={16} />
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => {
              handleStopRecord(true)
            }}
          >
            <Image source={images.ic_trash_bin} resizeMode={'contain'} style={styles.imageTrashBtn} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleStopRecord();
            }}
          >
            <Image source={images.ic_stop_play} resizeMode={'contain'} style={styles.imageRecordButton} />
          </TouchableOpacity>
          { extraButtonUI 
            ? <TouchableOpacity
              onPress={() => {
                onExtraButtonPress?.();
              }}
            >
              {extraButtonUI}
            </TouchableOpacity>
            : <Spacer width={20} />
          }
        </View>
      </View>
    );
  };

  return <>{isVisible ? renderContent() : null}</>;
};

const styles = StyleSheet.create({
  container: {
    padding: st(16),
    backgroundColor: colors.white,
    borderRadius: st(5),
    marginHorizontal: st(6),
  },
  absoluteCenter: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  absoluteTopCenter: {
    position: 'absolute',
    top: vs(24),
    alignSelf: 'center',
  },
  absoluteBottomCenter: {
    position: 'absolute',
    bottom: vs(24),
    alignSelf: 'center',
  },
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
export default forwardRef(RecorderPlayerResponsivePopup);
