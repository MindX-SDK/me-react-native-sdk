import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { CustomIMessage, CustomReply } from '../../';
import { s, st, vs } from '../../utils';
import Lightbox, { LightboxProps } from 'react-native-lightbox-v2'
import CustomArrow from '../CustomView/CustomArrow';
import colors from '../../utils/theme/colors';
import { isIOS } from '../../utils/constants/constants';
import CustomImage from '../CustomView/CustomImage';

export type CustomQuickReplyProps = BubbleProps<CustomIMessage> & {
  onCutomQuickReply?: (btnData: CustomReply, idx?: number) => any;
  // lightboxProps?: LightboxProps;
}
const IMAGE_DEFAULT_HEIGHT = vs(112);

const CustomQuickReply: React.FC<CustomQuickReplyProps> = ({
  onCutomQuickReply,
  // lightboxProps,
  ...restProps
}) => {
  const quickReplies = restProps?.currentMessage?.quickReplies?.values ?? [];
  const renderQuickReplyItem = (itm: CustomReply, idx: number) => {
    return (
      <View key={`quickreply-item-${itm?.title}-${idx}`}>
        {/* {itm?.title !== itm?.value ? <Text style=>{itm?.title}</Text> : undefined} */}
        {itm?.['image-uri'] ? (
          <CustomImage uri={itm?.['image-uri']} fixedHeight={IMAGE_DEFAULT_HEIGHT} />
        ) : undefined}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onCutomQuickReply?.(itm, idx);
          }}>
          <Text style={styles.buttonText}>{itm?.title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <CustomArrow
      position={restProps?.position}
      borderColor={colors.blueBayoux20}
      borderWidth={1}
    >
      <View style={styles.bubble}>
        <Text style={[
          styles.messageText,
          restProps?.position === 'right'
            ? styles.messageTextRight
            : undefined
        ]}
        >
          {restProps?.currentMessage?.text}
        </Text>
        <View style={styles.separator} />
        <View style={styles.wrapContent}>
          {quickReplies?.map((it, idx) => renderQuickReplyItem(it, idx))}
        </View>
      </View>

    </CustomArrow>
  );
}

export default CustomQuickReply;

const styles = StyleSheet.create({
  flexGrowOne: {
    flexGrow: 1,
  },
  bubble: {
    maxWidth: s(251),
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.blueBayoux20,
    // alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: st(5),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    //FIXME: show empty msg
    minHeight: vs(30),
    minWidth: s(20),

    marginHorizontal: s(2),
  },
  wrapContent: {
    justifyContent: 'flex-start',
    maxWidth: s(230),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: colors.mountainMeadow,
    borderRadius: st(5),
    paddingVertical: vs(10),
    paddingHorizontal: vs(8),
    marginRight: s(10),
    marginBottom: vs(8),
  },
  image: {
    width: st(48),
    height: st(48),
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
  messageText: {
    color: colors.shark,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: st(12),
    lineHeight: st(16),
    letterSpacing: -0.02,
    alignSelf: 'flex-start',
  },
  messageTextRight: {
    color: colors.white,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.blueBayoux20,
    marginVertical: vs(4),
  },
  buttonText: {
    color: colors.white,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: st(12),
    lineHeight: st(16),
    letterSpacing: -0.02,
  },
});