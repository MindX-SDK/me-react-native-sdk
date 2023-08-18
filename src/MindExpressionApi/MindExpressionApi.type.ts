import { TemplateObject } from '../services';

export interface ConversationData {
  /**
   * The sender of message
   * User - from User
   * CAI - from Chat AI
   */
  sender: ConversationParticipants;

  /**Data of the message */
  data: TemplateObject;

  /**Timestamp message created */
  timestamp: number;
}

export type NewMessageProps = {
  newMessage: ConversationData;
  conversationData: ConversationData[];
};

export enum MindExpressionApiEvents {
  NEW_MESSAGE = 'new_message',
}

export type MindExpressionApiEventArgs = {
  new_message: NewMessageProps;
};

export type ConversationParticipants = 'User' | 'CAI';
