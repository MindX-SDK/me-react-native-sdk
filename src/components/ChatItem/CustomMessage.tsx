import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bubble, BubbleProps } from 'react-native-gifted-chat';
import { isIOS } from '../../utils/constants/constants';
import colors from '../../utils/theme/colors';
import { CustomIMessage, CustomReply } from '../../';
import { FileHelper, StringHelper, s, st, vs } from '../../utils';
import CustomCardList from './CustomCardList';
import { ButtonObjects, DateTimeObjects } from '../../services';
import CustomArrow from '../CustomView/CustomArrow';
import CustomQuickReply from './CustomQuickReply';
import CustomDateTimePickerMessage from './CustomDateTimePickerMessage';
import { AUDIO_EXTENSIONS_REGEX, IMAGE_EXTENSIONS_REGEX, URL_REGEX, VIDEO_EXTENSIONS_REGEX } from '../../utils/constants/AppConstants';
import VideoPlayer from '../CustomView/VideoPlayer';
import AudioPlayer from '../CustomView/AudioPlayer';
import CustomFile from './CustomFile';
import queryString from 'query-string';

export type CustomMessageProps = BubbleProps<CustomIMessage> & {
  currentUserId: any;
  onCardButtonPress?: (btnData: ButtonObjects, idx?: number) => any;
  onQuickReplyItemPress?: (qrData: CustomReply, idx?: number) => any;
  onDateTimeSelect?: (datetime: Date, endDate?: Date, pickerProps?: DateTimeObjects) => any;
}

