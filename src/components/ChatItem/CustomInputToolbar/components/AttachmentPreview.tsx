import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { screenHeight, screenWidth, st, vs } from '../../../../utils';
import colors from '../../../../utils/theme/colors';
import { UploadFileProps } from '../../../components.types';
import AutoHeightImage from 'react-native-auto-height-image';
import images from '../../../../utils/theme/image';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import { isIOS } from '../../../../utils/constants/constants';
import Spacer from '../../../CustomView/Spacer';
import PreviewAudioPlayer from './PreviewAudioPlayer';

export type AttachmentPreviewProps = ViewProps & {
  attachments: UploadFileProps[];
  onClose?: () => any;
  onRemove?: (itm: UploadFileProps, idx: number) => any;
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onClose,
  onRemove,
  style,
  ...restProps
}) => {
  //States
  const [paused, setPaused] = useState(true);
  //Refs
  const videoRef = useRef<Video>(null);

  const renderAttachmentImage = (itm: UploadFileProps, idx: number) => {
    return (
      <>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => {
              onClose?.();
            }}
          >
            <Image
              source={images.ic_close}
              resizeMode={'contain'}
              style={styles.imageCloseBtn}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onRemove?.(itm, idx);
            }}
          >
            <Image
              source={images.ic_trash_bin}
              resizeMode={'contain'}
              style={styles.imageTrashBtn}
            />
          </TouchableOpacity>
        </View>
        <AutoHeightImage
          width={screenWidth - styles.container.padding * 2}
          source={{ uri: itm.uri }}
          resizeMode={'contain'}
          style={styles.imageAtt}
        />
      </>
    );
  };

  const renderAttachmentVideo = (itm: UploadFileProps, idx: number) => {
    return (
      <>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => {
              onClose?.();
            }}
          >
            <Image
              source={images.ic_close}
              resizeMode={'contain'}
              style={styles.imageCloseBtn}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onRemove?.(itm, idx);
            }}
          >
            <Image
              source={images.ic_trash_bin}
              resizeMode={'contain'}
              style={styles.imageTrashBtn}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.videoContainer}>
          {/* @ts-ignore */}
          <Video
            ref={videoRef}
            source={{ uri: itm.uri }}
            resizeMode={'contain'}
            style={styles.videoAtt}
            onLoad={(_videoData) => {
              videoRef?.current?.seek(0);
              setPaused(true);
            }}
            onLoadStart={() => {}}
            paused={paused}
            controls={true}
          />
        </View>
      </>
    );
  };

  const renderAttachmentPDF = (itm: UploadFileProps, idx: number) => {
    return (
      <>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => {
              onClose?.();
            }}
          >
            <Image
              source={images.ic_close}
              resizeMode={'contain'}
              style={styles.imageCloseBtn}
            />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {itm?.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onRemove?.(itm, idx);
            }}
          >
            <Image
              source={images.ic_trash_bin}
              resizeMode={'contain'}
              style={styles.imageTrashBtn}
            />
          </TouchableOpacity>
        </View>
        <Pdf
          source={{ uri: itm.uri }}
          onLoadComplete={(numberOfPages, _filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, _numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdfAtt}
        />
      </>
    );
  };

  const renderAttachmentAudioPlayer = (itm: UploadFileProps, idx: number) => {
    return (
      <>
        <PreviewAudioPlayer
          audioPath={itm?.uri}
          onRemove={() => {
            onRemove?.(itm, idx);
          }}
        />
        <Spacer height={20} />
      </>
    );
  };

  const renderAttachmentUnknown = (itm: UploadFileProps, idx: number) => {
    return (
      <>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => {
              onClose?.();
            }}
          >
            <Image
              source={images.ic_close}
              resizeMode={'contain'}
              style={styles.imageCloseBtn}
            />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {itm?.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onRemove?.(itm, idx);
            }}
          >
            <Image
              source={images.ic_trash_bin}
              resizeMode={'contain'}
              style={styles.imageTrashBtn}
            />
          </TouchableOpacity>
        </View>
        <Spacer height={20} />
        <Text style={styles.text} numberOfLines={1} ellipsizeMode={'middle'}>
          {itm?.type}
        </Text>
        <Spacer height={20} />
      </>
    );
  };

  const renderAttachmentItem = (itm: UploadFileProps, idx: number) => {
    let content: React.ReactNode;
    const lowerCaseType = itm.type.toLowerCase();
    if (lowerCaseType.includes('image')) {
      content = renderAttachmentImage(itm, idx);
    } else if (lowerCaseType.includes('video')) {
      content = renderAttachmentVideo(itm, idx);
    } else if (lowerCaseType.includes('pdf')) {
      content = renderAttachmentPDF(itm, idx);
    } else if (lowerCaseType.includes('audio')) {
      content = renderAttachmentAudioPlayer(itm, idx);
    } else {
      content = renderAttachmentUnknown(itm, idx);
    }

    return <View key={`attachment-${itm}-${idx}`}>{content}</View>;
  };
  return (
    <View style={[styles.container, style]} {...restProps}>
      {attachments?.map((it, idx) => renderAttachmentItem(it, idx))}
    </View>
  );
};

export default AttachmentPreview;

const styles = StyleSheet.create({
  container: {
    padding: st(20),
    maxHeight: screenHeight - vs(100),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageCloseBtn: {
    width: st(17),
    height: st(17),
  },
  imageTrashBtn: {
    width: st(20),
    height: st(20),
  },
  imageAtt: {
    maxHeight: screenHeight - vs(280),
    marginVertical: vs(60),
    borderRadius: st(5),
  },
  videoContainer: {
    flex: 1,
    marginVertical: vs(60),
  },
  videoAtt: {
    borderRadius: st(5),
    width: screenWidth - st(20) * 2,
    minHeight: ((screenWidth - st(20) * 2) * 9) / 16 + vs(80), // 16:9 frames + expand 80h
  },
  pdfAtt: {
    // flex: 1,
    width: screenWidth - st(20) * 2,
    height: screenHeight - vs(360),
    marginVertical: vs(10),
    borderRadius: st(5),
  },
  title: {
    fontSize: st(16),
    color: colors.shark,
    fontWeight: isIOS ? '600' : 'bold',
    letterSpacing: -0.02,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  text: {
    fontSize: st(12),
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
