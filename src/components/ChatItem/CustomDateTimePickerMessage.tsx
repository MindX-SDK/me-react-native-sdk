import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { CustomIMessage, DateTimeObjects } from '../..';
import { s, st, vs } from '../../utils';
import CustomArrow from '../CustomView/CustomArrow';
import colors from '../../utils/theme/colors';
import { isIOS } from '../../utils/constants/constants';
import CustomDateTimePicker from '../CustomView/CustomDateTimePicker/CustomDateTimePicker';

export type CustomDateTimePickerMessageProps = BubbleProps<CustomIMessage> & {
  pickerProps: DateTimeObjects;
  onConfirm?: (dateTime: Date, endDate?: Date) => any;
};

const CustomDateTimePickerMessage: React.FC<
  CustomDateTimePickerMessageProps
> = ({ pickerProps, onConfirm, ...restProps }) => {
  return (
    <CustomArrow
      position={restProps?.position}
      borderColor={colors.blueBayoux20}
      borderWidth={1}
    >
      <View style={styles.bubble}>
        <Text
          style={[
            styles.messageText,
            restProps?.position === 'right'
              ? styles.messageTextRight
              : undefined,
          ]}
        >
          {restProps?.currentMessage?.text}
        </Text>
        <View style={styles.separator} />
        <CustomDateTimePicker pickerProps={pickerProps} onConfirm={onConfirm} />
      </View>
    </CustomArrow>
  );
};

export default CustomDateTimePickerMessage;

const styles = StyleSheet.create({
  flexGrowOne: {
    flexGrow: 1,
  },
  flatList: {
    flex: 1,
  },
  flatlistContent: {
    justifyContent: 'flex-start',
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
