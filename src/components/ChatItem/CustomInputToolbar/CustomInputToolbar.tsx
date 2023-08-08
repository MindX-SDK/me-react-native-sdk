import React, { useState } from 'react';
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Composer, IMessage, InputToolbar, InputToolbarProps, Send } from 'react-native-gifted-chat';
import ImagePicker, { Image as PickerImageProps} from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { CustomIMessage, ToolBarCustomOptionProps, UploadFileProps } from '../../..';
import { FileHelper, StringHelper, UuidHelper, s, st, vs } from '../../../utils';
import images from '../../../utils/theme/image';
import colors from '../../../utils/theme/colors';
import { isIOS } from '../../../utils/constants/constants';
import Spacer from '../../CustomView/Spacer';
import AttachmentPreview from './components/AttachmentPreview';
import RecorderPlayerResponsiveView from '../../CustomView/RecorderPlayer/RecorderPlayerResponsiveView';
import RecorderPlayerResponsiveManager from '../../CustomView/RecorderPlayer/RecorderPlayerResponsiveManager';
import RemoteStorageModule from '../../../services/RemoteStorage/RemoteStorageModule';


export type CustomInputToolbarProps = InputToolbarProps<CustomIMessage> & {
  toolbarCustomOptions?: ToolBarCustomOptionProps[];
  allowMultiAttachments?: boolean;
  onAddAttachment?: (attachment: UploadFileProps, actionProps: ToolBarCustomOptionProps) => any;
  onRemoveAttachment?: (attachment: UploadFileProps) => any;
}

const CustomInputToolbar: React.FC<CustomInputToolbarProps> = ({
  toolbarCustomOptions = DEFAULT_TOOLBAR_OPTIONS,
  allowMultiAttachments,
  onAddAttachment,
  onRemoveAttachment,
  ...restProps
}) => {
  const [showActions, setShowActions] = useState(false);
  const [attachments, setAttachments] = useState<UploadFileProps[]>([]);

  const handleAddAttachment = (attachment: UploadFileProps, actionProps: ToolBarCustomOptionProps) => {
    if (allowMultiAttachments) {
      attachments.push(attachment);
      setAttachments(attachments);
    } else {
      setAttachments([attachment]);
    }
    onAddAttachment?.(attachment, actionProps);
  }

  const handleUploadAttachment = async (): Promise<string[]> => {
    const uploadResult: string[] = []
    for (let att of attachments) {
      try {
        const result = await RemoteStorageModule.uploadFile(
          att.uri,
          `${UuidHelper.initUUID()}_${Date.now()}_${att.name}`
        );
        
        console.log(result);
        uploadResult.push(result);
      } catch (e) {
        console.log(e);
      }
    }
    setAttachments([]);

    return uploadResult;
  }

  const renderActionItem = (it: ToolBarCustomOptionProps, idx: number) => {
    return (
      <TouchableOpacity
        key={`action-item-${it?.label}-${idx}`}
        style={[
          styles.actionItem,
          {
            marginRight: idx === toolbarCustomOptions?.length - 1 
              ? 0
              : 30,
          }
        ]}
        onPress={async () => {
          setShowActions(false);
          let result: UploadFileProps | undefined;
          try {
            result = await it?.onPress?.();
          } catch (e) {}
          console.log(result);
          if (result) {
            handleAddAttachment(result, it);
          }          
        }}
      >
        {it?.image 
          ? <Image source={it?.image} resizeMode={'contain'} style={styles.actionImage}/> 
          : undefined
        }
        <Spacer height={8} />
        <Text style={styles.actionText}>{it?.label}</Text>
      </TouchableOpacity>
    );
  }

  const renderActionsBar = () => {
    return (
      <ScrollView
        horizontal
        style={styles.actionsBar}
        contentContainerStyle={styles.actionBarContentContainer}
      >
        {toolbarCustomOptions?.map((it, idx) => renderActionItem(it, idx))}
      </ScrollView>
    );
  }

  const renderActionButton = () => {
    return (
      <TouchableOpacity
        style={styles.actionWrapper}
        onPress={() => {
          setShowActions(prev => !prev);
        }}
      >
        <Text style={[styles.iconText]}>+</Text>
      </TouchableOpacity>
    );
  }

  const renderInputToolbar = () => {
    return (
      <InputToolbar
        {...restProps}
        containerStyle={styles.inputContainer}
        // renderActions={actionsProps => {
        //   return (
        //     <Actions
        //       {...actionsProps}
        //     />
        //   );
        // }}
        renderSend={sendProps => (
          <Send
            {...sendProps}
            containerStyle={styles.sendButton}
            alwaysShowSend={!!attachments?.length}
            text={sendProps?.text ||
              (attachments?.length ? HAS_ATTACHMENT_FLAG : undefined)
            }
            onSend={async (messages, shouldResetInputToolbar) => {
              // console.log('seeeeens', messages, shouldResetInputToolbar)
              Array.isArray(messages) ? messages?.[0]?.text : messages?.text;

              if (attachments?.length && HAS_ATTACHMENT_FLAG) {
                let formattedMsgs: Partial<IMessage> | Partial<IMessage>[];
                const uploadResult = await handleUploadAttachment();

                //FIXME: only support 1 attachment for now (uploadResult?.[0])
                if (Array.isArray(messages)) {
                  const idx = messages.findIndex(it => it.text === HAS_ATTACHMENT_FLAG);

                  if (idx >= 0) {
                    formattedMsgs = messages;
                    formattedMsgs[idx].text = uploadResult?.[0];
                  }
                } else {
                  formattedMsgs = messages;
                  formattedMsgs.text = uploadResult?.[0];
                }
              }

              sendProps?.onSend?.(messages, shouldResetInputToolbar);
            }}
          >
            <Image
              source={images.ic_send_plane}
              style={styles.sendIcon}
              resizeMode={'contain'}
            />
          </Send>
        )}
        renderComposer={composerProps => (
          <Composer
            {...composerProps}
            textInputStyle={styles.inputText}
          />
        )}
      />
    );
  }

  const renderAttachment = () => {
    if (attachments?.length) {
      //FIXME: dummy UI
      return (
        <AttachmentPreview
          style={styles.attachments} 
          attachments={attachments}
          onClose={() => {
            setAttachments([]);
          }}
          onRemove={(itm, idx) => {
            const newAtts = [...attachments]
              .filter(it => it?.uri !== itm?.uri);
            setAttachments(newAtts);
          }}
        />
      )
    }
    return undefined;
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <View>
        {renderAttachment()}
        {showActions
          ? renderActionsBar()
          : undefined
        }
      </View>
      <View style={styles.inputRow}>
        {renderActionButton()}
        {renderInputToolbar()}
      </View>
      <View>
        <RecorderPlayerResponsiveView />
      </View>
    </Pressable>
  );
}

