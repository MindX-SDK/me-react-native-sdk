import { IMessage, QuickReplies, Reply } from 'react-native-gifted-chat';
import { CardObjects, DateTimeObjects, TemplateType } from '../services';
import { ImageSourcePropType } from 'react-native';

export interface CustomIMessage extends IMessage {
  cards?: CardObjects[];
  templateType?: TemplateType;
  quickReplies?: CustomQuickReplies;
  datetime?: DateTimeObjects;
  file?: string;
}

export interface CustomQuickReplies extends QuickReplies {
  values: CustomReply[];
}

export interface CustomReply extends Reply {
  'image-uri'?: string;
  'actionType'?: 'link' | 'message';
}

export interface ToolBarCustomOptionProps {
  label: string;
  image?: ImageSourcePropType;
  onPress?: () => Promise<UploadFileProps> | UploadFileProps;
}

export interface UploadFileProps extends Partial<Blob> {
  uri: string;
  type: string;
  name: string;
}