const CustomMessage: React.FC<CustomMessageProps> = ({
  currentUserId,
  onCardButtonPress,
  onQuickReplyItemPress,
  onDateTimeSelect,
  ...restProps
}) => {
  //States
  const [localProps, setLocalProps] = useState(restProps);
  //Vars
  const currentMessage = localProps.currentMessage;
  const sameUserInNextMessage = currentMessage?.user?._id === localProps.nextMessage?.user?._id;
  // const isCurrentUser = currentUserId == currentMessage?.user?._id;
  const orientationStyle = localProps?.position === 'right' ? styles.right : styles.left;
  //Effects
  useEffect(() => {
    reformatProps();
  }, [])

  const reformatProps = async () => {
    let newProps: BubbleProps<CustomIMessage> = localProps;
    let blob: Blob | undefined = undefined;
    if (currentMessage?.text) {
      const pathReader = queryString.parseUrl(currentMessage?.text);
      const lowerMsg = (pathReader?.url ?? '').toLowerCase();
      const ext = StringHelper.getFileExtensions(lowerMsg);
      //Show temp UI (three dot) if the message is link with extenstion
      if (ext && URL_REGEX.test(lowerMsg) && lowerMsg?.split(/[/|\\\\]/)?.length >= 4) {
        let tempProps = {
          ...localProps,
          currentMessage: {
            ...currentMessage,
            text: '...',
          }
        };
        setLocalProps(tempProps);
      }
      try {
        blob = await FileHelper.uriToBlob(currentMessage?.text);
      } catch (e) { }

      if (blob?.size) {
        //use queryString is to prevent Url with queries
        const pathReader = queryString.parseUrl(currentMessage?.text);
        const lowerMsg = (pathReader?.url ?? '').toLowerCase();
        if (IMAGE_EXTENSIONS_REGEX.test(lowerMsg)) {
          newProps = {
            ...localProps,
            currentMessage: {
              ...currentMessage,
              text: '',
              image: currentMessage?.text,
            }
          };
        } else if (AUDIO_EXTENSIONS_REGEX.test(lowerMsg)) {
          newProps = {
            ...localProps,
            currentMessage: {
              ...currentMessage,
              text: '',
              audio: currentMessage?.text,
            }
          };
        } else if (VIDEO_EXTENSIONS_REGEX.test(lowerMsg)) {
          newProps = {
            ...localProps,
            currentMessage: {
              ...currentMessage,
              text: '',
              video: currentMessage?.text,
            }
          };
        } else {
          newProps = {
            ...localProps,
            currentMessage: {
              ...currentMessage,
              text: '',
              file: currentMessage?.text,
            }
          };
          
        }
      }
    }

    setLocalProps(newProps);
  }

  const renderBubble = () => {

    return (
      <CustomArrow
        position={localProps?.position}
        borderColor={colors.blueBayoux20}
        borderWidth={1}
      >
        <Bubble
          {...localProps}
          renderTime={timeProps => undefined}
          wrapperStyle={{
            left: [styles.bubble, styles.bubbleLeft],
            right: [styles.bubble, styles.bubbleRight],
          }}
          textStyle={{
            left: styles.messageText,
            right: [styles.messageText, styles.messageTextRight],
          }}
          renderMessageVideo={videoProps => {
            const uri = videoProps.currentMessage?.video;
            if (!uri) {
              return <View />;
            }
            return <VideoPlayer uri={uri} style={styles.video} />;
          }}
          renderMessageAudio={audioProps => {
            const uri = audioProps.currentMessage?.audio;
            if (!uri) {
              return <View />;
            }
            return <AudioPlayer uri={uri} />;
          }}
          renderCustomView={(customProps: BubbleProps<CustomIMessage>) => {
            if (customProps?.currentMessage?.file) {
              return (
                <CustomFile
                  {...customProps}
                  wrapperStyle={{
                    left: [styles.bubble, styles.bubbleLeft],
                    right: [styles.bubble, styles.bubbleRight],
                  }}
                />
              );
            }

          }}
        />
      </CustomArrow>
    )
  }

  const renderContent = () => {
    switch (localProps?.currentMessage?.templateType) {
      case 'card': {
        return <CustomCardList
          {...localProps}
          onButtonPress={(btn, idx) => {
            onCardButtonPress?.(btn, idx);
          }}
        />;
      }
      case 'quick_reply': {
        if (localProps?.currentMessage?.quickReplies?.values?.[0]?.value) {
          return <CustomQuickReply
            {...localProps}
            onCutomQuickReply={(itm, idx) => {
              onQuickReplyItemPress?.(itm, idx)
            }}
          />
        }
        return renderBubble();
      }
      case 'datetime': {
        if (localProps?.currentMessage?.datetime) {
          const pickerProps = localProps?.currentMessage?.datetime;
          return <CustomDateTimePickerMessage
            {...localProps}
            pickerProps={pickerProps}
            onConfirm={(dateTime, endDate) => {
              onDateTimeSelect?.(dateTime, endDate, pickerProps);
            }}
          />
        }
        return renderBubble();
      }
      default: {
        return renderBubble();
      }
    }
  }

  return (
    <View style={[styles.container, orientationStyle]}>
      {renderContent()}
      {!sameUserInNextMessage
        ? <View>
          <Text style={[styles.messageTime, orientationStyle]}>
            {moment(currentMessage?.createdAt).format('LT')}
          </Text>
        </View>
        : undefined
      }
    </View>
  )
}

export default CustomMessage;

const styles = StyleSheet.create({
  container: {},
  bubble: {
    justifyContent: 'center',
    borderRadius: st(5),
    //FIXME: show empty msg
    minHeight: vs(30),
    minWidth: s(20),
    borderWidth: s(1),
    borderColor: colors.blueBayoux20,
  },
  bubbleLeft: {
    backgroundColor: colors.white,
    marginLeft: s(2),
  },
  bubbleRight: {
    backgroundColor: colors.blueBayoux,
    marginRight: s(2),
  },
  right: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  left: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  messageTime: {
    paddingHorizontal: s(12),
    color: colors.grayChateau,
    fontWeight: isIOS ? '400' : 'normal',
    fontSize: st(10),
    lineHeight: st(14),
    letterSpacing: -0.02,
    marginTop: vs(2),
  },
  messageText: {
    color: colors.shark,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: st(12),
    lineHeight: st(16),
    letterSpacing: -0.02,
  },
  messageTextRight: {
    color: colors.white,
  },
  video: {
    margin: st(5),
    borderRadius: st(5),
  },
});