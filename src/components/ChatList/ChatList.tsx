import React, { useState, useEffect } from 'react';
import { GiftedChat, GiftedChatProps, IMessage, Message } from 'react-native-gifted-chat';
import { ButtonObjects, ConversationData, CustomReply, DateTimeObjects } from '../..';
import { DataConverter } from '../../utils/DataConverter';
import CustomAvatar from '../ChatItem/CustomAvatar';
import CustomMessageImage from '../ChatItem/CustomMessageImage';
import CustomMessage from '../ChatItem/CustomMessage';
import { StyleSheet } from 'react-native';
import CustomInputToolbar from '../ChatItem/CustomInputToolbar/CustomInputToolbar';

export type ChatListProps = GiftedChatProps & {
  data: ConversationData[];
  onCardButtonPress?: (btnData: ButtonObjects, idx?: number) => any;
  onQuickReplyItemPress?: (qrData: CustomReply, idx?: number) => any;
  onDateTimeSelect?: (datetime: Date, endDate?: Date, pickerProps?: DateTimeObjects) => any;
}

const ChatList: React.FC<ChatListProps> = ({
  data,
  messages = [],
  onCardButtonPress,
  onQuickReplyItemPress,
  onDateTimeSelect,
  ...restProps
}) => {
  const [chatData, setChatData] = useState<IMessage[]>([]);
  useEffect(() => {
    const convertedData = data?.map(it => DataConverter.conversationDataToIMessage(it));
    const sortedData = messages.concat(convertedData)
      ?.sort((a, b) => a.createdAt &&
        b.createdAt &&
        a.createdAt?.valueOf() < b.createdAt?.valueOf()
        ? 1
        : -1
      );

    setChatData(sortedData);
  }, [data])

  return (
    <GiftedChat
      messagesContainerStyle={styles.container}
      messages={chatData}
      renderAvatarOnTop={true}
      renderAvatar={props => {
        return <CustomAvatar {...props} />
      }}
      renderMessageImage={props => (
        <CustomMessageImage {...props} />
      )}
      renderBubble={props => (
        <CustomMessage
          currentUserId={'User'}
          {...props}
          onCardButtonPress={onCardButtonPress}
          onQuickReplyItemPress={onQuickReplyItemPress}
          onDateTimeSelect={onDateTimeSelect}
        />
      )}
      renderInputToolbar={props => (
        <CustomInputToolbar {...props} />
      )}
      shouldUpdateMessage={(currProps, nextProps) =>
        currProps.extraData !== nextProps.extraData
      }
      {...restProps}
    />
  )
}

export default ChatList;

const styles = StyleSheet.create({
  container: {},
});