export default CustomInputToolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: s(1),
    borderColor: colors.silverChalice40,
  },
  actionWrapper: {
    width: s(32),
    borderRadius: 0,
    backgroundColor: colors.porcelian,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionsBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: vs(10),
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: st(5),
  },
  actionBarContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(15)
  },
  actionItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionImage: {
    width: st(45),
    height: st(45),
  },
  actionText: {
    color: colors.jumbo,
    fontWeight: 'normal',
    fontSize: st(12),
    lineHeight: st(18),
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputContainer: {
    borderLeftWidth: s(1),
    borderLeftColor: colors.silverChalice40,
    //Workaround to remove current style
    top: vs(1),
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: s(40),
    right: 0,
  },
  sendButton: {
    width: s(32),
    paddingRight: s(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sendIcon: {
    width: st(15),
    height: st(15),
  },
  userAvatar: {
    width: 0,
    height: 0,
  },
  iconText: {
    flex: 1,
    color: colors.jumbo,
    fontWeight: 'normal',
    fontSize: st(28),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: s(6),
  },
  attachments: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.porcelian,
    borderRadius: st(5),
  },
  inputText: {
    color: colors.shark,
    fontWeight: isIOS? '600' : 'bold',
    fontSize: st(12),
    textAlign: 'left',
    textAlignVertical: 'center',
  }
});

const DEFAULT_TOOLBAR_OPTIONS: ToolBarCustomOptionProps[] = [
  {
    label: 'Image',
    image: images.ic_pick_image,
    onPress: async () => {
      try {
        const image: PickerImageProps = await ImagePicker.openPicker({
          cropping: false,
          mediaType: 'photo',
        });
        let fileName = isIOS ? image.filename : StringHelper.getFileName(image.path);
        // const imageBase64 = `data:${image.mime};base64,${image?.data}`;
        return {
          uri: image.path,
          type: image.mime,
          name: fileName ?? '',
        };
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
  {
    label: 'File',
    image: images.ic_pick_file,
    onPress: async () => {
      try {
        const pickerResult = await DocumentPicker.pickSingle({
          presentationStyle: 'fullScreen',
          copyTo: 'cachesDirectory',
        })
  
        return {
          uri: pickerResult?.fileCopyUri ?? '',
          type: pickerResult?.type ?? '',
          name: pickerResult?.name ?? '',
        };
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
  {
    label: 'Video',
    image: images.ic_pick_video,
    onPress: async () => {
      try {
        const video = await ImagePicker.openPicker({
          mediaType: 'video',
        });
        let fileName = isIOS ? video.filename : StringHelper.getFileName(video.path);
        return {
          uri: video.path,
          type: video.mime,
          name: fileName ?? '',
        };
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
  {
    label: 'Record',
    image: images.ic_pick_record,
    onPress: async () => {
      try {
        const recordResult: string = await RecorderPlayerResponsiveManager.showPopupAsync({
          type: 'record',
          positionAt: {
            left: 0,
            right: 0,
            bottom: 0,
          }
        })
        console.log(recordResult);
        return {
          uri: recordResult,
          type: 'audio/m4a',
          name: StringHelper.getFileName(recordResult) ?? '',
        };
      } catch (e) {
        console.log(e);
        return Promise.reject(e);
      }
    },
  },
];

/**
 * Just a unique flag to use in text to trigger `onSend`,
 * since `onSend` function only triggered when text is not empty
 */
const HAS_ATTACHMENT_FLAG = 'HAS_ATTACHMENT_FLAG_36c3c4a9-811d-50ef-9605-894619b2081d';