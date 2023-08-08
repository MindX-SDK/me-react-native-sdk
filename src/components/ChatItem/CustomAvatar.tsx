import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, AvatarProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../../';
import { st } from '../../utils';

export type CustomAvatarProps = AvatarProps<CustomIMessage> & {}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  ...restProps
}) => {
  return (
    <Avatar
      {...restProps}
      imageStyle={{
        left: styles.caiAvatar,
        right: styles.userAvatar,
      }}
    />
  );
}

export default CustomAvatar;

const styles = StyleSheet.create({
  caiAvatar: {
    width: st(32),
    height: st(32),
  },
  userAvatar: {
    width: 0,
    height: 0,
  }
});