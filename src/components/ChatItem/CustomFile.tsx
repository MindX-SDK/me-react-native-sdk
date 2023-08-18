import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../..';
import { FileHelper, StringHelper, s, st } from '../../utils';
import SvgCustomFile from '../../assets/png/ReactSvgs/SvgCustomFile';
import colors from '../../utils/theme/colors';
import { isIOS } from '../../utils/constants/constants';
import Spacer from '../CustomView/Spacer';
import queryString from 'query-string';

export type CustomFileProps = BubbleProps<CustomIMessage> & {};

const CustomFile: React.FC<CustomFileProps> = ({ ...restProps }) => {
  //States
  const [fileSize, setFileSize] = useState('calculating...');
  //Vars that used multi times
  const { position, currentMessage } = restProps;
  //use queryString is to prevent Url with queries
  const pathReader = queryString.parseUrl(currentMessage?.file ?? '');
  const filename = StringHelper.getFileName(pathReader?.url ?? '');
  const ext = StringHelper.getFileExtensions(pathReader?.url ?? '');
  const isLeft = position === 'left';
  //Effects
  useEffect(() => {
    if (currentMessage?.file?.toLowerCase()?.startsWith('http')) {
      fetchFileSize(currentMessage?.file);
    }
  }, [currentMessage]);

  const fetchFileSize = async (path: string) => {
    const blob = await FileHelper.uriToBlob(path);
    setFileSize(StringHelper.getFileSize(blob.size));
  };

  return (
    <View style={styles.container}>
      <SvgCustomFile fileExtensions={ext} />
      <Spacer width={16} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.fileName,
            { color: isLeft ? colors.shark : colors.white },
          ]}
          numberOfLines={1}
          ellipsizeMode={'middle'}
        >
          {filename}
        </Text>
        <Text
          style={[
            styles.fileSize,
            { color: isLeft ? colors.grayChateau : colors.white },
          ]}
          numberOfLines={1}
          ellipsizeMode={'middle'}
        >
          {fileSize ? fileSize : 'calculating...'}
        </Text>
      </View>
      <Spacer width={40} />
    </View>
  );
};

export default CustomFile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: st(5),
  },
  textContainer: {
    width: s(104),
  },
  fileName: {
    color: colors.shark,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: st(12),
    lineHeight: st(16),
    letterSpacing: -0.02,
  },
  fileSize: {
    color: colors.grayChateau,
    fontWeight: isIOS ? '400' : 'normal',
    fontSize: st(10),
    lineHeight: st(14),
    letterSpacing: -0.02,
  },
});
